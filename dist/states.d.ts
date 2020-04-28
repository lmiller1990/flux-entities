import { BaseState, SelectableState, AjaxState, AjaxBaseState, SelectableAjaxBaseState } from './types';
export declare function baseState<T>(): BaseState<T>;
export declare function selectableState<T>(): SelectableState<T>;
export declare function ajaxState<ErrorType = string>(): AjaxState<ErrorType>;
export declare function ajaxBaseState<T, ErrorType = string>(): AjaxBaseState<T, ErrorType>;
export declare function selectableAjaxBaseState<T, ErrorType = string>(): SelectableAjaxBaseState<T, ErrorType>;
