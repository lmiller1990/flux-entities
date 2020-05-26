import {
  AjaxBaseState,
  ajaxBaseState,
  selectableBaseState,
  SelectableBaseState,
  isLoading,
  isLoaded,
  isReady,
  hasError,
  selectedEntity,
} from '../src';
 
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