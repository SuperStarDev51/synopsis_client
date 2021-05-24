import { PlanningActionTypes } from './enum';
import { PlanningActions, PlanningState, TaskPlanning } from './interfaces';
import { planningInitialState, eventsInitialState } from './initial-state';

import { EventActionTypes } from './enum';
import { Event, EventActions } from './interfaces';

export const eventsReducer = (state = eventsInitialState, { type, payload }: EventActions): Event[] => {
	const copy:any = state;

	switch (type) {
		case EventActionTypes.SET_EVENTS:
			return payload;

		case EventActionTypes.SET_EVENT:	
			return state.map((list: any) => {
					if (list.id !== payload.id) return list
					else return payload;
			});
		
		case EventActionTypes.ADD_EVENT:
			return [...state,payload];

		case EventActionTypes.SET_EVENT_PARAMETER:
				const { project_id ,field, data} = payload
				copy.filter((event:Event)=> event.id == project_id)[0][field] = data
				return copy



		case EventActionTypes.DELETE_EVENT:
		 return state.filter((event: Event) => event.id !== payload)
	

		case EventActionTypes.SET_VAT:
			return state.map((event: Event) => {
				if (event.preview) {
					return {
						...event,
						vat: payload
					};
				}

				return event;
			});

		
	
		default:
			return state;
	}
};

export const planningReducer = (state = planningInitialState, { type, payload }: PlanningActions): PlanningState => {
	switch (type) {
		case PlanningActionTypes.SET_PLANNING:
		case PlanningActionTypes.DELETE_PLANNING_TASK:
			return {
				...state,
				active: payload
			};

		case PlanningActionTypes.UPDATE_PLANNING_TASK:
			return payload;

		case PlanningActionTypes.CHANGE_PLANNING_TASK_STATUS:
			const { completed, active } = state;

			const isActive = active.find((item: TaskPlanning) => item.id === payload.taskId);
			const isCompleted = completed.find((item: TaskPlanning) => item.id === payload.taskId);

			if (isActive) {
				return {
					active: [...state.active.filter((item: TaskPlanning) => item.id !== payload.taskId)],
					completed: [...state.completed, { ...isActive, status: 'done' }]
				};
			}

			if (isCompleted) {
				return {
					active: [...state.active, { ...isCompleted, status: 'done' }],
					completed: [...state.completed.filter((item: TaskPlanning) => item.id !== payload.taskId)]
				};
			}

			return state;

		// case PlanningActionTypes.SORT_PLANNING_TASKS:
		// 	// eslint-disable-next-line
		// 	const { key, tasks } = payload;
		// 	return {
		// 		...state,
		// 		active: tasks.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))
		// 	};

		default:
			return state;
	}
};
