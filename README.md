## The Flux Entity Pattern

The flux entity pattern, or simply the _entity_ pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled with TypeScript, it becomes even easily to implement, however the same ideas apply to regular JavaScript. This article will build a small application (well, at least the flux store for one) and demonstrate why this pattern is useful.

## The Application

The application we build is for a generic project management tool. There will be three entities in our flux store: users, projects and tasks. As expected, a users can have projects, a project has tasks, and users are assigned to tasks. We want to state to be as flat an flexible as possible, to let us have maximum flexiblity when building the UI. The state of your SPA should not be domain specific, but as loosely coupled as possible.

## Defining the Reducer State

In the flux entity pattern, all reducers start from the same base shape, extending various interfaces where needed. The bulk of the work from now on will be introducing the types that are used in the flux entity pattern, and why they are used.

## The Base State

This base shape looks like this:

```ts
interface IEntityHashMap<T> {
    [id: number]: T
}

interface IBaseState<T> {
    id: number[]
    all: IEntityHashMap<T>
}
```

This is already a great start. Accessing a single entity is a more common need than iterting over the entire collection. If you simply store all the entities in an array, whenever you want a specific one, you need to iterate over each element, checking some key (usually an id). With the hashmap, we simply do `users.all[id]` to retrieve a specific user's details.By storing the actual data in a hash map, looking up a user is a O(n) operation. 

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

## The Selectable State

Often, applications will display a list of items, allowing the user to choose one and see more detail. In the application I'm describing, we show a list of projects, and a user can choose one. This is handled by extending  `ISelectableState` in the flux entity pattern:

```ts
export interface ISelectableState {
  selectedId: number | null
}
```

If a project is selected, `selectedId` is the `id` of the project. If not, it is `null` - as opposed to `undefined`. I prefer `null` it's more explicit. 

The project state and reducer could look like this:

```ts
interface IProjectsState extends IBaseState<IProject>, ISelectableState {

}

const initialProjectsState: IProjectsState = {
  ids: [],
  all: {},
  selectedId: null
}

const projectsReducer = (state = initialProjectsState, action): IBaseState<IProject> => {
  return state
}
```

A simple utility function can be used to get the currently selected project

