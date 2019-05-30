import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux'

import { usersReducer, projectsReducer, fetchTasks } from './reducers'
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { selectedEntity } from './selectors';

const rootReducer = combineReducers({
  users: usersReducer,
  projects: projectsReducer
})



const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware)
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

// console.log(store.getState())
// console.log(store.getState().users.all[1])

const project = selectedEntity(store.getState().projects);

(store.dispatch as ThunkDispatch<{}, {}, AnyAction>)(fetchTasks())