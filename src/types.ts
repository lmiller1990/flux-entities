export interface EntityMap<T> {
  [k: string]: T
}

export interface BaseState<T> {
  ids: Array<number | string>
  all: EntityMap<T>
}

export interface SelectableState<T> extends BaseState<T> {
  selectedId?: number | string
}

export interface AjaxState<ErrorType = string> {
  loading: boolean
  touched: boolean
  errors: ErrorType[]
}

export interface AjaxBaseState<T, ErrorType = string> extends BaseState<T>, AjaxState<ErrorType> { }

export interface SelectableAjaxBaseState<T, ErrorType = string> extends AjaxBaseState<T, ErrorType>, SelectableState<T> { }