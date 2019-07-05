export interface IEntityHashMap<T> {
  [k: string]: T
}

export interface IBaseState<T> {
    ids: Array<number | string>
    all: IEntityHashMap<T>
}

export interface ISelectableState<T> extends IBaseState<T> {
  selectedId: number | string | null
}

export interface IAjaxState<ErrorType = string> {
  loading: boolean
  touched: boolean
  errors: ErrorType[]
}

export interface IAjaxBaseState<T, ErrorType = string> extends IBaseState<T>, IAjaxState<ErrorType> {}

export interface ISelectableAjaxBaseState<T, ErrorType = string> extends IAjaxBaseState<T, ErrorType>, ISelectableState<T> {}
