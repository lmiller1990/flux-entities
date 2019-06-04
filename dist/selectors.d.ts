import { ISelectableState, IAjaxState, IBaseState } from './types';
declare function selectedEntity<T>(state: ISelectableState<T>): T | null;
declare function mapEntities<T>(state: IBaseState<T>): T[];
declare function isLoaded<T>(state: IAjaxState<T>): boolean;
declare function isLoading<T>(state: IAjaxState<T>): boolean;
declare function isErrorState<T>(state: IAjaxState<T>): boolean;
export { selectedEntity, mapEntities, isLoaded, isLoading, isErrorState };
