export interface IEntityHashMap<T> {
    [id: number]: T
}

export interface IBaseState<T> {
    id: number[]
    all: IEntityHashMap<T>
}