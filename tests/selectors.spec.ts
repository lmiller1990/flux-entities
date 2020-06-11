import {
  AjaxBaseState,
  ajaxBaseState,
  BaseState,
  baseState,
  selectableBaseState,
  SelectableBaseState,
  isLoading,
  isLoaded,
  isReady,
  hasError,
  getEntity,
  mapEntities,
  selectedEntity,
} from '../src';

describe('getEntity', () => {
  const initialState: BaseState<any> = {
    ...baseState(),
    ids: [ 1 ],
    all: { 1: { key: 'value' } },
  }

  it('returns null, because no ID was given', () => {
    const actual = getEntity(initialState, null)
    expect(actual).toBe(null)
  })

  it('returns the object in the store with the given ID', () => {
    const state: BaseState<any> = { ...initialState }
    const actual = getEntity(state, 1)
    expect(actual).toStrictEqual({ key: 'value' })
  })
})

describe('mapEntities', () => {
  it('returns empty array, because the store is empty', () => {
    const emptyState: BaseState<Record<number, { key: string }>> = {
      ...baseState(),
      ids: [],
      all: {},
    }

    const actual = mapEntities(emptyState)
    expect(actual).toEqual([])
  })

  it('returns an array of all objects in the store', () => {
    const state: BaseState<any> = {
      ...baseState(),
      ids: [ 1 ],
      all: { 1: { key: 'value' } },
    }

    const actual = mapEntities(state)
    expect(actual).toEqual([{ key: 'value' }])
    expect(actual.length).toBe(1)
  })
})

describe('selectedEntity', () => {
  const initialState: SelectableBaseState<any> = {
    ...selectableBaseState(),
    ids: [ 1 ],
    all: { 1: { key: 'value' } },
  }

  it('returns null, because no selected ID by default', () => {
    const actual = selectedEntity(initialState)
    expect(actual).toBe(null)
  })

  it('returns the object in the store with the selected ID', () => {
    const state: SelectableBaseState<any> = { ...initialState, selectedId: 1}
    const actual = selectedEntity(state)
    expect(actual).toStrictEqual({ key: 'value' })
  })
})

describe('isLoading', () => {
  it('is not loading by default', () => {
    const state: AjaxBaseState<any> = ajaxBaseState()
    const actual = isLoading(state)
    expect(actual).toBe(false)
  })

  it('is loading', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), loading: true, touched: true, errors: []}
    const actual = isLoading(state)
    expect(actual).toBe(true)
  })
})

describe('isLoaded', () => {
  it('has not loaded by default', () => {
    const state: AjaxBaseState<any> = ajaxBaseState()
    const actual = isLoaded(state)
    expect(actual).toBe(false)
  })

  it('has loaded', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), loading: false, touched: true, errors: []}
    const actual = isLoaded(state)
    expect(actual).toBe(true)
  })
})

describe('isReady', () => {
  it('is not ready by default', () => {
    const state: AjaxBaseState<any> = ajaxBaseState()
    const actual = isReady(state)
    expect(actual).toBe(false)
  })

  it('is ready', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), ready: true}
    const actual = isReady(state)
    expect(actual).toBe(true)
  })
})

describe('hasError', () => {
  it('has no errors', () => {
    const state: AjaxBaseState<any> = ajaxBaseState()
    const actual = hasError(state)
    expect(actual).toBe(false)
  })

  it('has errors', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), loading: false, touched: true, errors: ['Sample error']}
    const actual = hasError(state)
    expect(actual).toBe(true)
  })
})