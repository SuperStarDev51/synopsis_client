import { UsersActionTypes } from './enums';

export interface TaskInterface {
	id: string;
	description: string;
}

export interface DefaultTaskInterface extends TaskInterface {
	color: string;
	type: string;
	status: string;
	supplier: string;
	price: number;
	status_id: number;
	comments: string;
	child_tasks: [];
	// status: 'active' | 'done';
}

export interface CanbanTaskInterface extends TaskInterface {
	label: string;
	date: string;
}

export interface TasksViews {
		canban: CanbanTaskInterface[];
		default: DefaultTaskInterface[];
}
export interface ListInterface {
	id: any;
	task_category: string;
	task_title: object;
	color: string;
	createdAt: any;
	deletedAt:any;
	user_id : number;
	project_id: number;
	tasks: TasksViews
}

export interface UserInterface {
	id: any;
	first_name: string;
	last_name: string;
	company_id: number;
	email: string
	lists: ListInterface[];
	active: boolean;
}

export interface UsersActionInterface {
	type: UsersActionTypes;
	payload: any;
}

