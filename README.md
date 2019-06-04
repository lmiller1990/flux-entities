## Motivation

See ARTICLE.md.

## Examples

Redux, no UI framework: https://github.com/lmiller1990/flux-entities-demo
React-Redux (and TypeScript): https://github.com/lmiller1990/flux-entities-react-demo

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

interface IUsersMap extends IEntityHashMap<IUser> // { [id: number]: IUser
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

#### `IAjaxState`

Adds `touched`, `loading` and `loaded` on top of `all` and `ids`. Useful for data loaded from an API.

Example:

```ts
interface IUser {
  id: number
  name: string
}

interface IUsersState extends IAjaxState<IUser> {}

const initialUsersState: IUsersState = {
  all: {},
  ids: [],
  touched: false,
  loading: false,
  errors: []
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

#### `ISelectableAjaxState`

An `IBaseState` that extends `IAjaxState` and `ISelectableState`.

### Helpers

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
                        // `mapEntities` is generic and infers that `users` is of type `IUser[]`
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

const user = selectedEntity(usersState) // { id: 1, name: 'Alice' } // `user` in inferred to be of type `IUser`
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
