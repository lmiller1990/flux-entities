import {
  AjaxBaseState,
  ajaxBaseState,
  selectableBaseState,
  SelectableBaseState,
  isLoading,
  isLoaded,
  hasError,
  selectedEntity,
} from '../src';
 
describe('selectedEntity', () => {
  it('is not the specified ID, none selected by default', () => {
    const state: SelectableBaseState<any> = selectableBaseState()
    const actual = selectedEntity(state)
    expect(actual).not.toBe(null)
  })

  it('is the specified ID', () => {
    const id = 1
    const state: SelectableBaseState<any> = { ...selectableBaseState(), selectedId: 1}
    const actual = selectedEntity(state)
    expect(actual).toBe(1)
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