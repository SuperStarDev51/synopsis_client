import { userInitialState } from './initial-state';
import { UserInterface, UserActionInterface } from './interfaces';
import { UserActionTypes } from './enums';

export default (state = userInitialState, { type, payload }: UserActionInterface): UserInterface[] => {
	const copy = [...state];

	switch (type) {
		case UserActionTypes.SET_USER:
			return payload

		default:
			return state;
	}
};

export const allCompanyUsersReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {

	switch (type) {
		case UserActionTypes.SET_ALL_COMPANY_USERS:
			return payload;

		default:
			return state;
	}
};
