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