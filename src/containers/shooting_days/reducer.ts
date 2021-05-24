import { ShootingDaysActionTypes } from './enums';
import { shootingDaysInitialState } from './initial-state';
import { ShootingDay, ShootingDaysAction } from './interfaces';
const cloneDeep = require('lodash/cloneDeep');

export const shootingDaysReducer = (state = shootingDaysInitialState, { type, payload }: ShootingDaysAction): ShootingDay[] => {
	const copy = cloneDeep(state);

	switch (type) {
		case ShootingDaysActionTypes.SET_SHOOTING_DAYS:
			return payload;

		case ShootingDaysActionTypes.ADD_NEW_SHOOTING_DAY:
			return [...copy, payload];

		case ShootingDaysActionTypes.DELETE_SHOOTING_DAY:
			return state.filter(item => item.id !== payload.shootingDayId);

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_CHARACTERS:
			return state.map(item => ({
				...item,
				characters: item.characters.map(shootingDayCharacter => {
					if (shootingDayCharacter.character_id !== payload.characterId) {
						return shootingDayCharacter
					}
					return {
						...shootingDayCharacter,
						supplier_id: payload.supplierId
					}
				})
			}));

		case ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_ACTOR_PARAMS:
			const { sdId, field, value, actorId } = payload;

			return state.map(shootingDay => {
				if (shootingDay.id !== sdId) {
					return shootingDay
				}
				return {
					...shootingDay,
					actors: shootingDay.actors.map(actor => {
						if ( actor.id !== actorId ) {
							return actor;
						}
						return {
							...actor,
							[field]: value,
						}
					})
				}
			});

		case ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_EMPLOYEE_PARAMS:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.sdId) {
					return shootingDay
				}
				return {
					...shootingDay,
					employees: shootingDay.employees.map(employee => {
						if ( employee.id !== payload.employeeId ) {
							return employee;
						}
						return {
							...employee,
							[payload.field]: payload.value,
						}
					})
				}
			});

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_PARAMETER:
			const { shooting_day_index } = payload

			copy[shooting_day_index][payload.type] = payload.data
			return copy

		case ShootingDaysActionTypes.DELETE_SHOOTING_DAY_PARAMETER:
			const { shooting_day_index, index } = payload
			let newCopy = copy
			newCopy[shooting_day_index][payload.type].splice(index, 1)
			return newCopy

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_PARAMETER_VALUE: {
			const { shooting_day_index, field, value, type_index } = payload
			let newCopy = copy
			if( field ) {
					newCopy[shooting_day_index][payload.type][type_index][field] = value;
				}   else newCopy[shooting_day_index][payload.type] = value
				return newCopy
		}
		case ShootingDaysActionTypes.SET_POST_SHOOTING_DAY_VALUE:
			const { shooting_day_index, value } = payload
			let newCopy = copy
			newCopy[shooting_day_index].post_shooting_day[payload.type] = value
			return newCopy

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_PREVIEW:
			let newCopy:any = copy.map((sd: any, sdi: number)=>{
				if( sdi !== payload ) return {...sd, preview: false}
				else return {...sd,preview: typeof(payload) == 'number' ? true : false
			}})
			return newCopy

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_SCENE_PARAMETER:
		    const reorderArrays = (lists:any, movedCard: any, sourceList:any, destinationList:any, source_index:number, source_scene_time:number, destination_scene_time:number) => {
				var movedCard:any = movedCard
				var sourceCards = [...sourceList];
				var destinationCards = [...destinationList];
				sourceCards.splice(source_index, 1);
				destinationCards.splice(destinationList.length, 0, movedCard);
				const newLists = lists.map((list: any, index:number) => {
					if (index === source_scene_time) return sourceCards
					if (index === destination_scene_time) return destinationCards
					else return list
				})
				return newLists;
			}
			const { sceneId, field, data, modifyAllScenes } = payload;

			copy.forEach(shootingDay => {
				shootingDay.shooting_day?.total_scenes?.forEach(scene => {
					if (modifyAllScenes) {
						scene[payload.field] = data;
					} else {
						if (scene.scene_id === sceneId) {
							scene[payload.field] = data;
						}
					}
				});
			});

			//copy[script_index].shooting_day.scenes[scene_time_id-1][scene_index][payload.type] = payload.data
			// if ( payload.type == 'time_id' ) {
			// 	let lists = copy[script_index].shooting_day.scenes
			// 	let moveCard = copy[script_index].shooting_day.scenes[scene_time_id-1][scene_index]
			// 	let sourceList = copy[script_index].shooting_day.scenes[scene_time_id-1]
			// 	let destination_scene_time = scene_time_id-1 == 0 ? 1 : 0
			// 	let destinationList = copy[script_index].shooting_day.scenes[destination_scene_time]
			// 	copy[script_index].shooting_day.scenes = reorderArrays(lists,moveCard,sourceList,destinationList,scene_index,scene_time_id-1,destination_scene_time)
			// }
			return copy;

		case ShootingDaysActionTypes.SET_ACTIVE_DAY:
			return payload;

		case ShootingDaysActionTypes.UPDATE_SCENE_TASKS:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								[payload.field]: [
									...scene[payload.field],
									{def: payload.value}
								]
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_TASK_COST:

			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay
				}
				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene
							}
							return {
								...scene,
								[payload.categoryName]: scene[payload.categoryName].map(task => {
									if (task.def !== payload.def) {
										return task;
									}
									return {
										...task,
										cost: payload.cost
									}
								})
							}
						})
					}
				}
			});


		case ShootingDaysActionTypes.UPDATE_SCENE_TASKS_INFO: {
			const { shootingDayId, sceneId, field, propIndex, rowIndex, patchObj } = payload;

			const shootingDay = copy.find(item => item.id === shootingDayId);
			const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);

			if (scene) {
				scene[field][propIndex].info[rowIndex] = { ...scene[field][propIndex].info[rowIndex], ...patchObj };
			}

			return copy;
		}

		case ShootingDaysActionTypes.ADD_SCENE_TASKS_INFO_ROW: {
			const { shootingDayId, sceneId, field, propIndex } = payload;

			const shootingDay = copy.find(item => item.id === shootingDayId);
			const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);

			if (scene) {
				if (scene[field][propIndex].info) {
					scene[field][propIndex].info.push({
						box_description: '',
						box_number: '',
						storage_location: '',
						comments: ''
					});
				} else {
					scene[field][propIndex].info = [
						{ box_description: '', box_number: '', storage_location: '', comments: '' }
					];
				}

			}

			return copy;
		}

		case ShootingDaysActionTypes.DELETE_SCENE_TASKS_INFO_ROW: {
			const { shootingDayId, sceneId, field, propIndex, rowIndex } = payload;

			const shootingDay = copy.find(item => item.id === shootingDayId);
			const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);

			if (scene) {
				scene[field][propIndex].info.splice(rowIndex, 1);
			}

			return copy;
		}

		case ShootingDaysActionTypes.UPDATE_SCENE_TAKE: {
			const { shootingDayId, sceneId, field, propIndex, rowIndex, patchObj } = payload;

			const shootingDay = copy.find(item => item.id === shootingDayId);
			const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);

			if (scene) {
				scene.info[rowIndex] = { ...scene.info[rowIndex], ...patchObj };
			}

			return copy;
		}

		case ShootingDaysActionTypes.ADD_SCENE_TAKE: {
			const { shootingDayId, sceneId, field, propIndex } = payload;

			// const shootingDay = copy.find(item => item.id === shootingDayId);
			// const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);
            //
			// if (scene) {
			// 	if (scene[field][propIndex].info) {
			// 		scene[field][propIndex].info.push({
			// 			box_description: '',
			// 			box_number: '',
			// 			storage_location: '',
			// 			comments: ''
			// 		});
			// 	} else {
			// 		scene[field][propIndex].info = [
			// 			{ box_description: '', box_number: '', storage_location: '', comments: '' }
			// 		];
			// 	}
            //
			// }

			return copy;
		}

		case ShootingDaysActionTypes.DELETE_SCENE_TAKE: {
			const { shootingDayId, sceneId, field, propIndex, rowIndex } = payload;

			const shootingDay = copy.find(item => item.id === shootingDayId);
			const scene = shootingDay?.shooting_day.total_scenes?.find(item => item.scene_id === sceneId);

			if (scene) {
				scene[field][propIndex].info.splice(rowIndex, 1);
			}

			return copy;
		}















		case ShootingDaysActionTypes.DELETE_SHOOTING_DAY_SCENE:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.filter(scene => scene.scene_id !== payload.sceneId),
					}
				}
			});

		case ShootingDaysActionTypes.UPDATE_SCENE_OTHER_TASKS:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								 ...scene,
								others: scene.others.map(otherCategory => {
									if (otherCategory.name !== payload.otherCategoryName) {
										return otherCategory;
									}
									return {
										...otherCategory,
										tasks: [
											...otherCategory.tasks,
											{def: payload.value}
										],
									}
								})
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.REMOVE_SCENE_OTHER_TASK:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								others: scene.others.map(otherCategory => {
									if (otherCategory.name !== payload.otherCategoryName) {
										return otherCategory;
									}
									return {
										...otherCategory,
										tasks: otherCategory.tasks.filter(item => item.def !== payload.value)
									}
								})
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.ADD_SCENE_OTHER_TASKS_CATEGORY:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								others: [
									...scene.others,
									{
										id: payload.taskCategoryId,
										name: payload.taskCategoryName,
										tasks: [],
									}
								]
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.ADD_SCENE_OTHER_TASK:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								others: scene.others.map(otherTaskCategory => {
									if (otherTaskCategory.id !== payload.taskCategoryId) {
										return otherTaskCategory;
									}

									return [
										...scene.others,
										{def: payload.value}
									]
								})
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.REMOVE_SCENE_OTHER_TASKS_CATEGORY:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								others: scene.others.filter(item => item.id !== payload.otherItemId)
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.REMOVE_SCENE_TASK:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}

							return {
								...scene,
								[payload.field]: scene[payload.field].filter(item => item.def !== payload.value)
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.REMOVE_SCENE_CHARACTER:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}

							let updatedCharacters = [];
							if ( payload.characterId !== 0 ) {
								updatedCharacters = scene.characters.filter(character => character.character_id !== payload.characterId)
							} else {
								updatedCharacters = scene.characters.filter((_,index) => index !== payload.characterIndex)
							}

							return {
								...scene,
								characters: updatedCharacters
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.ADD_SCENE_CHARACTER:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: shootingDay.shooting_day.total_scenes.map(scene => {
							if (scene.scene_id !== payload.sceneId) {
								return scene;
							}
							return {
								...scene,
								characters: [
									...scene.characters,
									{
										project_id: payload.projectId,
										supplier_id: 0,
										character_id: 0,
										character_name: payload.characterName,
										character_type: 0
									}
								]
							}
						})
					}
				}
			});

		case ShootingDaysActionTypes.REMOVE_SHOOTING_DAY_CHARACTER:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					characters: shootingDay.characters.filter(character => character.character_id !== payload.characterId)
				}
			});

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_SUPPLIRES:
			return state.map(shootingDay => {
				if (shootingDay.id < payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					suppliers: [...shootingDay.suppliers, payload.supplier_id]
				}
			});

		case ShootingDaysActionTypes.SET_SHOOTING_DAY_EMPLOYEES:
			return state.map(shootingDay => {
				if (shootingDay.id < payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					employees: shootingDay.employees
						? payload.selectedEmployee && [...shootingDay.employees, payload.selectedEmployee]
						: payload.selectedEmployee && [payload.selectedEmployee]
				}
			});

		case ShootingDaysActionTypes.DELETE_SHOOTING_DAY_SUPPLIRES:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					suppliers: shootingDay.suppliers.filter(supplier => supplier !== payload.supplier_id)
				}
			});

		case ShootingDaysActionTypes.DELETE_SHOOTING_DAY_EMPLOYEES:
			return state.map(shootingDay => {
				if (shootingDay.id !== payload.shootingDayId) {
					return shootingDay;
				}

				return {
					...shootingDay,
					employees: shootingDay.employees.filter(employee => employee.id !== payload.employee_id)
				}
			});

		default:
			return state;
	}
};
