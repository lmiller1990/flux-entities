import { AjaxBaseState, ajaxBaseState } from '../src';
import { isReady } from '../src'
 
describe('isReady', () => {
  it('is not ready', () => {
    const state: AjaxBaseState<any> = ajaxBaseState()
    const actual = isReady(state)
    expect(actual).toBe(false)
  })

  it('is not ready', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), touched: true, loading: true }
    const actual = isReady(state)
    expect(actual).toBe(false)
  })

  it('is not ready', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), touched: true, loading: false, errors: ['error'] }
    const actual = isReady(state)
    expect(actual).toBe(false)
  })

  it('is ready', () => {
    const state: AjaxBaseState<any> = { ...ajaxBaseState(), ready: true, loading: false, touched: true }
    const actual = isReady(state)
    expect(actual).toBe(true)
  })
})
