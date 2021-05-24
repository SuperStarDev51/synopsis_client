
export enum PermissionTypeActionTypes {
	SET_PERMISSION_TYPES = 'SET_PERMISSION_TYPES',
}

export enum PermissionStatusActionTypes {
	SET_PERMISSION_STATUS = 'SET_PERMISSION_STATUS',
}

export enum TaskTypesActionTypes {
	SET_TASK_TYPES = 'SET_TASK_TYPES',
}

export enum TaskStatusActionTypes {
	SET_TASK_STATUS = 'SET_TASK_STATUS',
}

export enum SupplierTypesActionTypes {
	SET_SUPPLIER_TYPES = 'SET_SUPPLIER_TYPES',
}
export enum SupplierStatusActionTypes {
	SET_SUPPLIER_STATUS = 'SET_SUPPLIER_STATUS',
}

export enum SupplierUnitTypesActionTypes {
	SET_SUPPLIER_UNIT_TYPES = 'SET_SUPPLIER_UNIT_TYPES',
}

export enum SupplierJobTitlesActionTypes {
	SET_SUPPLIER_JOB_TITLES = 'SET_SUPPLIER_JOB_TITLES',
}

export enum CompaniesActionTypes {
	SET_COMPANIES_LIST = 'SET_COMPANIES_LIST',
}

export enum BudgetTypesActionTypes {
	SET_BUDGET_TYPES = 'SET_BUDGET_TYPES',
}


export enum CharactersActionTypes {
	SET_CHARACTERS = 'SET_CHARACTERS',
	SET_ACTIVE_CHARACTER = 'SET_ACTIVE_CHARACTER',
	SET_CHARACTER = 'SET_CHARACTER',
	DELETE_CHARACTER = 'DELETE_CHARACTER',
	SET_CHARACTER_ASSOCIATED = 'SET_CHARACTER_ASSOCIATED',
}

export enum BudgetStatusActionTypes {
	SET_BUDGET_STATUS = 'SET_BUDGET_STATUS',
}

export enum SceneTimeActionTypes {
	SET_SCENE_TIME = 'SET_SCENE_TIME',
	DELETE_SCENE_TIME_ITEM = 'DELETE_SCENE_TIME_ITEM',
	SET_SCENE_TIME_PARAM = 'SET_SCENE_TIME_PARAM',
}

export enum ScenePlaceActionTypes {
	SET_SCENE_PLACE = 'SET_SCENE_PLACE',
}

export enum SceneLocationActionTypes {
	SET_SCENE_LOCATION = 'SET_SCENE_LOCATION',
}

export enum LimitationsActionTypes {
	SET_LIMITATIONS = 'SET_LIMITATIONS',
	ADD_LIMITATION = 'ADD_LIMITATION',
	UPDATE_LIMITATION = 'UPDATE_LIMITATION',
	DELETE_LIMITATION= 'DELETE_LIMITATION',
}

export const limitationsReducer =  ( state: any[] = [], { type, payload }: { type: any; payload: any }): any[] => {
	switch (type) {
		case LimitationsActionTypes.SET_LIMITATIONS:
			return payload ? payload : [];

		case LimitationsActionTypes.ADD_LIMITATION:
			const {limitation_id, supplier_id, date_from, date_to, reason} = payload;
			return [
				...state,
				{limitation_id, supplier_id, date_from, date_to, reason}
			];

		case LimitationsActionTypes.UPDATE_LIMITATION:
			const {field, value} = payload;
			return state.map(limitation => {
				if (limitation.limitation_id !== payload.limitation_id) {
					return limitation
				}
				return {
					...limitation,
					[field]: value
				}
			});

		case LimitationsActionTypes.DELETE_LIMITATION:
			return state.filter(limitation => limitation.limitation_id !== payload.limitation_id);

		default:
			return state;
	}
};

export const permissionTypeReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case PermissionTypeActionTypes.SET_PERMISSION_TYPES:
			return payload;
		default:
			return state;
	}
};

export const permissionStatusReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case PermissionStatusActionTypes.SET_PERMISSION_STATUS:
			return payload;
		default:
			return state;
	}
};

export const taskTypesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case TaskTypesActionTypes.SET_TASK_TYPES:
			return payload;
		default:
			return state;
	}
};

export const taskStatusReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case TaskStatusActionTypes.SET_TASK_STATUS:
			return payload;
		default:
			return state;
	}
};


export const supplierTypesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SupplierTypesActionTypes.SET_SUPPLIER_TYPES:
			return payload;
		default:
			return state;
	}
};

export const supplierStatusReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SupplierStatusActionTypes.SET_SUPPLIER_STATUS:
			return payload;
		default:
			return state;
	}
};

export const supplierJobTitlesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SupplierJobTitlesActionTypes.SET_SUPPLIER_JOB_TITLES:
			return payload;
		default:
			return state;
	}
};

export const companiesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case CompaniesActionTypes.SET_COMPANIES_LIST:
			return payload;
		default:
			return state;
	}
};

export const budgetTypesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case BudgetTypesActionTypes.SET_BUDGET_TYPES:
			return payload;
		default:
			return state;
	}
};

export const charactersReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any }): any[] => {
	const copy = [...state];

	switch (type) {
		case CharactersActionTypes.SET_CHARACTERS:
			return payload;
		case CharactersActionTypes.SET_ACTIVE_CHARACTER:
			return payload;
		case CharactersActionTypes.SET_CHARACTER:
			// eslint-disable-next-line
			const {character, character_id} = payload
			return state.map((c) => { if( c.character_id === character_id) { return character } else return  c })
		case CharactersActionTypes.DELETE_CHARACTER:
			return state.filter(character => character.character_id !== payload.characterId);
		case CharactersActionTypes.SET_CHARACTER_ASSOCIATED:
			const {characterIds, associatedNum} = payload;
			return state.map(character => {
				if ( !payload.characterIds.includes(character.character_id) ) {
					return character
				}
				return {
					...character,
					associated_num: associatedNum,
				}
			})
		default:
			return state;
	}
};

export const SupplierUnitTypesReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SupplierUnitTypesActionTypes.SET_SUPPLIER_UNIT_TYPES:
			return payload;
		default:
			return state;
	}
};

export const budgetStatusReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case BudgetStatusActionTypes.SET_BUDGET_STATUS:
			return payload;
		default:
			return state;
	}
};

export const sceneTimeReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SceneTimeActionTypes.SET_SCENE_TIME:
			return payload;

		case SceneTimeActionTypes.DELETE_SCENE_TIME_ITEM:
			return state.filter(item => item.id !== payload.sceneTimeId);

		case SceneTimeActionTypes.SET_SCENE_TIME_PARAM:
			return state.map(item => {
				if (item.id !== payload.sceneTimeId) {
					return item;
				}
				return {
					...item,
					[payload.field]: payload.value,
				}
			});

		default:
			return state;
	}
};

export const scenePlaceReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case ScenePlaceActionTypes.SET_SCENE_PLACE:
			return payload;
		default:
			return state;
	}
};
export const sceneLocationReducer =  (
	state: any[] = [],
	{ type, payload }: { type: any; payload: any[] }): any[] => {
	switch (type) {
		case SceneLocationActionTypes.SET_SCENE_LOCATION:
			return payload;
		default:
			return state;
	}
};
