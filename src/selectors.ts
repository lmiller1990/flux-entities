import { SelectableState, AjaxState, BaseState } from './types'

function selectedEntity<T>(state: SelectableState<T>): T | null {
  if (!state.selectedId) {
    return null
  }

  return state.all[state.selectedId]
}

function mapEntities<T>(state: BaseState<T>): T[] {
  return state.ids.map(id => state.all[id])
}

function isLoaded<T>(state: AjaxState<T>): boolean {
  return !state.loading && state.touched && !state.errors.length
}

function isLoading<T>(state: AjaxState<T>): boolean {
  return state.loading && state.touched && !state.errors.length
}

function hasError<T>(state: AjaxState<T>): boolean {
  return !state.loading && state.touched && state.errors.length > 0
}


export {
  selectedEntity,
  mapEntities,
  isLoaded,
  isLoading,
  hasError
}
