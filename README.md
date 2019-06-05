## Motivation

The flux entity pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled a strongly typed language like TypeScript, it becomes even easily to implement.

The basic idea is each "slice" of the store has the same shape, constructed using a combination of the following properties, depending what is kind of data is stored:

- `all`
- `ids`
- `loading`
- `loaded`
- `errors`
- `selectedId`

This library provides a number of type definitions and utilities functions to help you structure and manage your flux store's state. By having a common structure for each slice of the store, applications are easily to understand and reason about. Furthermore, common helper functions and utilties can be extracted.

## Specification

See SPECIFICATION.md.

## Examples

- React-Redux (and TypeScript): https://github.com/lmiller1990/flux-entities-react-demo
- Redux, no UI framework: https://github.com/lmiller1990/flux-entities-demo

## API

### Types

#### `IEntityHashMap`

A generic type used in almost all the other types defined in the library. It's simple hashmap. The signature is `[id: number]: T`.

Example:

```ts
interface IUser {
  id: number
  name: string
}

interface IUsersMap extends IEntityHashMap<IUser> // { [id: number]: IUser }
```

#### `IBaseState`

At a minimum, each slice of the store will have two properties: `all` and `ids`, where `all` is an `IEntityHashMap` and `ids` is an array, normally of `number` or `string`.

Example:

```ts
interface IUser {
  id: number
  name: string
}

interface IUsersState extends IBaseState<IUser> {
  ids: number[]
  all: IEntityHashMap<IUser>
}
```

If you are using Redux, a reducer might look like this:

```ts
interface IUsersState extends IBaseState<IUser> {}

const initialState: IUsersState = {
  ids: [],
  all: {}
}

const usersReducer = (state: IUsersState = initialState, action): IUsersState => {
  if (action.type === 'SET_USERS') {
    return action.payload.reduce<IUsersState>((acc, curr) => {
      return {
        ids: Array.from(new Set([...acc.ids, curr.id])),
        all: { ...acc.all, [curr.id]: curr }
      }
    }, { ...state })
  }
}
```

#### `IAjaxState`

Adds `touched`, `loading` and `loaded` on top of `all` and `ids`. Useful for data loaded from an API.

Example:

```ts
interface ITask {
  id: number
  title: string
}

interface ITasksState extends IAjaxState<ITask> {}

const initialTasksState: ITasksState = {
  all: {},
  ids: [],
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
      const response = await axios.get<ITask[]>(`http://api.com/tasks?projectId=${projectId}`)
      dispatch(fetchTasksSuccess(response.data))
    } catch (e) {
      dispatch(fetchTasksFailure((e as AxiosError).message))
    }
  }
}

// Reducer
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
    return action.payload.reduce<ITasksState>((acc, curr) => {
      return {
        ...state,
        loading: false,
        ids: Array.from(new Set([...acc.ids, curr.id])),
        all: { ...acc.all, [curr.id]: curr }
      }
    }, { ...state })
  }

  if (action.type === 'tasksFetchFailure') {
    return {
      ...state,
      loading: false,
      errors: [action.payload],
    }
  }

  return state
}
```

#### `ISelectableState`

Add a `selected` property on top of `IBaseState`.

Example:

```ts
interface IUser {
  id: number
  name: string
}

interface ISelectableUsersState extends ISelectableState<IUser> {}

const initialUsersState: ISelectableUsersState = {
  all: {},  
  ids: [],
  selectedId: null
}
```

In Redux, an reducer might look like this:

```ts
interface IProjectsState extends ISelectableState<IProject> {}

const initialState: IProjectsState = {
  ids: [],
  all: {},
  selectedId: null
}

const projectsReducer = (state: IProjectsState = initialState, action): IProjectsState => {
  if (action.type === 'setSelectedProject') {
    return {
      ...state,
      selectedId: action.payload
    }
  }
}
```

#### `ISelectableAjaxState`

An `IBaseState` that extends `IAjaxState` and `ISelectableState`.

### Helpers

These helpers assume you are following the specification and implementing your actions and reducers/mutations as described above.

#### `mapEntities`

Returns an array of whatever interface is passed to `IBaseState`.

Example:

```ts
const usersState: IBaseState<IUser> = {
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
                                      // infers that `users` is of type `IUser[]`
```

#### `selectedEntity`

Returns the currently selected entity of a `ISelectableState`, or null if there isn't one.

Example: 

```ts
const usersState: ISelectableState<IUser> = {
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
                                        // `user` in inferred to be of type `IUser`
```

#### `isLoaded`

Helper to determine state of a slice of the store that extends `IAjaxState` has finishing loading. Basically just checks if the store is _not_ in the initial state (`touched = false`) and `loading` is `false`.

```ts
interface IUsersState extends IAjaxState<IUser> {}

const initialUsersState: IUsersState = {
  all: {},
  ids: [],
  touched: true,
  loading: false,
  errors: []
}

isLoaded(initialUsersState) // true
```

#### `isLoading`

Helper to determine state of a slice of the store that extends `IAjaxState` is currently loading some data. Basically just checks if the store has not in an error state (for example, the API request has failed) and `loading` is `true`.

```ts
interface IUsersState extends IAjaxState<IUser> {}

const initialUsersState: IUsersState = {
  all: {},
  ids: [],
  touched: true,
  loading: true,
  errors: []
}

isLoading(initialUsersState) // true
```

#### `isErrorState`

Helper to determine state of a slice of the store that extends `IAjaxState` has failed with an error (`errors.length > 0`).

```ts
interface IUsersState extends IAjaxState<IUser> {}

const initialUsersState: IUsersState = {
  all: {},
  ids: [],
  touched: true,
  loading: false,
  errors: ['An error has occurred']
}

isErrorState(initialUsersState) // true
```
