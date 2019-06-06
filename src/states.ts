import {
  IBaseState,
  ISelectableState,
  IAjaxState,
  IAjaxBaseState,
  ISelectableAjaxBaseState
 } from './types'

export function baseState<T>(): IBaseState<T> {
  return {
    ids: [],
    all: {}
  }
}

export function selectableState<T>(): ISelectableState<T> {
  return {
    ...baseState<T>(),
    selectedId: null
  }
}

export function ajaxState<ErrorType = string>(): IAjaxState<ErrorType> {
  return {
    touched: false,
    loading: false,
    errors: []
  }
}

export function ajaxBaseState<T, ErrorType = string>(): IAjaxBaseState<T, ErrorType> {
  return {
    ...baseState<T>(),
    ...ajaxState<ErrorType>()
  }
}

export function selectableAjaxBaseState<T, ErrorType = string>(): ISelectableAjaxBaseState<T, ErrorType> {
  return {
  ...baseState<T>(),
  ...ajaxState<ErrorType>(),
  ...selectableState<T>()
  }
}