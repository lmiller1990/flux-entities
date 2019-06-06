## The Flux Entity Pattern

The flux entity pattern, or simply the _entity_ pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled with TypeScript, it becomes even easily to implement, however the same ideas apply to regular JavaScript. This article will build a small application (well, at least the flux store for one) and demonstrate why this pattern is useful. Having some basic guidelines for how you structure each slice of the state makes it easier to scale applications, on board new developers, and reason about the codebase in general. 

## The Tutorial

To illustrate the concepts and introduce the API for the `flux-entities`, we will discuss and design the state of a store of a generic project management tool. There will be three "slices" of state in our store in our flux store: `users`, `projects` and `tasks`. For the benefit of explaining the `flux-entities` library, users will be loaded synchronously. Projects are also loaded asynchronosly, and at any one time a single project can be "selected". Tasks are loaded asynchronously (when a project is selected, for example).

When using `flux-entities`, all reducers start from the same base shape, extending various interfaces where needed. The bulk of the work from now on will be introducing the types that are used in the flux entity pattern, and why they are used.

## The `users` State

As stated above the purpose of this article, we will pretend the data for the users is the following JSON object, hardcoded in the application (thus is will be loaded synchronously). When I discuss the projects and tasks states, we will see how to handle asynchronous loading using the `flux-entities` library.

The users data might look looks like this:

```json
[
  { id: 1, name: 'Alice' }
  { id: 2, name: 'Bob' }
]
```

And the corresponding interface will look like:

```ts
interface IUser {
  id: number
  name: string
}
````

For a state that simply stores some data that is loaded in a non asynchronous fashion, `flux-entities` provides the `IBaseState` interface, which is defined like this:

```ts
interface IEntityHashMap<T> {
    [id: number]: T
}

interface IBaseState<T> {
    id: number[]
    all: IEntityHashMap<T>
}
```

We can extend from `IBaseState` and define the `users` state:

```ts
interface IUsersState extends IBaseState<IUser> {}
```

`flux-entities` also includes factory functions to initialize the initial state. Since we are extending from `IBaseState`, we can use the `baseState` function to initialize the state:

```ts
const initialUsersState: IUserState = baseState<IUser>() 
// This creates the following:
// {
//   ids: [],
//   all: {}
// }
```

Accessing a single entity is a more common need than iterating over the entire collection. This is why storing the data in a hashmap, `all`, is useful. 

If you store all the entities in an array, for example `state.users` where `users` is `IUser[]`, whenever you want a specific one, you need to iterate over each element, checking some key (usually an id). This has a complexity of O(n) With the hashmap, we simply do `users.all[id]` to retrieve a specific user's details. By storing the actual data in a hash map, looking up a user is a O(1) operation.

If you do want to iterate over them (for example, if we want to show an entire list of projects) you would simply do:

```ts
const users = store.getState().users

for (const id of users.ids) {
    console.log(
        users.all[id].name // access the user like this
    )
}
```

In a React/Vue app:

```jsx
<div v-for="id of $store.state.users.ids">
    <div>{{ $store.state.users.all[id].name }}</div>
</div>

{users.ids.map(id => <div>{users.all[id].name}<div>)}
```

Looping over the `ids` and access the actual data in the `all` hashmap is not that ideal. One such example is when you are using the container/component pattern - you would need to pass both the `ids` and `all` objects in `mapStateToProps`. There is a helper method to simplify this: `mapEntities`. It takes a `BaseState` and returns the entities as an array:

```ts
const users = mapEntities(store.getState.users)
```

`mapEntities` signature looks is: `mapEntities<T>(state: IBaseState<T>) => T[]` - it's generic, so in the example above, `users` will be inferred to be `IUser[]`.

Now your `mapStateToProps` function would just be:

```ts
const mapStateToProps = (state: State): Props => {
  return {
    users: mapEntities(state.users)
  }
}
```

And you component will receive an array of `IUser` as `props.users`.

## The `projects` state

Often, applications will display a list of items, allowing the user to choose one and see more detail. In the application we are designing the store for, we show a list of projects, and a user can choose one. `flux-entities` provides the `ISelectableState` interface for this purpose.

```ts
interface ISelectableState<T> extends IBaseState<T> {
  selectedId: number | null
}
```

If a project is selected, `selectedId` is the `id` of the project. If not, it is `null` - as opposed to `undefined`. I prefer `null` it's more explicit. By extending `IBaseState`, `ids` and `all` keys are also included.

The project state could look like this:

```ts
interface IProjectsState extends ISelectableState<IProject> {}

const initialProjectsState: IProjectsState = {
  ids: [],
  all: {},
  selectedId: null
}
```

Of course, you are free to add additional keys to the state - `flux-entities` just provides a common base.

A utility function is included get the currently selected project, `selectedEntity`:

```ts
const currentProject = selectedEntity(store.getState().projects) // project is inferred as an IProject
```

As with the users example, you can use the `selectableBaseState()` function to initialize the state.

## The `tasks` state

We don't want to fetch all the tasks when the app is loaded - that wouldn't scale in terms of performance. We will fetch them asynchronously, when a project is selected. This introduces the `IAjaxState`, another part of `flux-entities`. When loading some data from a server, there are three states to consider:

1. The initial state. No request has been made, no data has been fetched.
2. The request has been initiated, but is yet to complete. Show a spinner.
3. The request has completed - either an error occurred, or the request was successful and we now have the data.

The `IAjaxState` definition looks like this:

```ts
interface IAjaxState<T, ErrorType = string> {
  loading: boolean
  touched: boolean
  errors: ErrorType[]
}
```

For our `tasks` state, we want to store entities, as well as handle asynchronous behaviour. We can use `IAjaxBaseState` - an interface extending both `IAjaxState` and `IBaseState`. The shape of the `tasks` state will be like this:

```ts
interface ITasksState extends IAjaxBaseState<ITask> {}

const initialTasksState: ITasksState = {
  loading: false
  touched: false, 
  errors: [],
  all: {},
  ids: []
}
```

Again, you can use the `ajaxBaseState` helper function if you do not want to declare the initial state of each key.

Using `touched`, `errors` and `loading` we can figure out the state of the application and update the UI accordingly:

- If `touched` is false, we know that slice of the store is in it's initial state - no request has been made. This is useful for initializing the first API call. We can do something, such as make the first API call to load the data.
- If `loading` is `true`, we know the API call has been initiated. Do something like display a spinner. 
- When `touched` is `true` and `loading` is false, the API calls has finished. If:
  - if `errors` if empty, the API call was successful. No need to do anything.
  - if `errors.length > 0`, an error occurred. Update the application accordingly.

`flux-entities` bundles these three helper functions, called `isLoading`, `isLoaded` and `isErrorState`, to help determine out the current state.

### A Full Example (`tasks` state)

The reducer for `tasks` might look something like this:

```ts
import { IAjaxBaseState } from 'flux-entities'

interface ITasksState extends IAjaxBaseState<ITask> {}
const initialState: ITasksState = ajaxBaseState<ITask>()

const tasksReducer = (state: ITasksState = initialState, action): ITasksState => {
  if (action.type === 'tasksFetchRequest') {
    return {
      ...state,
      loading: true,
      touched: true,
      errors: []
    }
  }

  if (action.type === 'tasksFetchSuccess') {
    return (
      action.payload.reduce<ITasksState>((acc, curr) => {
        return {
          ...state,
          loading: false,
          ids: Array.from(new Set([...acc.ids, curr.id])),
          all: { ...acc.all, [curr.id]: curr }
        }
      }, { ...state })
    )
  }

  if (action.type === 'tasksFetchFailure') {
    return {
      ...state,
      loading: false,
      errors: [action.payload]
    }
  }

  if (action.type === 'tasksClear') {
    return ajaxBaseState<ITask>()
  }

  return state
}

export { tasksReducer }
```

If you are using React, you could then consume this state with the following container/component combination:

Container: 

```ts
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { mapEntities, isLoading, isLoaded } from 'flux-entities'

import { Tasks, IStateProps, IDispatchProps } from './Tasks'
import { IState } from './store'
import { fetchTasks, clearTasks } from './actions'

const mapStateToProps = (state: IState): IStateProps => {
  console.log(state.users)
  return {
    tasks: mapEntities(state.tasks),
    loading: isLoading(state.tasks),
    loaded: isLoaded(state.tasks),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): IDispatchProps => {
  return {
    fetchTasks: () => dispatch(fetchTasks()),
    clearTasks: () => dispatch(clearTasks())
  }
}

const TasksContainer = connect(mapStateToProps, mapDispatchToProps)(Tasks)

export {
  TasksContainer
}
```

Component:

```ts
import React from 'react'

import { ITask } from './types'

export interface IStateProps {
  users: ITask[]
  loading: boolean
  loaded: boolean
}

export interface IDispatchProps {
  fetchTasks: () => Promise<void>
  clearTasks: () => void
}

type TProps = IStateProps & IDispatchProps

class Tasks extends React.PureComponent<TProps> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <button onClick={this.props.fetchTasks}>Fetch Tasks</button>
        <button onClick={this.props.clearTasks}>Clear State</button>
        <div>
          <div>Loading: {this.props.loading ? 'true' : 'false'}</div>
          <div>Loaded: {this.props.loaded ? 'true': 'false'}</div>
          <ul>
            {
              this.props.tasks.map(user => <li key={task.id}>ID: {task.id}. Name: {task.name}</li>)
            }
          </ul>
        </div>
      </React.Fragment>
    )
  }
}

export {
  Tasks
}
```