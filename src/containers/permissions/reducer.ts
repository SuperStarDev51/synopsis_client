import { PermissionsActionTypes } from './enums';
import { permissionsInitialState } from './initial-state';

export default (state = permissionsInitialState, { type, payload }) => {
	const copy = state;

	switch (type) {
		// case UsersActionTypes.UPDATE_LIST_NAME:
		// return state.map((item: UserInterface) => {
		//
		// 	if (item.id !== payload.userId) {
		// 		return item;
		// 	}
		//
		// 	return {
		// 		...item,
		// 		lists: item.lists.map(list => list.id === payload.listId ? ({...list, ...payload.list}) : list)
		// 	};
		// });

		case PermissionsActionTypes.UPDATE_USER_PERMISSION_TYPE:
			console.log('state: ', state);

			return state;
		case PermissionsActionTypes.UPDATE_USER_PERMISSION_STATUS:
			console.log('payload: ', payload);

			return state;
		case PermissionsActionTypes.UPDATE_USER_JOB_TITLE:
			console.log('payload: ', payload);

			return state;

		default:
			return state;
	}
}

// return state.map((item: UserInterface) => {
//
// 	if (item.id !== payload.userId) {
// 		return item;
// 	}
//
// 	return {
// 		...item,
// 		lists: item.lists.map(list => list.id === payload.listId ? ({...list, ...payload.list}) : list)
// 	};
// });


