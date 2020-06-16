import { SelectableBaseState, AjaxState, BaseState } from './types'

function getEntity<T>(state: BaseState<T>, id: string | number): T | null {
  return state.all[id] || null
}

function selectedEntity<T>(state: SelectableBaseState<T>): T | null {
  return getEntity(state, state.selectedId)
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
  getEntity,
  mapEntities,
  isReady,
  isLoaded,
  isLoading,
  hasError
}
