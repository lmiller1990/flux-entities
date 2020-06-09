import { SelectableBaseState, AjaxState, BaseState } from './types'

function selectedEntity<T>(state: SelectableBaseState<T>): T | null {
  if (!state.selectedId) {
    return null
  }

  return state.all[state.selectedId]
}

function selectEntity<T>(state: BaseState<T>, id: any): T | null {
  return state.all[id] || null
}

function mapEntities<T>(state: BaseState<T>): T[] {
  return state.ids.map(id => state.all[id])
}

function isReady<T>(state: AjaxState<T>): boolean {
  return state.ready
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
  selectEntity,
  mapEntities,
  isReady,
  isLoaded,
  isLoading,
  hasError
}
