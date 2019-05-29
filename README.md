## The Flux Entity Pattern

The flux entity pattern, or simply the _entity_ pattern, is a common pattern I identified and extracted over the last few years of working on various single page apps, mainly in Vue and React, using Vuex and Redux respectively. This pattern, however is applicable to any flux library, and likely state management paradigms.

Specifically, this pattern lays out some common rules for how you should structure the state of your flux store. When coupled with TypeScript, it becomes even easily to implement, however the same ideas apply to regular JavaScript. This article will build a small application (well, at least the flux store for one) and demonstrate why this pattern is useful.

## The Application

The application we build is for a generic project management tool. There will be three entities in our flux store: users, projects and tasks. As expected, a users can have projects, a project has tasks, and users are assigned to tasks. We want to state to be as flat an flexible as possible, to let us have maximum flexiblity when building the UI. The state of your SPA should not be domain specific, but as loosely coupled as possible.

## Defining the Reducer State

In the flux entity pattern, all reducers start from the same base shape, extending various interfaces where needed. This base shape looks like this:

```ts
interface IEntityHashMap<T> {
    [id: number]: T
}

interface IBaseState<T> {
    id: number[]
    all: IEntityHashMap<T>
}
```