interface IUser {
  id: number
  name: string
}

interface IProject {
  id: number
  title: string
  startDate: Date
  endDate: Date
}

import { IEntityHashMap, IBaseState, ISelectableState } from './types'

const initialState: IBaseState<IUser> = {
  ids: [],
  all: {}
}

interface ISetUsers {
  type: 'SET_USERS',
  payload: {
    users: Array<{
      id: number
      firstName: string
      lastName: string
    }>
  }
}

const usersReducer = (state = initialState, action: ISetUsers): IBaseState<IUser> => {
  if (action.type === 'SET_USERS') {
    return {
      ids: action.payload.users.map(user => user.id),
      all: action.payload.users.reduce<IEntityHashMap<IUser>>((acc, user) => {
        acc[user.id] = {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`
        }
        return acc
      }, {})
    }
  }

  return state
}

interface IProjectsState extends ISelectableState<IProject> {

}

const initialProjectsState: IProjectsState = {
  ids: [],
  all: {},
  selectedId: null
}

interface ISetProjects {
  type: 'SET_PROJECTS',
  payload: IProject[]
}

const projectsReducer = (state = initialProjectsState, action: ISetProjects): IProjectsState => {
  if (action.type === 'SET_PROJECTS') {
    return {
      selectedId: 1,
      ids: action.payload.map(p => p.id),
      all: action.payload.reduce<IEntityHashMap<IProject>>((acc, p) => {
        acc[p.id] = {
          id: p.id,
          title: p.title,
          startDate: p.startDate,
          endDate: p.endDate,
        }
        return acc
      }, {})
    }
  }

  return state
}

import axios from 'axios'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'


interface ITask {
  id: number
  title: string
  projectId: number
  assignee: number
}

export const fetchTasks = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    try {
      dispatch({ type: 'LOAD_TASKS' })
      const response = await axios.get<ITask[]>('http://www.mocky.io/v2/5cef982f30000028383cd155')
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
}

export {
  usersReducer,
  projectsReducer
}
