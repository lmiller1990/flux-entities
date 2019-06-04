interface IUser {
    id: number;
    name: string;
}
interface IProject {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
}
import { IBaseState, ISelectableState, IAjaxState } from './types';
interface ISetUsers {
    type: 'SET_USERS';
    payload: {
        users: Array<{
            id: number;
            firstName: string;
            lastName: string;
        }>;
    };
}
declare const usersReducer: (state: IBaseState<IUser>, action: ISetUsers) => IBaseState<IUser>;
interface IProjectsState extends ISelectableState<IProject> {
}
interface ISetProjects {
    type: 'SET_PROJECTS';
    payload: IProject[];
}
declare const projectsReducer: (state: IProjectsState, action: ISetProjects) => IProjectsState;
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
interface ITask {
    id: number;
    title: string;
    projectId: number;
    assignee: number;
}
interface ITasksState extends IAjaxState<ITask> {
}
declare const tasksReducer: (state: ITasksState, action: any) => ITasksState;
export declare const fetchTasks: () => ThunkAction<Promise<void>, {}, {}, AnyAction>;
export { usersReducer, projectsReducer, tasksReducer };
