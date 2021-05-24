
import { ScriptsActionTypes } from './enums';

export interface Script {
	readonly attachmets: any;
}

export interface ScriptsAction {
	type: ScriptsActionTypes;
	payload: any;
}
