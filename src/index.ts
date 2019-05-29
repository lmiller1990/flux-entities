import { createStore, combineReducers } from 'redux'

import { usersReducer, projectsReducer } from './reducers'
import { selectedEntity } from './selectors';

const rootReducer = combineReducers({
  users: usersReducer,
  projects: projectsReducer
})

const store = createStore(
  rootReducer
)

store.dispatch({
  type: 'SET_USERS',
  payload: {
    users: [
      { id: 1, firstName: 'Alice', lastName: 'Black' },
      { id: 2, firstName: 'Bobby', lastName: 'Smith' }
    ]
  }
})


store.dispatch({
  type: 'SET_PROJECTS',
  payload: [
    { id: 1, title: 'Project A', startDate: new Date(), endDate: new Date() }
  ]
})

console.log(store.getState())
console.log(store.getState().users.all[1])

console.log(
  selectedEntity(store.getState().projects)
)