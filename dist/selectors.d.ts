import { SelectableState, AjaxState, BaseState } from './types';
declare function selectedEntity<T>(state: SelectableState<T>): T | null;
declare function mapEntities<T>(state: BaseState<T>): T[];
declare function isLoaded<T>(state: AjaxState<T>): boolean;
declare function isLoading<T>(state: AjaxState<T>): boolean;
declare function hasError<T>(state: AjaxState<T>): boolean;
export { selectedEntity, mapEntities, isLoaded, isLoading, hasError };
