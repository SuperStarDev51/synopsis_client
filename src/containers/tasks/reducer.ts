import { UsersActionTypes, TasksActionTypes } from './enums';
import { usersInitialState } from './initial-state';
import { UserInterface, UsersActionInterface, ListInterface, DefaultTaskInterface, TaskInterface } from './interfaces';

export default (state = usersInitialState, { type, payload }: UsersActionInterface): UserInterface[] => {
	const copy = state;

	switch (type) {
		case UsersActionTypes.SET_USER:
			return state.map((item: UserInterface) => {
				if (item.id !== payload.id) {
					return item;
				}

				return {
					...item,
					lists: payload.lists
				};
			});

			case UsersActionTypes.SET_TASKS:
				return state.map((item: UserInterface) => {
					const { id, listId, rows } = payload
					if (item.id !== payload.id) {
						return item;
					}

					return {
						...item,
						lists: item.lists.map((list: ListInterface) => {
							if (list.id !== listId) {
								return list;
							}
							return {
								...list,
								tasks: {
									...list.tasks,
									default: rows
								}
							}
						})
					};
				});

			case UsersActionTypes.SET_TASK_TITLE:
				const newTaskTitle = (task_title: any, key: string, value: any) => {
					let newTaskTitle:any = task_title
					newTaskTitle[key] = value
					return newTaskTitle
				}
				return state.map((item: UserInterface) => {
					const { id, category_id, key, value } = payload
					if (item.id !== id) {
						return item;
					}

					return {
						...item,
						lists: item.lists.map((list: ListInterface) => {
							if (list.id !== category_id) {
								return list;
							}

							return {
								...list,
								task_title: newTaskTitle(list.task_title, key, value)
							};
						})
					};
				});

			case UsersActionTypes.ADD_USER_LIST_COLUMNS:
				return state.map((item: UserInterface) => {
					const { id, category_id, key, value } = payload
					if (item.id !== id) {
						return item;
					}

					return {
						...item,
						lists: item.lists.map((list: any) => {
							if (list.id !== category_id) {
								return list;
							}

							return {
								...list,
								tasks: {
									...list.tasks,
									default: list.tasks.default.map((task: any) => {
										return {
											...task,
											[key]: value
										}
									})
								}
							};
						})
					};
				});


			case UsersActionTypes.DELETE_CATEGORY_COLUMN:

			return state.map((item: UserInterface) => {
				const { id, category_id, key } = payload
				const newTask = (task: any) => {
					var newTask:any = {}
					Object.keys(task).map((field: string, index: number) => {
						if( field == key ){
							return
						}
						newTask[field] = task[field]
					})
					return newTask
				}
				if (item.id !== id) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map((list: ListInterface) => {
							if (list.id !== category_id) {
								return list;
							}
							return {
								...list,
							tasks: {
								...list.tasks,
								default: list.tasks.default.map((task: any) => {
									return {
										...newTask(task)
									};
								})
								}
							}
						})
				};
			});

			case UsersActionTypes.DELETE_DEFAULT_TASK:
			return state.map((item: UserInterface) => {
				if (item.id !== payload.id) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map((list: ListInterface) => {
						if (list.id !== payload.listId) {
							return list;
						}

						return {
							...list,
							tasks: {
								...list.tasks,
								default: payload.parent_task_id > 0 ?
								list.tasks.default.map((task: DefaultTaskInterface) => {
									if (task.id !== payload.parent_task_id) {
										return task;
									}

									return {
										...task,
										child_tasks: task.child_tasks.filter(
											(task: DefaultTaskInterface) => task.id !== payload.taskId
										)
									}
								})
								:
								list.tasks.default.filter(
									(task: DefaultTaskInterface) => task.id !== payload.taskId
								)
							}
						};
					})
				};
			});

			case UsersActionTypes.UPDATE_DEFAULT_TASK:
			return state.map((item: UserInterface) => {
				if (item.id !== payload.userId) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map((list: ListInterface) => {
						if (list.id !== payload.listId) {
							return list;
						}

						return {
							...list,
							tasks: {
								...list.tasks,
								default: payload.parent_task_id ?
								list.tasks.default.map((task: DefaultTaskInterface) => {
									if (task.id !== payload.parent_task_id) {
										return task;
									}
									return {
										...task,
										child_tasks: task.child_tasks.map((child: DefaultTaskInterface) => {
											return {
												...child,
												[payload.field]: payload.value
											}
										})
									};
								})
								:
								list.tasks.default.map((task: DefaultTaskInterface) => {
									if (task.id !== payload.taskId) {
										return task;
									}
									return {
										...task,
										[payload.field]: payload.value
									};
								})
							}
						};
					})
				};
			});

			case UsersActionTypes.ADD_DEFAULT_TASK:
			return state.map((item: UserInterface) => {
				const { supplier_id, listId, task } = payload;

				if (item.id !== supplier_id) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map((list: ListInterface) => {
						if (list.id !== listId) {
							return list;
						}

						return {
							...list,
							tasks: {
								...list.tasks,
								default: [...list.tasks.default, task]
							}
						};
					})
				};
			});

			case UsersActionTypes.SET_TASK:
			return state.map((item: UserInterface) => {
				if (item.id !== payload.id) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map((list: ListInterface) => {
						if (list.id !== payload.listId) {
							return list;
						}

						return {
							...list,
							tasks: {
								...list.tasks,
								default: list.tasks.default.map((task: DefaultTaskInterface) => {
									if (task.id !== payload.taskId) {
										return task;
									}

									return payload.newTask
								})
							}
						};
					})
				};
			});

			case UsersActionTypes.CHANGE_DEFAULT_TASK_STATUS:
				return state.map((item: UserInterface) => {
					if (item.id !== payload.id) {
						return item;
					}

					return {
						...item,
						lists: item.lists.map((list: ListInterface) => {
							if (list.id !== payload.listId) {
								return list;
							}

							return {
								...list,
								tasks: {
									...list.tasks,
									default: list.tasks.default.map((task: DefaultTaskInterface) => {
										if (task.id !== payload.taskId) {
											return task;
										}

										return {
											...task,
											status: task.status === 'Active' ? 'Done' : 'Active',
											status_id: task.status_id  == 1 ? 2 : 1
										};
									})
								}
							};
						})
					};
				});

			case UsersActionTypes.ADD_LIST:
			return state.map((item: UserInterface) => {
				if (item.id !== payload.id) {
					return item;
				}

				return {
					...item,
					lists: [...item.lists, payload.list]
				};
			});

			case UsersActionTypes.UPDATE_LIST_NAME:
			return state.map((item: UserInterface) => {

				if (item.id !== payload.userId) {
					return item;
				}

				return {
					...item,
					lists: item.lists.map(list => list.id === payload.listId ? ({...list, ...payload.list}) : list)
				};
			});

			case UsersActionTypes.REMOVE_LIST:
			return state.map((user: UserInterface) => {
				if (user.id !== payload.id) {
					return user;
				}

				return {
					...user,
					lists: user.lists.filter((list: ListInterface) => list.id !== payload.listId)
				};
			});

			case UsersActionTypes.SET_USERS:
			return payload;

		default:
			return state;
	}
};
