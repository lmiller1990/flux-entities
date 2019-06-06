import { IBaseState, ISelectableState, IAjaxState, IAjaxBaseState, ISelectableAjaxBaseState } from './types';
export declare function baseState<T>(): IBaseState<T>;
export declare function selectableState<T>(): ISelectableState<T>;
export declare function ajaxState<ErrorType = string>(): IAjaxState<ErrorType>;
export declare function ajaxBaseState<T, ErrorType = string>(): IAjaxBaseState<T, ErrorType>;
export declare function selectableAjaxBaseState<T, ErrorType = string>(): ISelectableAjaxBaseState<T, ErrorType>;
