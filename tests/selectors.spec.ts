import { AjaxBaseState, ajaxBaseState } from '../src';
import { isReady } from '../src'
 
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
