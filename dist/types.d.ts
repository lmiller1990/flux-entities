export interface IEntityHashMap<T> {
    [id: number]: T;
}
export interface IBaseState<T> {
    ids: number[];
    all: IEntityHashMap<T>;
}
export interface ISelectableState<T> extends IBaseState<T> {
    selectedId: number | null;
}
export interface ISelectableAjaxState<T> extends IAjaxState<T> {
    selectedId: number | null;
}
export interface IAjaxState<T, ErrorType = string> extends IBaseState<T> {
    loading: boolean;
    touched: boolean;
    errors: ErrorType[];
}
