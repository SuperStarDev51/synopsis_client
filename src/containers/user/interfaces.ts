import { UserActionTypes,  UsersActionTypes } from './enums';

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
	// status: 'active' | 'done';
}

export interface CanbanTaskInterface extends TaskInterface {
	label: string;
	date: string;
}

export interface ListInterface {
	id: any;
	task_category: string;
	color: string;
	createdAt: any;
	deletedAt: any;
	user_id: number;
	project_id: number;
	tasks: {
		canban: CanbanTaskInterface[];
		default: DefaultTaskInterface[];
	};
}

export interface UserInterface {
	id: any;
	first_name: string;
	password: string;
	updatedAt: any;
	verify_email_token: string;
	last_name: string;
	fullName?: string;
	phoneNumber?: string;
	photoURL?: string;
	lists: ListInterface[];
	company_id: number;
	country_id: number;
	createdAt: any;
	deletedAt: any;
	email: string;
	active: boolean;
}

export interface UsersActionInterface {
	type: UsersActionTypes;
	payload: any;
}

export interface UserActionInterface {
	type: UserActionTypes;
	payload: any;
}


