import { UserInterface } from './interfaces';
import { UserActionTypes } from './enums';
import { ActionTypes } from '@src/reduxActions/actionTypes';
import { SET_USER, UPDATE_USER_PROFILE_IMAGE } from '@src/reduxActions/actionTypes/constant';


interface ActionUser {
	type: ActionTypes;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: UserInterface | any;
  }


  const initState: UserInterface = {
	id: '',
	first_name: '',
	password: '',
	updatedAt: '',
	verify_email_token: '',
	last_name: '',
	fullName: '',
	phoneNumber: '',
	profileImage: '',
	lists: [],
	company_id: 0,
	country_id: 0,
	createdAt: '',
	deletedAt: '',
	email: '',
	active: false,

  }

export default (state = initState, action: ActionUser) => {
	switch (action.type) {
		case SET_USER:{
			state = action.payload;
			return state;
		}
		case UPDATE_USER_PROFILE_IMAGE: {
			return{
				...state,
				profileImage: action.payload as any,
			}
		}


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
