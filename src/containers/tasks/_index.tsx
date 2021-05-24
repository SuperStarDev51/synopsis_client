import * as React from 'react';
import { AnyAction } from 'redux';
import SVG from 'react-inlinesvg';
import { useOutsideClick } from '@src/utilities';
import {Nav, NavItem, NavLink} from "reactstrap";
import {
	Droppable,
	Draggable,
	DropResult,
	DragDropContext,
	DraggableLocation,
	DroppableProvided,
	DraggableProvided
} from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { addTaskCategory,deleteTaskCategory, setTasksList, addTaskTitle } from './initial-state'
import classnames from 'classnames'
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '@containers/planning/interfaces';
import { RootStore } from '@src/store';
import { ListView } from '@components';
import { UsersActionTypes } from './enums';
import { ListInterface, DefaultTaskInterface, UserInterface, TaskInterface } from './interfaces';
import {  List, Card, CalendarComponent, UsersNav, TableType, Table } from '@components';
import { Attachment } from '@src/components/attachments/interfaces';
import { FormattedMessage , useIntl} from 'react-intl';
import { ShootingDays } from '@src/loadables';
import { ShootingDay } from '../shooting_days/interfaces';
import {TasksNav} from "@components/tasks-nav";

export interface CardItem {
	readonly id: string;
	readonly label: string;
	description: string;
	readonly date: string;
}

export interface ListItem {
	readonly id: string;
	title: string;
	readonly stripeColor: string;
	readonly cards: CardItem[];
}

export interface TaskListViewItem {
	pos: number;
	id: any;
	readonly color: string;
	readonly 'task-to-do': string;
	type: string;
	readonly 'supplier_name': string;
	readonly price: number | string;
	readonly comments: string;
	readonly status_id: number;
	readonly attachments: Attachment[];
	readonly user_id: any;
	readonly listId?: string;
	readonly parent_task_id: number;
	readonly due_date: string;
	number1: number;
	number2: number;
	number3: number;
	text1: string;
	text2: string;
	text3: string;
}

export interface ListViewGroup {
	readonly title: string;
	readonly rows: TaskListViewItem[];
}

export const Tasks: React.FunctionComponent = () => {
	// eslint-disable-next-line
	const { formatMessage } = useIntl();
	const users = useSelector((state: RootStore) => state.users);
	const user = users.find((user: UserInterface) => user.active);
	const lists:ListInterface[] = user  ? user.lists : [];
	lists = groupListsByDay(lists);
	const id = user ? user.id : null;
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const dispatch = useDispatch();
	const [currentList, setCurrentList] = React.useState<any>();
	const [currentCard, setCurrentCard] = React.useState<any>();
	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
	const [disableParentDroppable, setDisableParentDroppable] = React.useState('');
	const [fields, setFields] = React.useState<any[]>(['scene_id','description','synofsis', 'location', 'price', 'comments']);
	const [isListView, setIsListView] = React.useState<boolean>(true);
	const event = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])

	function getAvailableShootingDaysDropdownOptions(tasksList, shootingDays) {
		const ShootingDaysWithNumber = shootingDays.map((shootingDay, index) => ({
			...shootingDay,
			shooting_day_number: index + 1,
		}));

		const taskListShootingDaysIds = [];
		tasksList.forEach(item => {
			taskListShootingDaysIds.push(item.shooting_day_id);
		});

		const availableShootingDays = ShootingDaysWithNumber.filter(day => !taskListShootingDaysIds.includes(day.id));

		const availableShootingDaysNumbers = [];
		availableShootingDays.forEach(day => {
			availableShootingDaysNumbers.push({
				dayNumber: day.shooting_day_number,
				dayId: day.id
			});
		});

		return availableShootingDaysNumbers;
	};

	const availableShootingDaysOptions = getAvailableShootingDaysDropdownOptions(lists, shootingDays);

	function groupListsByDay(rawLists: ListInterface[]):ListInterface[] {
		const groupedByDayLists = [];
		rawLists &&
		rawLists.forEach(list => {
			let foundObj = groupedByDayLists.find(obj => obj.shooting_day_id === list.shooting_day_id);

			if (!foundObj) {
				groupedByDayLists.push(list);
			} else {
				const foundObjTasks = foundObj.tasks.default;
				foundObjTasks = foundObjTasks.concat(list.tasks.default);

				const unique = [...new Map(foundObjTasks.map(item => [item.id, item])).values()];

				foundObj.tasks.default = unique;
			}

			if (list.shooting_day_id === 0 || list.shooting_day_id === undefined) {
				list.shooting_day_id = Number(list.task_category)
			}
		});

		//groupedByDayLists.sort((a, b) => (a.shooting_day_id > b.shooting_day_id) ? 1 : -1)

		return groupedByDayLists;
	}

	const addColumnDispatch = (key: string, value: any, category_id: number) => {
		let titleName = `New ${key.replace(/[0-9]/g, '')} column`
		addTaskTitle({project_id: event.id, category_id, key, value: titleName})
		dispatch({
			type: UsersActionTypes.SET_TASK_TITLE,
			payload: {id, category_id, key, value: titleName}
		})

		dispatch({
			type: UsersActionTypes.ADD_USER_LIST_COLUMNS,
			payload: {
				key,
				value,
				category_id,
				id
			}
		});
	}

	const updateColumnTitleDispatch = (key: string, value: any, category_id: number) => {
		addTaskTitle({project_id: event.id, category_id: category_id, key, value:value})
		dispatch({
			type: UsersActionTypes.SET_TASK_TITLE,
			payload: {id, category_id, key, value}
		})
	}

	const deleteColumnDispatch = (key: string, category_id: number) => {
		addTaskTitle({project_id: event.id, category_id, key, value:null})
		setFields(fields.map((field: string, index: number) => {
								if(field == key) { return }
								return field
				   }).filter(e=>e)
		)
		dispatch({
			type: UsersActionTypes.DELETE_CATEGORY_COLUMN,
			payload: {id, category_id, key}
		})
	};

	const addNewCategory = async () => {
		let task_category = 'New list';
		let color = 'red';

		const newCategory:any = await addTaskCategory(task_category, id, event.id, color, null )
		let category = {...newCategory.task_category, id: newCategory.task_category.id,
			tasks: {
				canban: [],
				default: []
			}
		}
		dispatch({
			type: UsersActionTypes.ADD_LIST,
			payload: {
				id,
				list: category
			}
		});
	}

	const handleSidebarTitleChange = async (shootingDayId, listId): void => {
		let color = 'red';

		const newCategory:any = await addTaskCategory(shootingDayId, id, event.id, color, listId);

		let category = {...newCategory.task_category, id: newCategory.task_category.id};

		dispatch({
			type: UsersActionTypes.UPDATE_LIST_NAME,
			payload: {
				userId: id,
				listId,
				list: category
			}
		});
	};

	const updateCategory = async () => {
		let task_category = 'New list';
		let color = 'red';
		const newCategory:any = await addTaskCategory(task_category, id, event.id, color, null )
		let category = {...newCategory.task_category, id: newCategory.task_category.id,
			tasks: {
				canban: [],
				default: []
			}
		}
		dispatch({
			type: UsersActionTypes.ADD_LIST,
			payload: {
				id,
				list: category
			}
		});
	}

	const setLists = (updatedLists: any): AnyAction =>
		dispatch({
			type: UsersActionTypes.SET_USER,
			payload: { lists: updatedLists, id }
		});

	const changeTitle = (title: string, id: string): void => {

		const newLists = lists.map((list: ListInterface) => {
			if (list.id === id) {
				list.task_category = title;
			}

			return list;
		});

		setLists(newLists);
	};

	const changeDescription = (description: string, cardId: string, listId: string): void => {
		const newLists = lists.map((list: ListInterface) => {
			if (list.id !== listId) {
				return list;
			}

			return {
				...list,
				tasks: {
					...list.tasks,
					canban: list.tasks.canban.map((card: CardItem) => {
						if (card.id !== cardId) {
							return card;
						}

						return {
							...card,
							description
						};
					})
				}
			};
		});

		setLists(newLists);
	};

	const changeDate = (date: Date, listId: string, cardId: string): void => {
		const newLists = lists.map((list: ListInterface) => {
			if (list.id !== listId) {
				return list;
			}

			return {
				...list,
				tasks: {
					...list.tasks,
					canban: list.tasks.canban.map((card: CardItem) => {
						if (card.id !== cardId) {
							return card;
						}

						return {
							...card,
							date: moment(date).format('D MMM')
						};
					})
				}
			};
		});

		setLists(newLists);
	};

	const deleteList = (id: string): void => {
		setLists(lists.filter((list: ListInterface) => list.id !== id));
	};

	const addList = (): void => {
		setLists([
			...lists,
			{
				id: uuidv4(),
				title: '',
				color: '',
				tasks: {
					canban: [],
					default: []
				}
			}
		]);
	};

	const deleteCard = (cardId: string, listId: string): void => {
		const newLists = lists.map((list: ListInterface) => {
			if (list.id !== listId) {
				return list;
			}

			return {
				...list,
				tasks: {
					...list.tasks,
					canban: list.tasks.canban.filter((card: CardItem) => card.id !== cardId)
				}
			};
		});

		setLists(newLists);
	};

	const addTask = (id: string): void => {
		const newLists = lists.map((list: ListInterface) => {
			if (list.id !== id) {
				return list;
			}

			return {
				...list,
				tasks: {
					...list.tasks,
					canban: [
						...list.tasks.canban,
						{
							id: uuidv4(),
							label: 'Add a title',
							description: '',
							date: moment().format('DD MMM')
						}
					]
				}
			};
		});

		setLists(newLists as any);
	};

	const reorderCards = (list: any, startIndex: any, endIndex: any): CardItem[] => {
		const reordered = [...list];
		const [removed] = reordered.splice(startIndex, 1);
		reordered.splice(endIndex, 0, removed);

		return reordered;
	};

	const reorderCardsInList = (destination: DraggableLocation | undefined, source: DraggableLocation): void => {
		if (!destination) {
			return;
		}

		const { droppableId } = destination;

		const targetList = lists.find((listItem: ListInterface) => listItem.id === droppableId);

		if (!targetList) {
			return;
		}

		const originalCards = targetList.tasks.default;
		const orderedCards = reorderCards(originalCards, source.index, destination.index);


		const newLists = lists.map((list: ListInterface) => {
			if (list.id !== droppableId) {
				return list;
			}

			return {
				...list,
				tasks: {
					...list.tasks,
					default: orderedCards
				}
			};
		});

		setLists(newLists);
	};

	const reorderRowsInDifferentLists = (
		destination: DraggableLocation | undefined,
		source: DraggableLocation,
		sourceList: any,
		destinationList: any,
		source_list_id: number,
		destination_list_id: number
	): any => {
		if (!destination || !source) {
			return;
		}

		if (!sourceList || !sourceList.length || !destinationList ) {
			return;
		}
		var movedCard: any = sourceList[source.index];
		movedCard.listId = destination_list_id

		var sourceCards = [...sourceList];
		var destinationCards = [...destinationList];
		sourceCards.splice(source.index, 1);
		destinationCards.splice(destination.index, 0, movedCard);
		sourceCards.forEach((row:any, index:number) => row.pos = index+1)
		destinationCards.forEach((row:any, index:number) => {row.pos = index+1 })
		const newLists = lists.map((list: ListInterface) => {
			if (list.id === source_list_id) {
				return {
					...list,
					tasks: {
						...list.tasks,
						default: sourceCards
					}
				};
			}

			if (list.id === destination_list_id) {
				return {
					...list,
					tasks: {
						...list.tasks,
						default: destinationCards
					}
				};
			}

			return list;
		});
		setLists(newLists);
		return [...sourceCards, ...destinationCards]
	};

	const reorderRows = (rows: any, startIndex: any, endIndex: any, source_list_id: number, destination_parent_index: number): any => {
		let reordered = [...rows];
		const [removed] = reordered.splice(startIndex, 1);
		reordered.splice(endIndex, 0, removed);
		reordered.forEach((row, index) =>  row.pos = index+1)
		dispatch({
			type: UsersActionTypes.SET_USER,
			payload: {
				lists: lists.map((list: ListInterface) => {
					if (list.id !== source_list_id) {
						return list;
					}

					return {
						...list,
						tasks: {
							...list.tasks,
							default: destination_parent_index ?
							list.tasks.default.map((task: TaskInterface, index: number) => {
								if (index !== destination_parent_index) {
									return task;
								}

								return {
									...task,
									child_tasks: reordered
								}
							})
							:reordered
						}
					};
				}),
				id
			}
		});

		return [...rows];


	};


	const onDragEnd = (result: DropResult): void => { //tasks
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		// let task = parent_id && parent_id > 0 ? source.find((item: any) => item.id === parent_id).child_tasks.find((item: any) => item.id === id) :
		let source_list_id = Number(source.droppableId.split('-')[0])
		let source_list_index = Number(source.droppableId.split('-')[1])
		let destination_list_id = Number(destination.droppableId.split('-')[0])
		let destination_list_index = Number(destination.droppableId.split('-')[1])
		let destination_parent_index = destination.droppableId.split('-')[2] ? Number(destination.droppableId.split('-')[2]) : 0
		let sourceList = destination_parent_index ? lists[source_list_index].tasks.default[destination_parent_index].child_tasks : lists[source_list_index].tasks.default
		let destinationList = lists[destination_list_index].tasks.default
	const rows =
		source_list_index === destination_list_index
			? reorderRows(sourceList, destination.index, source.index, source_list_id, destination_parent_index)
			: reorderRowsInDifferentLists(destination,source, sourceList, destinationList,source_list_id, destination_list_id);
		if( rows && rows.length )  { setTasksList(rows)}

	};


	const renderDraggableContext = (): React.ReactElement => (
		<DragDropContext onDragEnd={onDragEnd} onDragStart={() => {}}>
			{lists.map((list: ListInterface, key: number) => (
						<Droppable droppableId={String(list.id)} direction="vertical" key={key}>
							{(provided: DroppableProvided): React.ReactElement => (
								<List
									onTitleChange={changeTitle}
									onDelete={deleteList}
									key={key}
									listTitle={list.task_category}
									stripeColor={list.color}
									id={list.id}
									onAddTask={addTask}
									provided={provided}
									innerRef={provided.innerRef}
									placeholder={list.task_category}
								>
									{list.tasks.canban.map((card: CardItem, index: number) => (
										<Draggable draggableId={`${key}${index}`} index={index} key={index}>
											{(provided: DraggableProvided): React.ReactElement => (
												<Card
													provided={provided}
													innerRef={provided.innerRef}
													id={card.id}
													listId={list.id}
													key={index}
													description={card.description}
													label={card.label}
													date={card.date}
													onDelete={deleteCard}
													onDateClick={(): void => {
														setIsCalendarOpen(!isCalendarOpen);
														setCurrentCard(card.id);
														setCurrentList(list.id);
													}}
													onTypeClick={(): void => {
														return;
													}}
													onDescriptionChange={changeDescription}
												></Card>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</List>
							)}
						</Droppable>
			))}
		</DragDropContext>
	);



	const renderListView = (listsParam: any): any =>  (
			<DragDropContext onDragEnd={onDragEnd}
				onDragStart={(draggedItem: any)=>{
					let childNumber  = draggedItem.source.droppableId.split('-')[2]
					let child = Boolean(childNumber)
						setDisableParentDroppable(draggedItem.source.droppableId)
					}}>
					{listsParam.map((list: ListInterface, index: number) => {
						let sd = list.task_category ?  shootingDays.filter((sd: ShootingDay) => sd.id === Number(list.task_category))[0] : undefined
						return (
						<Droppable droppableId={`${list.id}-${index}`} direction="vertical"  key={list.id}
						// isDropDisabled={disableParentDroppable != `${list.id}-${index}`}
						isDropDisabled={Boolean(disableParentDroppable.split('-')[2])}>
								{(provided: DroppableProvided, snapshot): React.ReactElement => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
								<ListView
									options
									fields={fields}
									titles={list && list.task_title ? list.task_title : undefined}
									setFields={setFields}
									type={TableType.TASK_LIST_VIEW}
									addColumnDispatch={addColumnDispatch}
									updateColumnTitleDispatch={updateColumnTitleDispatch}
									deleteColumnDispatch={deleteColumnDispatch}
									addNewCategory={addNewCategory}
									deleteCategory={(listId: number)=>{
										deleteTaskCategory(listId)
										dispatch({
											type: UsersActionTypes.REMOVE_LIST,
											payload: {id,listId}
										});
									}}

									provided={provided}
									disableParentDroppable={disableParentDroppable}
									innerRef={provided.innerRef}
									id={id}
									index={index}
									list={list}
									number={sd ? shootingDays.findIndex((shootingDay:ShootingDay)=> shootingDay.id === sd.id) : undefined}
									category={sd && sd.date ? new Date(sd.date) : 'no_date'}
									handleSidebarTitleChange={handleSidebarTitleChange}
									availableShootingDaysOptions={availableShootingDaysOptions}
									rows={list.tasks.default
										.filter((task: DefaultTaskInterface) => task.status === 'Active' )//active
										.map((task: DefaultTaskInterface) => ({ ...task, listId: list.id }))
									}
								/>
						</div>
						)}
						</Droppable>
						)})}
			</DragDropContext>
		);

	const renderCalendar = (): React.ReactNode =>
		isCalendarOpen ? (
			<CalendarComponent
				onChange={(date: Date): void => {
					changeDate(date, currentList, currentCard);
					setIsCalendarOpen(!isCalendarOpen);
				}}
				onOutsideClick={() => {
					setIsCalendarOpen(false);
				}}
				date={new Date()}
				minDate={moment().toDate()}
			/>
		) : null;

	const onUserClick = (id: string): void => {
		dispatch({
			type: UsersActionTypes.SET_USERS,
			payload: users.map(
				(user: UserInterface): UserInterface => ({
					...user,
					active: user.id === id
				})
			)
		});
	};

	return (

			<div
				onClick={(): void => {
					if (isCalendarOpen) {
						setIsCalendarOpen(false);
					}
				}}
				className={classnames('position-relative',{
					'calender-open': isCalendarOpen
				})}
			>
					{/* <div className="c-layout-options">
				<button
					onClick={(): void => setIsListView(true)}
					className={`c-btn-icon c-btn-icon--list-view${isListView ? ' active' : ''}`}
				>
					<SVG src="/assets/images/list-view-icon.svg" />
				</button>

				<button
					onClick={(): void => setIsListView(false)}
					className={`c-btn-icon c-btn-icon--canban${isListView ? '' : ' active'}`}
				>
					<SVG src="/assets/images/canban-view-icon.svg" />
				</button>
			</div> */}

				{renderCalendar()}
				{isListView ? (
					<div className="mx-1 c-content__container c-content__container--tasks-list-view">
						{user ?
						<>
						{renderListView(lists)}

						<h3 className="c-content__container-delimiter"><FormattedMessage id='done_tasks'/></h3>
						<Table
							id={id}
							fields={fields}
							setFields={setFields}
							type={TableType.TASK_LIST_VIEW}
							rows={lists
								.reduce(
									(result: DefaultTaskInterface[], current: ListInterface) => [
										...result,
										...current.tasks.default
									],
									[]
								)
								.filter((task: DefaultTaskInterface) => task.status === 'Done' ) //done
								.map((task: DefaultTaskInterface) => ({ ...task }))}
							index={1}
							isDone={true}
						/>
						</>
					 	:null
						 }
					</div>
				) : (
					<div className="c-content__container c-content__container--tasks-canban-view">
						<div className="c-content__tasks">{renderDraggableContext()}</div>

						<button className="c-btn c-btn--rounded c-btn--rounded--with-opacity" onClick={()=>addList()}>
							<SVG src="/assets/images/add_circle.svg" />
							Add new list
						</button>
					</div>
				)}

				<UsersNav />

				{/*<TasksNav />*/}

			</div>
);
};

export default Tasks;
