
import { ShootingDaysActionTypes } from './enums';

export interface ShootingDay {
	readonly id: number;
	preview: boolean;
	readonly project_id: number;
	readonly post_row:any;
	readonly date: string | Date | null 
	readonly params: any;
	post_shooting_day: any;
	readonly additional_expenses: any[];
	readonly createdAt: string;
	readonly updatedAt: string;
	readonly shooting_day: shootingDayObj;
	readonly tasks: any[];
	general_comment: string;
}
export interface shootingDayObj {
	name: string;
	time: string;
	scenes: any[],
	total_scenes: any[],
	location: string
}
export interface ShootingDaysAction {
	type: ShootingDaysActionTypes;
	payload: any;
}
