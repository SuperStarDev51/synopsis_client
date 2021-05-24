import { PlanningActionTypes, EventActionTypes } from './enum';
import { Attachment } from '@src/components/attachments/interfaces';

export interface Event {
	readonly id: number,
	readonly project_name: string,
	readonly attachments?: any[],
	readonly budget?: number | any,
	readonly status?: string,
	readonly preview?: boolean,
	readonly vat?: number,
	readonly company_id?: number,
	readonly country_id?: number,
	readonly createdAt?: string,
	readonly date: string,
	readonly date_end: string,
	readonly deletedAt?: any,
	readonly max_shooting_days: number,
	readonly params: any[],
	readonly updatedAt?: any,
	readonly created?: Boolean
}

export interface Events {
	readonly event: Event[];
}

export interface EventActions {
	readonly type: EventActionTypes;
	readonly payload: any;
}

export interface TaskPlanning {
	readonly id: string;
	readonly color: string;
	readonly description: string;
	readonly type: string;
	readonly 'supplier_name': string;
	readonly price: number;
	readonly owner: string;
	readonly status: string;
	readonly attachments: Attachment[];
}

export interface PlanningActions {
	type: PlanningActionTypes;
	payload: any;
}

export interface PlanningState {
	active: TaskPlanning[];
	completed: TaskPlanning[];
}
