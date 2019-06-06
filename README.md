## Motivation

The flux entity pattern, or simply the _entity_ pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms. This is the official library and reference implementation for the pattern.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled with TypeScript, it becomes even easily to implement, however the same ideas apply to regular JavaScript. This article will build a small application (well, at least the flux store for one) and demonstrate why this pattern is useful. Having some basic guidelines for how you structure each slice of the state makes it easier to scale applications, on board new developers, and reason about the codebase in general. 

The basic idea is each "slice" of the store has the same shape, constructed using a combination of the following properties, depending what is kind of data is stored:

- `all`
- `ids`
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

Provides `touched`, `loading` and `loaded`. Useful for data loaded from an API.

Example:

```ts
interface ILoadingState extends IAjaxState {}

const initialLoadingState: ILoadingState = {
  touched: false,
  loading: false,
  errors: []
}
```

A state containing just these three properties is not very useful, but you can add your own additional keys as you see fit (`IBaseState` is often used alongside `IAjaxState` - so much so there is a `IAjaxBaseState`, as described next).

#### `IAjaxBaseState`

A combination of `IBaseState` and `IAjaxState`. Maybe you are loading some tasks; the state could look like this:

```ts
interface ITasksState extends IAjaxBaseState<ITask> {}

const initialTasksState: ITasksState = {
  ids: [],
  all: {},
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

### States

Each of the above interfaces has an associated `state` function which returns the default initial state. This is to save you typing the same default state each time you add another slice to your store. For example, instead of:

```ts
const usersState: IAjaxBaseState<IUser> = {
  ids: [],
  all: {},
  errors: [],
  loading: false,
  touched: false
}
```

You can use the `ajaxBaseState` state function:

```ts
const usersState: IAjaxBaseState<IUser> = {
  ...ajaxBaseState()
}

// or

const usersState: IAjaxBaseState<IUser> = ajaxBaseState<IUse>()
```

The following state functions are provided:

- `IBaseState` -> `baseState`
- `ISelectableState -> `selectableState`
- `IAjaxState -> `ajaxState`
- `IAjaxBaseState -> `ajaxBaseState`
- `ISelectableAjaxBaseState -> `selectableAjaxBaseState`

### Helpers

These helper functions derive commonly used data from states extended from the interfaces described above.

#### `mapEntities`

Returns an array of the interface is passed to `IBaseState`.

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
