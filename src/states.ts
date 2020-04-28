import {
  BaseState,
  SelectableState,
  AjaxState,
  AjaxBaseState,
  SelectableAjaxBaseState
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

export function selectableAjaxBaseState<T, ErrorType = string>(): SelectableAjaxBaseState<T, ErrorType> {
  return {
  ...baseState<T>(),
  ...ajaxState<ErrorType>(),
  ...selectableState<T>()
  }
}