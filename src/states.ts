import {
  BaseState,
  SelectableState,
  AjaxState,
  AjaxBaseState,
  SelectableAjaxState
 } from './types'

export function baseState<T>(): BaseState<T> {
  return {
    ids: [],
    all: {}
  }
}

export function selectableState<T>(): SelectableState<T> {
  return {
    ...baseState<T>(),
    selectedId: null
  }
}

export function ajaxState<ErrorType = string>(): AjaxState<ErrorType> {
  return {
    ready: false,
    touched: false,
    loading: false,
    errors: []
  }
}

export function ajaxBaseState<T, ErrorType = string>(): AjaxBaseState<T, ErrorType> {
  return {
    ...baseState<T>(),
    ...ajaxState<ErrorType>()
  }
}

export function selectableAjaxState<T, ErrorType = string>(): SelectableAjaxState<T, ErrorType> {
  return {
  ...baseState<T>(),
  ...ajaxState<ErrorType>(),
  ...selectableState<T>()
  }
}