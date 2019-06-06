export interface IEntityHashMap<T> {
    [id: number]: T
}

export interface IBaseState<T> {
    ids: number[]
    all: IEntityHashMap<T>
}

export interface ISelectableState<T> extends IBaseState<T> {
  selectedId: number | null
}

export interface IAjaxState<T, ErrorType = string> {
  loading: boolean
  touched: boolean
  errors: ErrorType[]
}

export interface IAjaxBaseState<T> extends IBaseState<T>, IAjaxState<T> {}

export interface ISelectableAjaxBaseState<T> extends IAjaxBaseState<T>, ISelectableState<T> {}
