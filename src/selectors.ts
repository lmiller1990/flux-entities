import { SelectableBaseState, AjaxState, BaseState } from './types'

function getEntities<T>(state: BaseState<T>, ids: Array<number | string>): T[] {
  return ids.map(id => state.all[id])
}

function selectedEntity<T>(state: SelectableBaseState<T>): T | null {
  if (!state.selectedId) {
    return null
  }

  return state.all[state.selectedId]
}

function mapEntities<T>(state: BaseState<T>): T[] {
  return getEntities(state, state.ids)
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
  getEntities,
  mapEntities,
  isReady,
  isLoaded,
  isLoading,
  hasError
}
