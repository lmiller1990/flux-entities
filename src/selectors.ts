import { ISelectableState } from './types'

function selectedEntity<T>(state: ISelectableState<T>): T {
  return state.all[state.selectedId]
}

export { selectedEntity }