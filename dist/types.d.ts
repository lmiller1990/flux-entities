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
export interface IAjaxState<ErrorType = string> {
    loading: boolean;
    touched: boolean;
    errors: ErrorType[];
}
export interface IAjaxBaseState<T, ErrorType = string> extends IBaseState<T>, IAjaxState<ErrorType> {
}
export interface ISelectableAjaxBaseState<T, ErrorType = string> extends IAjaxBaseState<T, ErrorType>, ISelectableState<T> {
}
