import { Summary } from './interfaces';
import { OverviewActionTypes } from './enums';
import { overviewInitialState } from './initial-state';

export const overviewReducer = (
	state: Summary[] = overviewInitialState,
	{ type, payload }: { type: OverviewActionTypes; payload: Summary[] }
): Summary[] => {
	switch (type) {
		case OverviewActionTypes.SET_OVERVIEW:
			return payload;

		default:
			return state;
	}
};
