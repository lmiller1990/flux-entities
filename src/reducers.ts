interface IUser {
  id: number
  name: string
}

import { IEntityHashMap, IBaseState } from './types'

const initialState: IBaseState<IUser> = {
  ids: [],
  all: {}
}

const usersReducer = (