import { ISelectableState, IAjaxState, IBaseState } from './types'

function selectedEntity<T>(state: ISelectableState<T>): T | null {
  if (!state.selectedId) {
    return null
  }

  return state.all[state.selectedId]
}

function mapEntities<T>(state: IBaseState<T>): T[] {
  return state.ids.map(id => state.all[id])
}

function isLoaded<T>(state: IAjaxState<T>): boolean {
  return !state.loading && state.touched && !state.errors.length
}

function isLoading<T>(state: IAjaxState<T>): boolean {
  return state.loading && state.touched && !state.errors.length
}

function isErrorState<T>(state: IAjaxState<T>): boolean {
  return !state.loading && state.touched && state.errors.length > 0
}


export {
  selectedEntity,
  mapEntities,
  isLoaded,
  isLoading,
  isErrorState
}
