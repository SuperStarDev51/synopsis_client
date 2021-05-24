
import { ScriptsActionTypes } from './enums';

export interface Script {
	readonly id: number | string;
	readonly attachments: any[];
	readonly actors: any[];
	readonly chapter_number: number;
	readonly date: string;
	readonly extras: number;
	readonly name: string;
	readonly project_id: number;
	readonly props: any[];
	readonly clothes: any[];
	readonly others: any[];
	readonly scenes: any;
}

export interface ScriptsAction {
	type: ScriptsActionTypes;
	payload: any;
}
