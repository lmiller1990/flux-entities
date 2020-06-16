## Motivation

The flux entity pattern, or simply the _entity_ pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms. This is the official library and reference implementation for the pattern.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled with TypeScript, it becomes even easily to implement, however the same ideas apply to regular JavaScript. This article will build a small application (well, at least the flux store for one) and demonstrate why this pattern is useful. Having some basic guidelines for how you structure each slice of the state makes it easier to scale applications, on board new developers, and reason about the codebase in general. 

The basic idea is each "slice" of the store has the same shape, constructed using a combination of the following properties, depending what is kind of data is stored:

- `all`
- `ids`
- `ready` // new in 0.0.4!
- `loading`
- `touched`
- `errors`
- `selectedId`

This library provides a number of type definitions and utilities functions to help you structure and manage your flux store's state. By having a common structure for each slice of the store, applications are easily to understand and reason about. Furthermore, common helper functions and utilities can be extracted.

## Installation

- Yarn: `yarn add flux-entities`
- NPM: `npm install flux-entities --save`

## The Tutorial

See [ARTICLE.md](https://github.com/lmiller1990/flux-entities/blob/master/ARTICLE.md) for a tutorial explaining the different use cases for the API described below.

## Specification

See SPECIFICATION.md (coming soon)

## Example Projects

- React-Redux (and TypeScript): https://github.com/lmiller1990/flux-entities-react-demo
- Vue-Vuex (and TypeScript): https://github.com/lmiller1990/flux-entities-vue-demo
- Redux, no UI framework: https://github.com/lmiller1990/flux-entities-demo

## API

### Interfaces

#### `EntityMap`

A generic type used in almost all the other types defined in the library. It's simple hashmap. The signature is `[id: number]: T`.

Example:

```ts
interface User {
  id: number
  name: string
}

interface UsersMap extends EntityMap<User> // { [id: number]: User }
```

#### `BaseState`

At a minimum, each slice of the store will have two properties: `all` and `ids`, where `all` is an `EntityMap` and `ids` is an array, normally of `number` or `string`.

Example:

```ts
interface User {
  id: number
  name: string
}

interface UsersState extends BaseState<User> {
  ids: number[]
  all: EntityMap<User>
}
```

If you are using Redux, a reducer might look like this:

```ts
interface UsersState extends BaseState<User> {}

const initialState: UsersState = {
  ids: [],
  all: {}
}

const usersReducer = (state: UsersState = initialState, action): UsersState => {
  if (action.type === 'SET_USERS') {
    return action.payload.reduce<UsersState>((acc, curr) => {
      return {
        ids: Array.from(new Set([...acc.ids, curr.id])),
        all: { ...acc.all, [curr.id]: curr }
      }
    }, { ...state })
  }
}
```

#### `AjaxState`

Provides `touched`, `loading`, `ready` and `errors`. Useful for data loaded from an API.

Example:

```ts
interface ILoadingState extends AjaxState {}

const initialLoadingState: ILoadingState = {
  touched: false,
  loading: false,
  ready: false,
  errors: []
}
```

A state containing just these four properties is not very useful, but you can add your own additional keys as you see fit (`BaseState` is often used alongside `AjaxState` - so much so there is a `AjaxBaseState`, as described next).

#### `AjaxBaseState`

A combination of `BaseState` and `AjaxState`. Maybe you are loading some tasks; the state could look like this:

```ts
interface TasksState extends AjaxBaseState<Task> {}

const initialTasksState: TasksState = {
  ids: [],
  all: {},
  ready: false,
  touched: false,
  loading: false,
  errors: []
}
```

In Redux, an example action/reduce might look like this:

```ts
// Action
const fetchTasks = (projectId: number): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
      dispatch(fetchTasksRequest())
    try {
      const response = await axios.get<Task[]>(`http://api.com/tasks?projectId=${projectId}`)
      dispatch(fetchTasksSuccess(response.data))
    } catch (e) {
      dispatch(fetchTasksFailure((e as AxiosError).message))
    }
  }
}

// Reducer
const tasksReducer = (state: TasksState = initialState, action): TasksState => {
  if (action.type === 'tasksFetchRequest') {
    return {
      ...state,
      ready: false,
      loading: true,
      touched: true,
      errors: []
    }
  }

  if (action.type === 'tasksFetchSuccess') {
    return action.payload.reduce<TasksState>((acc, curr) => {
      return {
        ...state,
        ready: true,
        loading: false,
        ids: Array.from(new Set([...acc.ids, curr.id])),
        all: { ...acc.all, [curr.id]: curr }
      }
    }, { ...state })
  }

  if (action.type === 'tasksFetchFailure') {
    return {
      ...state,
      ready: false,
      loading: false,
      errors: [action.payload],
    }
  }

  return state
}
```

#### `SelectableBaseState`

Add a `selected` property on top of `BaseState`.

Example:

```ts
interface User {
  id: number
  name: string
}

interface SelectableUsersState extends SelectableBaseState<User> {}

const initialUsersState: SelectableUsersState = {
  all: {},  
  ids: [],
  selectedId: null
}
```

In Redux, an reducer might look like this:

```ts
interface ProjectsState extends SelectableBaseState<Project> {}

const initialState: ProjectsState = {
  ids: [],
  all: {},
  selectedId: null
}

const projectsReducer = (state: ProjectsState = initialState, action): ProjectsState => {
  if (action.type === 'setSelectedProject') {
    return {
      ...state,
      selectedId: action.payload
    }
  }
}
```

#### `SelectableAjaxBaseState`

A `SelectableBaseState` that extends `AjaxState`.

### States

Each of the above interfaces has an associated `state` function which returns the default initial state. This is to save you typing the same default state each time you add another slice to your store. For example, instead of:

```ts
const usersState: AjaxBaseState<User> = {
  ids: [],
  all: {},
  ready: false,
  errors: [],
  loading: false,
  touched: false
}
```

You can use the `ajaxBaseState` state function:

```ts
const usersState: AjaxBaseState<User> = {
  ...ajaxBaseState()
}

// or

const usersState: AjaxBaseState<User> = ajaxBaseState<User>()
```

The following state functions are provided:

- `BaseState` -> `baseState`
- `SelectableBaseState` -> `selectableBaseState`
- `AjaxState` -> `ajaxState`
- `AjaxBaseState` -> `ajaxBaseState`
- `SelectableAjaxBaseState` -> `selectableAjaxBaseState`

### Helpers

These helper functions derive commonly used data from states extended from the interfaces described above.

#### `mapEntities`

Returns an array of the interface is passed to `BaseState`.

Example:

```ts
const usersState: BaseState<User> = {
  ids: [1],
  all: {
    1: {
      id: 1,
      name: 'Alice'
    }
  }
}

const users = mapEntities(usersState) // [{ id: 1, name: 'Alice' }]
                                      // `mapEntities` is generic and 
                                      // infers that `users` is of type `User[]`
```

#### `getEntity`

Returns an entity of `BaseState` for a given ID, or null if there isn't one.

Example: 

```ts
const usersState: BaseState<User> = {
  ids: [1],
  all: {
    1: {
      id: 1,
      name: 'Alice'
    }
  }
}

const user = getEntity(usersState, 1) // { id: 1, name: 'Alice' } 
                                         // `user` is inferred to be of type `User`
```

#### `selectedEntity`

Returns the currently selected entity of a `SelectableBaseState`, or null if there isn't one.

Example: 

```ts
const usersState: SelectableBaseState<User> = {
  selectedId: 1,
  ids: [1],
  all: {
    1: {
      id: 1,
      name: 'Alice'
    }
  }
}

const user = selectedEntity(usersState) // { id: 1, name: 'Alice' } 
                                        // `user` in inferred to be of type `User`

#### `isLoaded`

Helper to determine state of a slice of the store that extends `AjaxState` has finishing loading. Basically just checks if the store is _not_ in the initial state (`touched = false`) and `loading` is `false`.

```ts
interface UsersState extends AjaxState<User> {}

const initialUsersState: UsersState = {
  all: {},
  ids: [],
  ready: true,
  touched: true,
  loading: false,
  errors: []
}

isLoaded(initialUsersState) // true
```

#### `isLoading`

Helper to determine state of a slice of the store that extends `AjaxState` is currently loading some data. Basically just checks if the store has not in an error state (for example, the API request has failed) and `loading` is `true`.

```ts
interface UsersState extends AjaxState<User> {}

const initialUsersState: UsersState = {
  all: {},
  ids: [],
  ready: false,
  touched: true,
  loading: true,
  errors: []
}

isLoading(initialUsersState) // true
```

#### `isReady`

Helper to determine state of a slice of the store that extends `AjaxState` is `ready` - that is, the initial request and data required is in the store. `ready` will remain true as long as there is valid data in the store, even if the store is subsequently in a loading state.

```ts
interface UsersState extends AjaxState<User> {}

const initialUsersState: UsersState = {
  all: {},
  ids: [],
  ready: true,
  touched: true,
  loading: false,
  errors: []
}

isReady(initialUsersState) // true
```


#### `hasError`

Helper to determine state of a slice of the store that extends `AjaxState` has failed with an error (`errors.length > 0`).

```ts
interface UsersState extends AjaxState<User> {}

const initialUsersState: UsersState = {
  all: {},
  ids: [],
  ready: false,
  touched: true,
  loading: false,
  errors: ['An error has occurred']
}

hasError(initialUsersState) // true
```
