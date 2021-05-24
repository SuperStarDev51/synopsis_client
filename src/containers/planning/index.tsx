import * as React from 'react';
import SVG from 'react-inlinesvg';
import { useSelector, useDispatch } from 'react-redux';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { RootStore } from '@src/store';
import { UserInterface } from '@containers/tasks/interfaces';
import { UsersActionTypes } from '@containers/tasks/enums';

import { TaskPlanning, Event } from './interfaces';
import { ExpensesActionTypes } from '@containers/budget/enums';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { PlanningActionTypes, EventActionTypes } from '@containers/planning/enum';
import {  CalendarComponent, Popup, Table, TableType } from '@components';
import { addTask } from '../tasks/initial-state';
import { addProject } from './initial-state';

export const Planning: React.FC = () => {
	const [date, setDate] = React.useState<Date>(new Date());

	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
	const [isDateChosen, setIsDateChosen] = React.useState(false);
	const [isSortingPopupOpen, setIsSortingPopupOpen] = React.useState(false);
	const [eventName, setEventName] = React.useState<string>('');
	const [eventDate, setEventDate] = React.useState<any>('');
	const [eventBudget, setEventBudget] = React.useState<number>(0);
	const [isEventCreated, setIsEventCreated] = React.useState<boolean>(false);

	const planningState = useSelector((state: RootStore) => state.planning);
	const events = useSelector((state: RootStore) => state.events);
	const event = useSelector((state: RootStore) =>
	state.events.filter((event: Event) => {
		return event.preview;
	})[0]
);


	React.useEffect(() => {
		if( event && event.preview ) {
			setEventName(event.project_name);
			setEventDate(event.date);
			setEventBudget(event.budget);
			setIsEventCreated(true);
		}
	},[event]);



	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const user = useSelector((state: RootStore) => state.user)
	const users = useSelector((state: RootStore) => state.users);
	const activePlanningTasks = useSelector((state: RootStore) => state.planning.active);
	const isEventDataFilled: boolean = eventName && eventDate ? true : false;
	const activeUser = useSelector((state: RootStore) => state.users.find((user: UserInterface) => user.active))!;

	const dispatch = useDispatch();

	const handleRowCalendarClick = (): void => {
		setIsCalendarOpen(!isCalendarOpen);
	};

	React.useEffect(() => {
		if (isDateChosen) {
			// const dateFormat = moment(date).format('DD/MM/YYYY');
			setEventDate(date);
			setIsDateChosen(false);
		}
	}, [isDateChosen]);



	const setEvent = (project_name: string, date: any, budget: number): void => {
		dispatch({
			type: EventActionTypes.SET_EVENTS,
			payload: [
				{
					project_name,
					date,
					budget,
					preview: true,
					status: 'active',
					vat: 10
				} as Event
			]
		});
	}

	const handleCreateEventClick = (): void => {
		if (isEventDataFilled) {
			setIsEventCreated(true);
			setEvent(eventName, eventDate, eventBudget)
			addProject({user_id: user.id, company_id: user.company_id,project_name: eventName, date: eventDate, budget: eventBudget, tasks: activePlanningTasks})
		}
	};

	const allOwners = activePlanningTasks.map((task: TaskPlanning) => task.owner);
	const currentOwners = users.map((user: any) => user.name);
	const newOwners = allOwners.filter((el: any) => !currentOwners.includes(el));

	const allSuppliers = activePlanningTasks.map((task: TaskPlanning) => task['supplier_name']);
	const currentSuppliers = suppliers.map((user: any) => user.name);
	const newSuppliers = allSuppliers.filter((el: any) => !currentSuppliers.includes(el));

	const filteredTasks = activePlanningTasks.filter((task: any) => task.price !== 0);

	const setSuppliers = (): void => {
		let removeNewSuppliersDuplicates = newSuppliers.filter((item, index) => item !== '').sort();
		// dispatch({
		// 	type: SuppliersActionTypes.SET_SUPPLIERS,
		// 		payload: [
		// 			...suppliers,
		// 			...removeNewSuppliersDuplicates.map((supplier: string, index: number) => ({
		// 				id: uuidv4(),
		// 				color: '',
		// 				'supplier_name': supplier,
		// 				type: activePlanningTasks[index].type,
		// 				'service_description': '',
		// 				'contact_name': '',
		// 				phone: '',
		// 				email: '',
		// 				status: 'Open'
		// 			}))
		// 		]
		// 	});

	}



	const handleUpdateEventClick = (): void => {
		if (activePlanningTasks.length > 0) {
			let allUsers: UserInterface[] = [];
			let removeNewOwnersDuplicates = newOwners.filter((item, index) => newOwners.indexOf(item) == index);
			addProject({user_id: user.id, project_id: event.id, company_id: event.company_id, project_name: event.project_name , date: event.date, budget: event.budget, tasks: activePlanningTasks})

			// if (removeNewOwnersDuplicates.length) {
			// 	allUsers = [
			// 		...users.map((user: UserInterface) => ({ ...user, active: false })),
			// 		...removeNewOwnersDuplicates.map((name: string) => ({
			// 			id: uuidv4(),
			// 			name,
			// 			lists: [
			// 				{
			// 					id: uuidv4(),
			// 					title: 'To Do',
			// 					color: '',
			// 					tasks: {
			// 						canban: [],
			// 						default: []
			// 					}
			// 				}
			// 			],
			// 			active: true
			// 		}))
			// 	];


			// 	dispatch({
			// 		type: UsersActionTypes.SET_USERS,
			// 		payload: allUsers
			// 	});
			// }

			dispatch({
				type: PlanningActionTypes.UPDATE_PLANNING_TASK,
				payload: {
					completed: [
						...planningState.completed,
						...planningState.active.filter((item: TaskPlanning) => item.owner !== '')
					],
					active: [...planningState.active.filter((item: TaskPlanning) => item.owner === '')]
				}
			});


			setSuppliers()

			dispatch({
				type: ExpensesActionTypes.ADD_ROW_TO_EXPENSE_TABLE,
				payload: [
					...filteredTasks.map((task: any, index: number) => ({
						id: uuidv4(),
						color: '',
						'expense-description': filteredTasks[index].description,
						price: filteredTasks[index].price,
						'price-prim': 0,
						percentage: 0,
						vat: 0,
						'supplier_name': filteredTasks[index]['supplier_name'],
						status: 'Open',
						comments: '',
						type: filteredTasks[index].type
					}))
				]
			});

			activePlanningTasks.forEach((task: TaskPlanning) => {
				const owner = task.owner;
				const source: UserInterface[] = allUsers.length ? allUsers : users;
				const user = source.find((person: UserInterface) => person.first_name+' '+person.last_name === owner);

				if (user) {
					let Task = {
						listId: user.lists[0].id,
						userId: user.id,
						id: task.id,
						color: task.color,
						description: task.description,
						type: task.type,
						'supplier_name': task['supplier_name'],
						price: task.price,
						comments: '',
						status: 'active',
						attachments: {}
					}
					dispatch({
						type: UsersActionTypes.ADD_DEFAULT_TASK,
						payload: Task
					});

				addTask(Task)


				}
			});


		}
	};

	// React.useEffect(() => {
	// 	setIsEventCreated(event[0].created);
	// }, [handleCreateEventClick]);

	return (
			<div className="c-content c-content--planning">
				<div className="c-content__header c-content__header--planning">
					<div
						className={`c-row c-row--create-event${
							isCalendarOpen ? ' c-content--task--calendar-open' : ''
						}${isEventCreated ? ' inactive' : ''} `}
					>
						{isCalendarOpen && (
							<CalendarComponent
								onChange={(date: Date): void => {
									setDate(date);
									setIsCalendarOpen(!isCalendarOpen);
									setIsDateChosen(!isDateChosen);
								}}
								onOutsideClick={(): void => {
									setIsCalendarOpen(false);
								}}
								date={date}
								minDate={moment().toDate()}
								className="n-calendar--inRow"
							/>
						)}

						<div
							className={`c-table__cell c-table__cell-create-event c-table__cell-create-event--name${
								!eventName ? ' mandatory' : ''
							} `}
						>
							<input
								onChange={(e: any): void => {
									setEventName(e.target.value);
								}}
								type="text"
								name="name"
								id="name"
								placeholder="Event name"
								value={eventName}
							/>
						</div>
						<div
							onClick={handleRowCalendarClick}
							className={`c-table__cell c-table__cell-create-event c-table__cell-create-event--date${
								!eventDate ? ' mandatory' : ''
							} `}
						>
									{/* <SVG src="/assets/images/calendar-icon1.svg" /> */}
							<input type="text" name="name" value={moment(eventDate).format('DD/MM/YYYY')} id="" readOnly placeholder="Event date" />
						</div>
						<div className="c-table__cell c-table__cell-create-event c-table__cell-create-event--budget">
							<input
								onChange={(e: any): void => {
									setEventBudget(e.target.value);
								}}
								type="number"
								name="budget"
								id="budget"
								placeholder="Planned Budget"
								value={eventBudget === 0 ? '' : eventBudget}
							/>
						</div>
					</div>

					<button className="c-add-team-members">
						<span></span>
						Invite Team members
					</button>
				</div>

				<div className="c-content__body c-content__body--planning">
					<div className="c-table">
						{/* {planningState.active.length > 0 && isEventCreated && (
							<div
								onClick={(): void => {
									setIsSortingPopupOpen(true);
								}}
								className={`c-table__options c-table__options--tasks-list-view${
									isSortingPopupOpen ? ' popup-open' : ''
								}`}
							>
								<h3 className="c-table__options-title c-table__options-title--tasks-list-view">
									Sort by
								</h3>

								<Popup
									isOpen={isSortingPopupOpen}
									onClick={(): void => {
										return;
									}}
									onOutsideClick={(): void => setIsSortingPopupOpen(false)}
									options={Object.keys(planningState.active[0])
										.filter(
											(title: string) =>
												!['userId', 'id', 'color', 'status', 'listId'].includes(title)
										)
										.map((text: string) => ({
											text,
											action: (): void => {
												dispatch({
													type: PlanningActionTypes.SORT_PLANNING_TASKS,
													payload: {
														key: text,
														tasks: planningState.active
													}
												});
												setIsSortingPopupOpen(!isSortingPopupOpen);
											}
										}))}
									className="c-popup--tasks-list-view"
								/>
							</div>
						)} */}

						<Table
							id={'planning'}
							type={TableType.PLANNING}
							rows={planningState.active}
							index={0}
							key={0}
							fields={[]}
							setFields={()=>{}}
							allRows={planningState.active}
							isEventCreated={isEventCreated}
						/>


						<button
							onClick={isEventCreated ? handleUpdateEventClick : handleCreateEventClick}
							className={`c-btn c-btn--rounded c-btn--rounded-centered${
								isEventDataFilled
									? ''
									: isEventCreated
									? activePlanningTasks.length !== 0
										? ''
										: ' inactive'
									: ' inactive'
							}`}
						>
							{isEventCreated ? 'Update Event' : 'Import from Excel'}
						</button>

						<h3 className="c-content__container-delimiter">Assigned Tasks</h3>

						<Table
							id={'planning--assigned-tasks'}
							type={TableType.PLANNING}
							rows={planningState.completed}
							index={0}
							key={1}
							isDone={true}
							fields={[]}
							setFields={()=>{}}
							allRows={planningState.completed}
							isEventCreated={isEventCreated}
						/>
					</div>
				</div>
			</div>
	);
};

export default Planning;
