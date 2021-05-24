import * as React from 'react';
import SVG from 'react-inlinesvg';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from "react-intl"
import {addCharacter, deleteCharacter} from '@containers/scripts/initial-state'
import * as ExpensesActions from "../../redux/actions/budget/expenses"
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { SupplierWithJob } from '../../helpers/helpers'
import * as shootingDaysActions from "../../redux/actions/shooting-days"
import * as scenesBreakdownActions from "../../redux/actions/scenes-breakdown"
import { addShootingDay } from '@containers/shooting_days/initial-state';
import { addScene } from '@containers/scripts/initial-state';
import {
	Draggable,
	Droppable,
	DropResult,
	DragDropContext,
	DroppableProvided,
	DraggableStateSnapshot,
	DraggableProvided
} from 'react-beautiful-dnd';
import { RootStore } from '@src/store';
import { capitalize } from '@utilities';
import { TaskListViewItem } from '@containers/tasks';
import { Event } from '@containers/planning/interfaces';
import { Supplier } from '@containers/suppliers/interfaces';
import { Income, Expense, } from '@containers/budget/interfaces';
import { deleteSupplier, setSuppliersList, addSupplier } from '@containers/suppliers/initial-state';
import { addExpense, setExpensesList, deleteExpense, addPayment, deletePayments } from '@containers/budget/initial-state';
import { deleteTask, addTask } from '@containers/tasks/initial-state';

import { CharactersActionTypes } from '@containers/tasks/ListsReducer';
import { Popup, IncomeRow, ExpenseRow, SupplierRow, TeamExtraHours, PaymentRow, PostRow, PostScenesRow, PostActorsRow, LocationRow, PostLocationRow, UnplannedRow, ExtraExpenseRow } from '@components';
import { ExpensesActionTypes, IncomeActionTypes } from '@containers/budget/enums';

import PlanningRow from '@src/components/planning-row';
import { UsersActionTypes } from '@src/containers/tasks/enums';
import TaskListViewRow from '@src/components/task-list-view-row';
import { TaskPlanning } from '@src/containers/planning/interfaces';
import { PlanningActionTypes, EventActionTypes } from '@src/containers/planning/enum';
import { DefaultTaskInterface, ListInterface, UserInterface } from '@src/containers/tasks/interfaces';

import './index.scss';
import { assignUniqueKeysToParts } from 'react-intl/src/utils';
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import moment = require("moment");
import {SuppliersActionTypes} from "@root/src/containers/suppliers/enums";
import CallsheetItemRow from '../callshet-item-row';
import SceneTakesRow from '../scene-takes-row';
import {PostEmployeesRow} from "@root/src/components/post-employees-row";
const titlesExtraColumns = ['number1', 'number2', 'number3', 'text1', 'text2', 'text3', 'percentage1', 'percentage2', 'percentage3']


export enum TableType {
	EXPENSES = 'expenses',
	INCOME = 'income',
	SUPPLIERS = 'suppliers',
	CHARACTER = 'character',
	TASK_LIST_VIEW = 'task-list-view',
	PLANNING = 'planning',
	CALLSHEET_ITEM = 'callsheet-item',
	SCENE_TAKES = 'scene-takes',
	TEAM_EXTRA_HOURS = 'team-budget',
	CALCULATOR = 'team-budget',
	BUDGET_DAILY = 'budget-daily',
	PAYMENTS = 'payments',
	UNPLANNED = 'additional_expenses',
	POST_ROW = 'post_row',
	POST_SHOOTING_DAY_LOCATIONS = 'post_shooting_day_locations',
	POST_SHOOTING_DAY_SCENES = 'post_shooting_day_scenes',
	POST_SHOOTING_DAY_ACTORS = 'post_shooting_day_actors',
	POST_SHOOTING_DAY_EMPLOYEES = 'post_shooting_day_employees',
	POST_SHOOTING_DAY_EXTRA_EXPENSES = 'post_shooting_day_extra_expenses',
	LOCATIONS = 'LOCATIONS',
}

interface Props {
	readonly id: number;
	readonly type: TableType;
	readonly sd: any;
	readonly sceneId: any;
	readonly rows: any;
	readonly extraRows?: any;
	readonly index: number;
	readonly title: string;
	readonly fields: any
	readonly headerColor?: string
	readonly disableDelete?: boolean;
	readonly disableAddNew?: boolean;
	readonly provided?: DroppableProvided;
	readonly innerRef?: any;
	readonly isDone?: boolean;
	readonly listId?: any;
	readonly disableParentDroppable?: string;
	readonly lists: ListInterface[];
	readonly allRows?: TaskPlanning[];
	readonly isEventCreated?: boolean;
	readonly titles?: any;
	readonly deleteColumnDispatch?: (key: string, category_id: number) => void;
	readonly updateColumnTitleDispatch: (key: string, value: string, category_id?: any) => void;
	readonly addNewCategory?: () => void;
	readonly setFields?: (value: any[]) => void;
}

const formatCurrency = (value: number, decimals = 2): number => Number(value.toFixed(decimals));

const updateRows = (rows: Income[]): Income[] =>
	rows.map((row: Income) => {
		const fee = (Number(row.price) * Number(row.fee)) / 100;
		const income = Number(row.price) - Number(row.vat) - fee;

		row.income = formatCurrency(income);
		row['total-income'] = formatCurrency(income * Number(row['amount-sold']));

		return row;
	});

export const Table: React.FC<Props> = (props: Props) => {
	const { type, index, extraRows, headerColor, title, titles, innerRef, disableDelete, disableAddNew, provided, isDone, lists, listId, allRows, isEventCreated, disableParentDroppable, deleteColumnDispatch, fields } = props;
	const rows =
		type === TableType.INCOME
			? updateRows(props.rows)
			: type === TableType.TASK_LIST_VIEW
				? props.rows
				: type === TableType.SUPPLIERS
					? props.rows
					: props.rows;

	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const characters = useSelector((state: RootStore) => state.characters)
	const event = useSelector((state: RootStore) => state.events.filter((event: Event) => { return event.preview })[0])

	const allSuppliers = useSelector((state: RootStore) => state.suppliers)
	const suppliersRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex != 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const ActorsRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex == 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);
	const scripts = useSelector((state: RootStore) => state.scripts);
	const user = useSelector((state: RootStore) => state.users.length ? state.users.find((user: UserInterface) => user.active) : undefined);
	const budgetStatus = useSelector((state: RootStore) => state.budgetStatus);
	const budgetTypes = useSelector((state: RootStore) => state.budgetTypes);
	const supplierStatus = useSelector((state: RootStore) => state.supplierStatus);
	const supplierTypes = useSelector((state: RootStore) => state.supplierTypes);
	const taskTypes = useSelector((state: RootStore) => state.taskTypes);
	const [isTitlePopupOpen, setisTitlePopupOpen] = React.useState(false);
	const [sidebarTitle, setSidebarTitle] = React.useState(title);
	const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false);
	const [isVatPopupOpen, setIsVatPopupOpen] = React.useState<boolean>(false);
	const [isPricePopupOpen, setIsPricePopupOpen] = React.useState<boolean>(false);
	const [isPricePrimCellVisible, setIsPricePrimCellVisible] = React.useState<boolean>(false);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0])
	const vatValue = activeEvent ? activeEvent.vat : null;

	const AddNewButton = (onClick: any) => !props.disableAddNew ? (
		<div
			className="btn opacity-08 p-0 mb-1"
			onClick={() => onClick()}>
			+ <FormattedMessage id={'add_new'} />
		</div>
	):null

	const [extraInputs, setExtraInputs] = React.useState<any>({});
	React.useEffect(() => {
		setExtraInputs({
			number1: titles ? titles.number1 : '',
			number2: titles ? titles.number2 : '',
			number3: titles ? titles.number3 : '',
			text1: titles ? titles.text1 : '',
			text2: titles ? titles.text2 : '',
			text3: titles ? titles.text3 : '',
			percentage1: titles ? Number(titles.percentage1) : '',
			percentage2: titles ? Number(titles.percentage2) : '',
			percentage3: titles ? Number(titles.percentage3) : ''
		})
	}, [titles])

	const updateExtraInputs = (title: any, value: string | number) => {
		let newExtraInputs = extraInputs
		newExtraInputs[title] = value
		setExtraInputs(newExtraInputs)
	}

	const checkFields = (ListFields: any[]) => {
		if (titles && props.setFields) {
			let fields: any = [...ListFields];
			let checkFields: any[] = ['text1', 'text2', 'text3', 'number1', 'number2', 'number3', 'percentage3']
			checkFields.forEach((title: any, i: number) => {
				if (titles[title]) { fields.push(title) }
			})
			fields = [...new Set(fields)]
			if (fields && fields.length) { props.setFields(fields) } else props.setFields(ListFields)
		}
	}

	React.useEffect(() => {
		if (type == TableType.EXPENSES ||
			type == TableType.TASK_LIST_VIEW ||
			type == TableType.SUPPLIERS
		) { checkFields(fields) }
	}, [titles])



	const eventId = activeEvent ? activeEvent.id : null
	const hasRows = rows?.length !== 0 ? true : false;

	const calculateVat = (vat: number | string): void => {
		const percentage = Number(vat < 0 ? 0 : vat > 100 ? 100 : vat);

		// Update the store
		dispatch({
			type: type === TableType.INCOME ? IncomeActionTypes.SET_INCOME : ExpensesActionTypes.SET_EXPENSES,
			payload: {
				rows: rows.map((row: Expense | Income) => ({
					...row,
					vat: (Number(row.price) * percentage) / 100
				})),
				title,
				index
			}
		});
	};

	React.useEffect(() => {
		if (type === TableType.EXPENSES || type === TableType.INCOME) {
			calculateVat(vatValue);
		}
	}, [vatValue, type]);

	const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value }
		} = e;

		const parsedValue = value === '' ? 0 : value;

		if (parsedValue === 0 || parsedValue) {
			calculateVat(parsedValue);

			dispatch({
				type: EventActionTypes.SET_VAT,
				payload: parsedValue
			});
		}
	};

	// const totalIncomeFee = rows.reduce((acc: number, row: Income) => {
	// 	if (row.fee === undefined) {
	// 		return acc + 0;
	// 	}

	// 	return acc + Number((Number(row.fee) * Number(row.price)) / 100);
	// }, 0);

	// const totalVat = rows.reduce((acc: number, row: Expense | Income) => {
	// 	if (row.vat === undefined) {
	// 		return acc + 0;
	// 	}

	// 	return acc + Number(row.vat);
	// }, 0);

	const totalExpenses =
		type === TableType.EXPENSES
			? rows.reduce((acc: number, row: any) => {
				if (row.price === undefined) {
					return acc + 0;
				}

				return Number(acc) + (Number(row.price) * Number(row.quantity));
			}, 0)
			:
			0;


	const totalIncome =
		type === TableType.INCOME
			? rows.reduce((acc: number, row: Income) => {
				if (row['total-income'] === undefined) {
					return acc + 0;
				}

				return Number(acc) + Number(row['total-income']);
			}, 0)
			: 0;



	const onKeyPress = (id: string): void => {
		// const source = type === TableType.PLANNING ? allRows : rows;
		// const item = source.find((item: DefaultTaskInterface) => item.id === id);

	}

	const changeValueDB = async (value: any, id: string | number, field: string, i?: number) => {
		const source = type === TableType.PLANNING ? allRows : rows;
		let index = source.findIndex((item: any, i: number) => item.id === id);
		var task;
		if ((type === TableType.UNPLANNED) || (type === TableType.POST_SHOOTING_DAY_SCENES) || (type === TableType.POST_SHOOTING_DAY_LOCATIONS) || (type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES)) task = source.find((item: any, i: number) => i === id);
		else task = source.find((item: any) => item.id === id);
		// else task = parent_id && parent_id > 0 ? source.find((item: any) => item.id === parent_id).child_tasks.find((item: any) => item.id === id) : source.find((item: any) => item.id === id);
		var item = { ...task, [field]: value }

		if (type === TableType.EXPENSES) {
			let supplier = SupplierWithJob(item.supplier_job_title, [...suppliers, ...actors])[i ? i : 0]
			let supplier_id = supplier && supplier.id ? supplier.id : null
			addExpense({ ...item, listId, supplier_id })
		}

		if (type === TableType.UNPLANNED) {
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, 'additional_expenses': [...source.filter((item: any, i: number) => i != id), item] })
		}

		if (type === TableType.LOCATIONS) {
			addScene({
				coordinates: value,
				shooting_day_id: props.id,
				project_id: activeEvent.id,

				chapter_number: id.chapter_number,
				scene_number: id.scene_number,
			});
		}

		if (type === TableType.POST_SHOOTING_DAY_SCENES) {
			if (field === 'status') {
				let shootingDayIdTo = props.id;

				addScene({
					scene_status_id: value,
					shooting_day_id: props.id,
					shooting_day_id_to: shootingDayIdTo,
					chapter_number: item.chapter_number,
					project_id: activeEvent.id,
					scene_number: item.scene_number,
				});

			} else if (field === 'shooting_day_id_to') {
				let result = await addScene({
					shooting_day_id: props.id,
					shooting_day_id_to: value,
					chapter_number: item.chapter_number,
					project_id: activeEvent.id,
					scene_number: item.scene_number,
				});

				if (result) {
					let sceneId = scripts[0].scenes.filter(scene => scene.project_scene_id === result.project_scene.id)[0].scene_id;
					dispatch(shootingDaysActions.setShootingDaySceneParameter(sceneId, 'new_shooting_day_id', result.new_shooting_day_id ));
					dispatch(scenesBreakdownActions.setSceneParameter(sceneId, 'new_shooting_day_id', result.new_shooting_day_id));
				}

			} else {
				addScene({
					chapter_number: item.chapter_number,
					project_id: activeEvent.id,
					scene_number: item.scene_number,
					[field]: value
				})
			}
		}
		if (type === TableType.PAYMENTS) {
			addPayment({ project_id: activeEvent.id, payment_id: id, budget_id: props.id, ...item })
		}

		if (type === TableType.POST_ROW) {
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, 'team_hours': item })
		}
		if (
			type === TableType.POST_SHOOTING_DAY_LOCATIONS ||
			type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES
		) {
			let table = type === TableType.POST_SHOOTING_DAY_LOCATIONS ? 'locations' :
				type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES ? 'extra_expenses' :
					// type === TableType.POST_SHOOTING_DAY_ACTORS ? 'characters' : 'employees'
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, [table]: [...source.filter((item: any, i: number) => i != id), item] })
		}

		if (type === TableType.POST_SHOOTING_DAY_ACTORS) {
			const updatedActors = props.sd?.actors?.map(actor => {
				if (actor.id !== id) {
					return actor;
				}
				return {
					...actor,
					[field]: value,
				}
			});

			addShootingDay({
				project_id: activeEvent.id,
				project_shooting_day_id: props.id,
				actors: updatedActors,
			})
		}

		if (type === TableType.type === TableType.POST_SHOOTING_DAY_EMPLOYEES) {
			const updatedEmployee = props.sd?.employee?.map(employee => {
				if (employee.id !== id) {
					return employee;
				}
				return {
					...employee,
					[field]: value,
				}
			});

			addShootingDay({
				project_id: activeEvent.id,
				project_shooting_day_id: props.id,
				actors: updatedEmployee,
			})
		}

		if (type === TableType.SUPPLIERS || type === TableType.CALCULATOR) {
			// let supplier_type_id  = field == 'type' && value ? supplierTypes.filter(x => {if(x.supplier_type == value){return x}})[0].id : null;
			let supplier_status_id = field == 'status' && value ? supplierStatus.filter(x => { if (x.supplier_status == value) { return x } })[0].id : null;
			addSupplier({ ...item, supplier_status_id })
		}

		if (type === TableType.TASK_LIST_VIEW) {
			let task_type_id = field == 'type' && value ? taskTypes.filter(x => { if (x.task_type == value) { return x } })[0].id : null;
			let due_date = field == 'due_date' && value ? value : null;
			let attachments = {}
			let newTask: any = await addTask({ ...item, task_type_id, project_id: eventId, attachments, user_id: user.id, due_date })
			if (newTask && newTask.task && newTask.tasks) {
				dispatch({
					type: UsersActionTypes.SET_USERS,
					payload: newTask.tasks
				});
			}
		}
	};

	const newRows = (newRowFromDB: any, source: any[], value: any, id: string | number, field: string) => source.map((row: any) => {
		let newRow = newRowFromDB ? newRowFromDB : row
		if (row.id !== id) {
			return row;
		}
		let newVal: string | number = value;
		if (['price', 'quantity', 'cost', 'amount-sold', 'fee', 'income', 'total'].includes(field)) {
			newVal = value ? parseFloat(value) : 0;
		}
		newRow[field] = newVal;
		return newRow;
	});

	const changeValue = async (value: any, id: string | number, field: string, i?: number) => {

		if (type === TableType.SCENE_TAKES) {
			props.onChange && props.onChange(id, field, value);
		}

		if (type === TableType.CALLSHEET_ITEM) {
			props.onChange && props.onChange({ [field]: value }, id);
			return;
		}

		if (type === TableType.LOCATIONS) {
			dispatch(shootingDaysActions.setShootingDaySceneParameter(id, field, value));
			dispatch(scenesBreakdownActions.setSceneParameter(id, field, value));
		}

		if (type === TableType.POST_SHOOTING_DAY_ACTORS) {
			dispatch({
				type: ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_ACTOR_PARAMS,
				payload: {
					sdId: props.id,
					actorId: id,
					field,
					value
				}
			});
		}

		if (type === TableType.POST_SHOOTING_DAY_EMPLOYEES) {
			dispatch({
				type: ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_EMPLOYEE_PARAMS,
				payload: {
					sdId: props.id,
					employeeId: id,
					field,
					value
				}
			});
		}

		if (type === TableType.BUDGET_DAILY) {

			dispatch({
				type: SuppliersActionTypes.CHANGE_SUPPLIER_PARAM,
				// type: SuppliersActionTypes.CHANGE_SUPPLIER_UNIT_COST,
				payload: {
					supplierId: id,
					value,
					supplierCategory: field
				}
			})
		}

		const source = type === TableType.PLANNING ? allRows : extraRows ? extraRows : rows;
		var task;
		if ((type === TableType.UNPLANNED) || (type === TableType.POST_SHOOTING_DAY_LOCATIONS) || type == TableType.CHARACTER) task = source.find((item: any, i: number) => i === id);
		else task = source.find((item: any) => item.id === id);
		// else task = parent_id && parent_id > 0 ? source.find((item: any) => item.id === parent_id).child_tasks.find((item: any) => item.id === id) : source.find((item: any) => item.id === id);
		var item = { ...task, [field]: value }

		if (type === TableType.CHARACTER && item.character) {
			let newSupplier: any = await onAddSupplier(fields, item)
			if (newSupplier ) {
				setCharacter(item, newSupplier)
			}
		}

		if (type === TableType.INCOME) {
			let new_rows = rows
			new_rows[id][field] = value

			dispatch(shootingDaysActions.setPostShootingDayValue(props.index, table, new_rows))

			dispatch({
				type: IncomeActionTypes.SET_INCOME,
				payload: {
					rows: newRows(item, source, value, id, field),
					title: title,
					index
				}
			});
			return;
		}

		if (type === TableType.EXPENSES) {
			let supplier = SupplierWithJob(item.supplier_job_title, [...suppliers, ...actors])[i ? i : 0]
			let supplier_id = supplier && supplier.id ? supplier.id : null
			let supplier_name = supplier && supplier.supplier_name ? supplier.supplier_name : ''
			await dispatch(ExpensesActions.setExpenses(newRows({ ...item, supplier_id, supplier_name }, source, value, id, field), index, title))
			return;
		}

		if (type === TableType.SUPPLIERS) {
			dispatch(SuppliersActions.setSuppliers(newRows(item, source, value, id, field), props.index, props.title))
			return;
		}

		if (type === TableType.CALCULATOR) {
			dispatch({
				type: SuppliersActionTypes.CHANGE_SUPPLIER_PARAM,
				payload: {
					field: field.field,
					supplierCategory: field.category,
					supplierId: id,
					value: value,
				}
			});
		}

		if (type === TableType.TASK_LIST_VIEW) {
			dispatch({
				type: UsersActionTypes.UPDATE_DEFAULT_TASK,
				payload: {
					userId: props.id,
					listId: listId,
					taskId: task.id,
					parent_task_id: task.parent_task_id,
					value,
					field
				}
			});
			return;
		}

		if (type === TableType.POST_ROW) {
			let new_rows = rows
			new_rows[0][field] = value
			dispatch(shootingDaysActions.setPostShootingDayValue(props.index, 'team_hours', new_rows[0]))
			return;
		}
		if (
			type === TableType.POST_SHOOTING_DAY_LOCATIONS ||
			type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES
		) {
			let table = type === TableType.POST_SHOOTING_DAY_LOCATIONS ? 'locations' :
				type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES ? 'extra_expenses' : 'employees'

			let new_rows = rows
			new_rows[id][field] = value

			dispatch(shootingDaysActions.setPostShootingDayValue(props.index, table, new_rows))
			return;
		}

		if (type === TableType.POST_SHOOTING_DAY_SCENES) {
			dispatch(shootingDaysActions.setShootingDaySceneParameter(id, field, value));
			dispatch(scenesBreakdownActions.setSceneParameter(id, field, value));
		}

		if (type === TableType.UNPLANNED) {
			dispatch(shootingDaysActions.setShootingDayParameterValue(task.shooting_day_index, type, value, field, id))
			return;
		}

		if (type === TableType.PAYMENTS) {
			dispatch(ExpensesActions.setPayments(props.index, listId, value, field, id));
			return;
		}

		if (type === TableType.PLANNING) {
			dispatch({
				type: PlanningActionTypes.SET_PLANNING,
				payload: newRows(item, source, value, id, field)
			});
			return;
		}
	};

	const onAddSupplier = async (fields: any, Supplier?: any) => {
		let supplier = {
			pos: rows.length + 1,
			category_id: listId ? listId : '',
			id: uuidv4(),
			'supplier_name': '',
			type: 'Chose type',
			'service_description': '',
			'contact_name': '',
			phone: '',
			email: '',
			status: '',
			company_id: event.company_id,
			project_id: event.id
		} as any

		let supplierRow = Supplier ? Supplier : supplier

		var newSupplier: any = await addSupplier(supplierRow)
		if (newSupplier && newSupplier.supplier) {
			supplier = newSupplier.supplier
			if (fields.includes('text1')) {
				supplier = { ...supplier, text1: '' }
			}
			if (fields.includes('text2')) {
				supplier = { ...supplier, text2: '' }
			}
			if (fields.includes('text3')) {
				supplier = { ...supplier, text3: '' }
			}
			if (fields.includes('number1')) {
				supplier = { ...supplier, number1: 0 }
			}
			if (fields.includes('number2')) {
				supplier = { ...supplier, number2: 0 }
			}
			if (fields.includes('number3')) {
				supplier = { ...supplier, number3: 0 }
			}

			await dispatch(SuppliersActions.setSuppliers([...rows, supplier], props.index, props.title))

			return supplier

		}
	};

	const setCharacter = async (Supplier: any, supplier: any) => {
		await addCharacter({ ...Supplier, project_id: activeEvent.id, supplier_id: supplier.id })
		dispatch({
			type: CharactersActionTypes.SET_CHARACTERS,
			payload: characters.map((c: any) => {
				if (c.character_id !== Supplier.character_id) return c
				else return { ...c, supplier_id: supplier.id }
			})
		});
	};

	const onAddIncome = (): void => {
		dispatch({
			type: IncomeActionTypes.SET_INCOME,
			payload: {
				title,
				rows: [
					...rows,
					{
						id: uuidv4(),
						color: '',
						'income-type': '',
						price: '',
						vat: '',
						fee: '',
						income: '',
						'amount-sold': '',
						'total-income': 0,
						'supplier_name': ''
					} as Income
				],
				index
			}
		});
	};

	const onAddPayment = async () => {
		let item = {
			description: '',
			name: '',
			date: '',
			amount: 1,
			comments: ''
		}
		var newPayment: any = await addPayment({ project_id: activeEvent.id, budget_id: props.id, ...item })
		if (newPayment && newPayment.payment) dispatch(ExpensesActions.setPayments(props.index, listId, [...rows, newPayment.payment]));
	};

	const onAddExpense = async (fields: any) => {
		let expense = {
			pos: rows.length + 1,
			listId: index,
			id: uuidv4(),
			'expense-description': '',
			price: 0,
			vat: 0,
			'supplier_name': '',
			type: '',
			comments: '',
			quantity: 1,
			status: '',
			project_id: event.id
		} as any
		var newExpense: any = await addExpense({ ...expense, listId })
		if (newExpense && newExpense.budget) {
			expense = newExpense.budget

			if (fields.includes('text1')) {
				expense = { ...expense, text1: '' }
			}
			if (fields.includes('text2')) {
				expense = { ...expense, text2: '' }
			}
			if (fields.includes('text3')) {
				expense = { ...expense, text3: '' }
			}
			if (fields.includes('number1')) {
				expense = { ...expense, number1: 0 }
			}
			if (fields.includes('number2')) {
				expense = { ...expense, number2: 0 }
			}
			if (fields.includes('number3')) {
				expense = { ...expense, number3: 0 }
			}

			dispatch(ExpensesActions.setExpenses([...rows, expense], index, title))
		}
	};

	const onAddExtraExpense = (): void => {
		let newRow = {
			description: '',
			price: 0,
			quantity: 1,
			total: 0,
			comments: ''
		}
		dispatch(shootingDaysActions.setPostShootingDayValue(props.index, 'extra_expenses', [...rows, newRow]))
	};

	const onAddPlanningTask = (): void => {
		dispatch({
			type: PlanningActionTypes.SET_PLANNING,
			payload: [
				...allRows,
				{
					id: uuidv4(),
					color: '',
					description: '',
					type: 'Chose type',
					'supplier_name': '',
					price: 0,
					owner: '',
					status: 'active'
				} as TaskPlanning
			]
		});
	};

	const onAddDefaultTask = async (fields: any) => {
		let task = {
			pos: rows.length + 1,
			listId: props.listId,
			supplier_id: props.id,
			project_id: eventId,
			id: uuidv4(),
			status: 'Active',
		} as any

		let newTask: any = await addTask(task)
		if (newTask && newTask.task) {
			task = newTask.task
			if (fields.includes('text1')) {
				task = { ...task, text1: '' }
			}
			if (fields.includes('text2')) {
				task = { ...task, text2: '' }
			}
			if (fields.includes('text3')) {
				task = { ...task, text3: '' }
			}
			if (fields.includes('number1')) {
				task = { ...task, number1: 0 }
			}
			if (fields.includes('number2')) {
				task = { ...task, number2: 0 }
			}
			if (fields.includes('number3')) {
				task = { ...task, number3: 0 }
			}

			dispatch({
				type: UsersActionTypes.ADD_DEFAULT_TASK,
				payload: { listId: props.listId, supplier_id: props.id, task }

			});
		}

	};

	const addToBudget = (name: string): void => {
		dispatch({
			type: ExpensesActionTypes.ADD_EXPENSES_TABLE,
			payload: {
				title: 'New Supplier',
				rows: [
					{
						id: uuidv4(),
						color: '',
						'supplier_name': name,
						type: '',
						'service_description': 'Enter description',
						'contact_name': 'Enter contact name...',
						phone: 'Enter phone...',
						email: 'Enter email...',
						status: ''
					} as any
				]
			}
		});
	};

	const deleteRow = async (id: number | string, parent_id?: number) => {
		var task = parent_id && parent_id > 0 ? rows.find((item: any) => item.id === parent_id).child_tasks.find((item: any) => item.id === id) : rows.find((item: any) => item.id === id);
		if (!task) task = rows[id] // id is index
		const newRows = (type === TableType.PLANNING ? allRows : rows).filter((row: any) => row.id !== id);
		const newRowsByIndex = rows.filter((row: any, i: number) => i !== id);

		if (type === TableType.EXPENSES) {
			if (typeof (id) == 'number') await deleteExpense(id)
			dispatch(ExpensesActions.setExpenses(newRows, index, title))
		}
		if (type === TableType.PAYMENTS) {
			if (typeof (id) == 'number') await deletePayments(id)
			dispatch(ExpensesActions.deletePayments(props.index, listId, index))
		}
		if (type === TableType.INCOME) {
			dispatch({
				type: IncomeActionTypes.SET_INCOME,
				payload: {
					rows: newRows,
					title,
					index
				}
			});
		}
		if (type === TableType.SUPPLIERS) {
			dispatch(SuppliersActions.setSuppliers(newRows, props.index, props.title))
			let supplierDeleted = await deleteSupplier(id)
			if( supplierDeleted ) {
				const characters_ids =  task.characters ? task.characters.map((c:any)=> c.id) : [];
				dispatch({
					type: CharactersActionTypes.SET_CHARACTERS,
					payload: characters.map((c: any) => {
						if (!characters_ids.includes(c.character_id) ) return c
						else return { ...c, supplier_id: 0 }
					})
				});
			}
		}
		if (type == TableType.TASK_LIST_VIEW) {
			deleteTask(id)
			dispatch({
				type: UsersActionTypes.DELETE_DEFAULT_TASK,
				payload: {
					id: props.id,
					listId: task.listId,
					taskId: id,
					parent_task_id: task.parent_task_id
				}
			});
		}
		if (type === TableType.UNPLANNED) {
			dispatch(shootingDaysActions.deleteShootingDayParameter(task.shooting_day_index, id, type))
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: task.shooting_day_id, [type]: newRows })
		}
		if (type === TableType.PLANNING) {
			dispatch({
				type: PlanningActionTypes.DELETE_PLANNING_TASK,
				payload: newRows
			});
		}

		if (type === TableType.POST_SHOOTING_DAY_LOCATIONS) {
			dispatch(shootingDaysActions.setPostShootingDayValue(props.index, 'locations', newRowsByIndex));
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, locations: newRowsByIndex })
		}
		if (type === TableType.POST_ROW) {
			//dispatch(shootingDaysActions.setPostShootingDayValue(props.index, 'team_hours', newRowsByIndex));
			//addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, team_hours: newRowsByIndex })
		}
		if (type === TableType.POST_SHOOTING_DAY_SCENES) {
			let updatedShootingDay = {
				project_id: activeEvent.id,
				project_shooting_day_id: props.id,
				shooting_day: {
					...props.sd.shooting_day,
					total_scenes: props.sd.shooting_day.total_scenes.filter(item => item.scene_id !== id),
					scenes: props.sd.shooting_day.scenes.map(scenesArr => scenesArr.filter(scene => scene.scene_id !== id)),
				}
			}
			addShootingDay(updatedShootingDay);
			dispatch({
				type: ShootingDaysActionTypes.DELETE_SHOOTING_DAY_SCENE,
				payload: {
					shootingDayId: props.id,
					sceneId: id
				}
			})
		}
		if (type === TableType.POST_SHOOTING_DAY_ACTORS) {
			deleteCharacter(id, activeEvent.id, 0, 0, 1);
			dispatch({
				type: ShootingDaysActionTypes.REMOVE_SHOOTING_DAY_CHARACTER,
				payload: {
					shootingDayId: props.id,
					characterId: id,
				},
			})
		}
		if (type === TableType.POST_SHOOTING_DAY_EMPLOYEES) {
			let updatedShootingDay = {
				project_id: activeEvent.id,
				project_shooting_day_id: props.id,
				suppliers: props.sd.suppliers.filter(supplierId => supplierId !== id)
			};
			dispatch({
				type: ShootingDaysActionTypes.DELETE_SHOOTING_DAY_SUPPLIRES,
				payload: {
					shootingDayId: props.sd.id,
					supplier_id: id,
				}
			});
			addShootingDay(updatedShootingDay)
		}
		if (type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES) {
			let table = type === TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES ? 'extra_expenses' :
				type === TableType.POST_SHOOTING_DAY_ACTORS ? 'actors' : 'employees'
			dispatch(shootingDaysActions.setPostShootingDayValue(props.index, table, newRowsByIndex))
			addShootingDay({ project_id: activeEvent.id, project_shooting_day_id: props.id, [table]: newRowsByIndex })
		}
	};

	const onStatusChange = (id: string): void => {
		const task = rows.find((item: DefaultTaskInterface) => item.id === id);
		const list = lists.find((list: ListInterface) => {
			if (list.tasks.default.find((item: DefaultTaskInterface) => item.id === task.id)) {
				return true;
			}

			return false;
		});

		if (type == TableType.TASK_LIST_VIEW) {
			addTask({ ...task, status_id: task.status_id == 1 ? 2 : 1 })
			dispatch({
				type: UsersActionTypes.CHANGE_DEFAULT_TASK_STATUS,
				payload: {
					id: props.id,
					listId: list ? list.id : task.listId || '',
					taskId: id
				}
			});
		}

		if (type == TableType.PLANNING) {
			dispatch({
				type: PlanningActionTypes.CHANGE_PLANNING_TASK_STATUS,
				payload: {
					id: props.id,
					taskId: id
				}
			});
		}
	};

	const Header = (!isDone  ?
		<div className={`c-table__header full-width ${headerColor ? headerColor : ''}`}>
			{fields.map((title: any, key: number) => {
				const placeholderZero = title === 'percentage1' || title === 'percentage2' || title === 'percentage3' && isNaN(extraInputs[title])

				return (
				<div
					key={`${isDone ? 'isDone-' : ''}${key}`}
					className={`align-items-center ${title === 'name' ? 'width-18-rem':'width-10-rem'} px-1 d-flex position-relative font-medium-2
			${titlesExtraColumns.includes(title) && (title !== 'percentage1' || title !== 'percentage2') ? 'c-table__cell__options' : ''}
			  ${isTitlePopupOpen == title ? ' popup-open' : ''}`}>
					{titlesExtraColumns.includes(title) ?
						<>
							{title == 'percentage1' || title == 'percentage2' || title == 'percentage3' ? (<div>%</div>) : null}
							<input
								onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
									updateExtraInputs(title, e.target.value)

									if (type === TableType.SCENE_TAKES) {
										props.updateColumnTitleDispatch(title, e.target.value, props.sceneId)
									} else {
										props.updateColumnTitleDispatch(title, e.target.value, listId)
									}
								}}
								type={title == 'percentage1' || title == 'percentage2' || title == 'percentage3' ? "number" : "text"}
								name={title}
								className={classnames("bg-transparent border-0 width-7-rem font-medium-2", {'placeholder-black' : placeholderZero})}
								placeholder={placeholderZero ? 0 : `${formatMessage({ id: 'enter_title' })}...`}
								value={extraInputs[title]}
							/>
						</>
						:

						<FormattedMessage id={title} />}

					<div
						className="arrow-wrapper"
						onClick={(): void => {
							setisTitlePopupOpen(isTitlePopupOpen ? false : title);
						}}
					>
						<span/>
					</div>

					{isTitlePopupOpen == title && (
						<Popup
							isOpen={isTitlePopupOpen}
							onClick={(): void => {
								return;
							}}
							onOutsideClick={(): void => setisTitlePopupOpen(false)}
							options={[
								{
									disabled: false,
									text: formatMessage({ id: 'delete' }),
									action: (): void => {
										if (deleteColumnDispatch) {
											deleteColumnDispatch(title, listId)
										}
										setisTitlePopupOpen(false)
									}
								}
							]}
							className="c-popup--tasks-list-view"
						/>
					)}
				</div>
				)}
			)}
		</div>
		: null)

	const renderIncome = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type}`}>
			<div
				onClick={(): void => {
					setIsPopupOpen(!isPopupOpen);
				}}
				className={`c-table__sidebar${isPopupOpen ? ' popup-open' : ''}${hasRows ? '' : ' no-rows'}`}
			>
				<h3 className="c-table__sidebar-title">{title}</h3>

				<h5 className="c-table__sidebar-data">
					<span className="c-table__sidebar-data-text">income: </span>${totalIncome.toFixed(2)}
				</h5>

				<h5 className="c-table__sidebar-data">
					<span className="c-table__sidebar-data-text">vat: </span>${totalVat.toFixed(2)}
				</h5>

				<h5 className="c-table__sidebar-data">
					<span className="c-table__sidebar-data-text">fees: </span>${totalIncomeFee.toFixed(2)}
				</h5>
			</div>

			<div className="c-table__header">
				{Object.keys(rows[0] || {}).map((title: any, key: number) =>
					['id', 'color', 'type'].includes(title) ? null : (
						<div
							key={key}
							className={`c-table__cell c-table__cell--${title.toLowerCase()} ${title === 'vat' && isVatPopupOpen ? 'popup-open' : ''
								}`}
							onClick={(): void => {
								title === 'vat' ? setIsVatPopupOpen(true) : false;
							}}
						>
							{title === 'fee' ? 'Fee %' : title === 'vat' ? 'VAT' : capitalize(title.replace(/-|_/g, ' '))}

							{title === 'vat' && (
								<Popup
									isOpen={isVatPopupOpen}
									onClick={(): void => {
										return;
									}}
									onOutsideClick={(): void => setIsVatPopupOpen(false)}
								>
									<input
										type="number"
										placeholder="%"
										value={vatValue === 0 ? '' : vatValue}
										onChange={handleVatChange}
									/>
								</Popup>
							)}
						</div>
					)
				)}
			</div>

			<div ref={innerRef} className="c-table__body" {...provided.droppableProps}>
				{rows?.map((data: Income, key: number) => (
					<Draggable index={key} key={key} draggableId={`${data.id}${key}`}>
						{(provided: DraggableProvided): React.ReactElement => (
							<IncomeRow
								data={data}
								color={data.color}
								onDelete={deleteRow}
								onChange={changeValue}
								onAddToBudget={addToBudget}
								provided={provided}
								innerRef={provided.innerRef}
							/>
						)}
					</Draggable>
				))}

				{provided.placeholder}

				<div className="c-table__actions">
					<button className="c-btn-with-text-and-icon" onClick={(): void => onAddIncome()}>
						<SVG src="/assets/images/add_circle-gray.svg" />
						Add Income type
					</button>
				</div>
			</div>
		</div>
	);
	const renderExpenses = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type}`}>
			{/* <div className="font-medium-2 my-1">
			 {totalVat.toFixed(2)}
				<span className="c-table__sidebar-data-text"><FormattedMessage id='cost'/>: </span>${totalExpenses}
			</div> */}
			{Header}
			<div ref={innerRef} className="c-table__body" {...provided.droppableProps}>
				{rows?.map((data: Expense, key: number) => (
					<Draggable index={key} key={key} draggableId={`${data.id}${key}`}>
						{(provided: DraggableProvided): React.ReactElement => (
							<ExpenseRow
								index={index}
								row_index={key}
								data={data}
								color={data.color}
								fields={fields}
								onDelete={deleteRow}
								onKeyPress={onKeyPress}
								onChange={changeValue}
								onBlur={changeValueDB}
								onAddToBudget={addToBudget}
								SupplierWithJob={(supplier_job_title:string)=>SupplierWithJob(supplier_job_title, [...suppliers, ...actors])}
								provided={provided}
								innerRef={provided.innerRef}
								isPricePrimCellVisible={isPricePrimCellVisible}
							/>
						)}
					</Draggable>
				))}

				{provided.placeholder}

				<div className="c-table__actions">
					{AddNewButton(() => onAddExpense(fields))}
					{/* <button className="c-btn-with-text-and-icon" onClick={(): void => onAddExpense(fields)}>
						<SVG src="/assets/images/add_circle-gray.svg" />
						<FormattedMessage id='add_expense'/>
					</button> */}
				</div>
			</div>
		</div>
	);
	const renderSuppliers = (): React.ReactElement => {
		let supplierRows = extraRows ? extraRows : rows
		return (
			<div className={`c-table width-min-content mt-1 c-table--${type}`}>
				{Header}
				<div ref={innerRef} className="c-table__body" {...provided.droppableProps}>
					{supplierRows.map((data: Supplier, key: number) => {
						if (extraRows) { data.id = key }
						return (
							<Draggable index={key} key={`${extraRows ? 'extraRows' : ''}${key}`} draggableId={`${data.id}${key}`}>
								{(provided: DraggableProvided): React.ReactElement => (
									<SupplierRow
										disableDelete={props.disableDelete}
										data={data}
										permissionMod={props.permissionMod}
										color={data.color}
										fields={fields}
										onDelete={deleteRow}
										onKeyPress={onKeyPress}
										onChange={changeValue}
										onBlur={changeValueDB}
										onAddToBudget={addToBudget}
										provided={provided}
										innerRef={provided.innerRef}
									/>
								)}
							</Draggable>
						)
					})}

					{provided.placeholder}

					<div className="c-table__actions">
						{AddNewButton(() => onAddSupplier(fields))}
						{/* <button className="c-btn-with-text-and-icon" onClick={() => onAddSupplier(fields)}>
						<SVG src="/assets/images/add_circle-gray.svg" />
						<FormattedMessage id='add_supplier'/>
					</button> */}
					</div>
				</div>
				{/* <button
							onClick={setSuppliersList}
							className={`c-btn c-btn--rounded c-btn--rounded-centered`}
						>
							Save
		  </button> */}
			</div>
		);
	}
	const renderTeamBudget = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type}`}>
			{Header}
			<div className="c-table__body">
				{rows?.map((data: any, key: number) => (
					<TeamExtraHours
						data={data}
						color={data.color}
						fields={fields}
						titles={titles}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);
	const renderTeamBudgetDaily = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type}`}>
			{Header}
			<div className="c-table__body">
				{rows?.map((data: any, key: number) => (
					<TeamExtraHours
						data={data}
						color={data.color}
						fields={fields}
						titles={titles}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);
	const renderLocations = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type}`}>
			{Header}
			<div className="c-table__body">
				{rows?.map((data: any, key: number) => (
					<LocationRow
						data={data}
						index={key}
						color={data.color}
						fields={fields}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
						disableDelete
					/>
				))}
			</div>
		</div>
	);
	const renderPayments = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1  mb-0 `}>
			{Header}
			<div ref={innerRef} className="c-table__body" {...provided.droppableProps}>
				{rows?.map((data: any, key: number) => (
					<Draggable index={key} key={key} draggableId={`${data.id}${key}`}>
						{(provided: DraggableProvided): React.ReactElement => (
							<PaymentRow
								index={key}
								data={data}
								color={data.color}
								fields={fields}
								onDelete={deleteRow}
								onKeyPress={onKeyPress}
								onChange={changeValue}
								onBlur={changeValueDB}
								onAddToBudget={addToBudget}
								provided={provided}
								innerRef={provided.innerRef}
							/>
						)}
					</Draggable>
				))}

				{provided.placeholder}

				<div className="c-table__actions">
					{AddNewButton(() => onAddPayment())}
					{/* <button className="c-btn-with-text-and-icon" onClick={(): void => onAddPayment()}>
						<SVG src="/assets/images/add_circle-gray.svg" />
							<FormattedMessage id="add_payment"/>
					</button> */}
				</div>
			</div>
		</div>
	);
	const renderPostRow = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows?.map((data: any, key: number) => (
					<PostRow
						key={key}
						index={index}
						data={data}
						color={data.color}
						fields={fields}
						disableDelete={props.disableDelete}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);

	const renderPostShootingDayLocations = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows?.map((data: any, key: number) => (
					<PostLocationRow
						key={key}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						disableDelete={props.disableDelete}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);

	const renderPostShootingDayScenes = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows.map((data: any, key: number) => (
					<PostScenesRow
						activeShootingDayId={props.id}
						key={key}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);

	const renderPostShootingDayActors = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows.map((data: any, key: number) => (
					<PostActorsRow
						key={key}
						sdId={props.id}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);

	const renderPostShootingDayEmployees = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{props.rows.map((data: any, key: number) => (
					<PostEmployeesRow
						key={key}
						sdId={props.id}
						index={key}
						data={data}
						color={data.color && data.color}
						fields={fields}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
				<div className="c-table__actions">
					{AddNewButton(() => onAddSupplier(fields))}
				</div>
			</div>
		</div>
	);

	const renderPostShootingDayExtraExpenses = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows.map((data: any, key: number) => (
					<ExtraExpenseRow
						key={key}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
				<div className="c-table__actions">
					{AddNewButton(() => onAddExtraExpense())}
					{/* <button className="c-btn-with-text-and-icon" onClick={() => onAddExtraExpense()}>
						<SVG src="/assets/images/add_circle-gray.svg" />
						<FormattedMessage id='add_expense'/>
					</button> */}
				</div>
			</div>
		</div>
	);

	const renderCallshetItem = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows.map((data: any, key: number) => (
					<CallsheetItemRow
						key={key}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={props.onDelete}
						onChange={changeValue}
						onBlur={props.onBlur}
					/>
				))}
				<div className="c-table__actions">{AddNewButton(props.onAdd)}</div>
			</div>
		</div>
	);

	const renderSceneTakes = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 `}>
			{Header}
			<div className="c-table__body">
				{rows.map((data: any, key: number) => (
					<SceneTakesRow
						key={key}
						index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={props.onDelete}
						onChange={changeValue}
						onBlur={props.onBlur}
					/>
				))}
				<div className="c-table__actions">{AddNewButton(props.onAdd)}</div>
			</div>
		</div>
	);

	const renderUnplanned = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type} ${isDone ? 'c-table--doneTasks' : ''}`}>
			{Header}
			<div ref={innerRef} className="c-table__body" >
				{rows.map((data: any, key: number) => (
					<UnplannedRow
						key={key}
						row_index={key}
						data={data}
						color={data.color}
						fields={fields}
						onDelete={deleteRow}
						onKeyPress={onKeyPress}
						onChange={changeValue}
						onBlur={changeValueDB}
					/>
				))}
			</div>
		</div>
	);
	const renderTaskViewItems = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type} ${isDone ? 'c-table--doneTasks' : ''}`}>
			{Header}

			<div ref={innerRef} className="c-table__body" {...provided.droppableProps}>
				{rows.map((data: TaskListViewItem, key: number) =>
					<Draggable index={key} key={key} draggableId={`${data.id}${key}`}>
						{(provided: DraggableProvided, snapshot): React.ReactElement =>
							<TaskListViewRow
								fields={fields}
								index={key}
								data={data}
								listIndex={index}
								disableParentDroppable={disableParentDroppable}
								DragSnapshot={snapshot}
								color={data.color}
								listId={listId}
								onKeyPress={onKeyPress}
								onDelete={deleteRow}
								onChange={changeValue}
								onBlur={changeValueDB}
								provided={provided}
								innerRef={provided.innerRef}
								onStatusChange={onStatusChange}
							/>
						}
					</Draggable>
				)}

				{provided.placeholder}

				{!isDone && (
					<div className="c-table__actions">
						{AddNewButton(() => onAddDefaultTask(fields))}
						{/* <button className="c-btn-with-text-and-icon" onClick={() => onAddDefaultTask(fields)}>
							<SVG src="/assets/images/add_circle-gray.svg" />
							<FormattedMessage id='add_task'/>
						</button> */}
					</div>
				)}
			</div>
		</div>
	);
	const renderPlanning = (): React.ReactElement => (
		<div className={`c-table width-min-content mt-1 c-table--${type} ${isDone ? 'c-table--doneTasks' : ''}`}>
			{isEventCreated && (
				<div className="c-table__header c-table__header--planning">
					{!isDone &&
						Object.keys(rows[0] || {}).map((title: any, key: number) =>
							['userId', 'id', 'color', 'status', 'listId'].includes(title) ? null : (
								<div key={key} className={`c-table__cell c-table__cell--${title}`}>
									{title === 'description' ? 'TASK TO DO' : `${capitalize(title.replace(/-|_/g, ' '))}`}
								</div>
							)
						)}
				</div>
			)}

			{isEventCreated &&
				rows.map((data: TaskPlanning, key: number) => (
					<Droppable droppableId={`${key}`} direction="vertical" key={key}>
						{(subProvider: any, snapshot): React.ReactElement => (
							<>
								<Draggable index={key} key={key} draggableId={`${data.id}${key}`} isDragDisabled={isDone}>
									{(provided: DraggableProvided, snapshot): React.ReactElement => (
										<PlanningRow
											data={data}
											color={data.color}
											onDelete={deleteRow}
											onChange={changeValue}
											onKeyPress={onKeyPress}
											provided={provided}
											innerRef={provided.innerRef}
											description={data.description}
											owner={data.owner}
											onStatusChange={onStatusChange}
										/>
									)}
								</Draggable>

								{subProvider.placeholder}
							</>
						)}
					</Droppable>
				))}


			{provided.placeholder}

			{!isDone && (
				<div className={`c-table__actions${!isEventCreated ? ' inactive' : ''}`}>
					<button className="c-btn-with-text-and-icon" onClick={(): void => onAddPlanningTask()}
					// style={{"&::before": { backgroundColor: data[0].color}}}
					>
						<SVG src="/assets/images/add_circle-gray.svg" />
						<FormattedMessage id='add_task' />
					</button>
				</div>
			)}
		</div>
	);

	switch (type) {
		case TableType.EXPENSES:
			return renderExpenses();
		case TableType.INCOME:
			return renderIncome();
		case TableType.SUPPLIERS :
			return renderSuppliers();
		case TableType.CHARACTER :
			return renderSuppliers();
		case TableType.CALCULATOR:
			return renderTeamBudget();
		case TableType.BUDGET_DAILY:
			return renderTeamBudgetDaily();
		case TableType.UNPLANNED:
			return renderUnplanned();
		case TableType.PLANNING:
			return renderPlanning();
		case TableType.PAYMENTS:
			return renderPayments();
		case TableType.LOCATIONS:
			return renderLocations();
		case TableType.POST_ROW:
			return renderPostRow();
		case TableType.POST_SHOOTING_DAY_LOCATIONS:
			return renderPostShootingDayLocations();
		case TableType.POST_SHOOTING_DAY_SCENES:
			return renderPostShootingDayScenes();
		case TableType.POST_SHOOTING_DAY_ACTORS:
			return renderPostShootingDayActors();
		case TableType.POST_SHOOTING_DAY_EMPLOYEES:
			return renderPostShootingDayEmployees();
		case TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES:
			return renderPostShootingDayExtraExpenses();
		case TableType.CALLSHEET_ITEM:
			return renderCallshetItem();
		case TableType.SCENE_TAKES:
			return renderSceneTakes();
		default:
			return renderTaskViewItems();
	}
};

const reorderRows = (rows: any, startIndex: any, endIndex: any): any => {
	let reordered = [...rows];
	const [removed] = reordered.splice(startIndex, 1);
	reordered.splice(endIndex, 0, removed);
	reordered.forEach((row, index) => row.pos = index + 1)
	return reordered;
};

export default (props: Omit<Props, 'provided' | 'innerRef' | 'lists'>): React.ReactElement => {
	const dispatch = useDispatch();
	const { type } = props
	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	const user = useSelector((state: RootStore) =>
		state.users.length ? state.users.find((user: UserInterface) => user.active) : undefined
	);

	const onDragEnd = (result: DropResult): void => {
		if (!user) {
			return;
		}

		const { lists, id } = user;
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const rows =
			type === TableType.PLANNING
				? reorderRows(props.allRows, source.index, destination.index)
				: reorderRows(props.rows, source.index, destination.index);

		if (type === TableType.INCOME) {
			dispatch({
				type: IncomeActionTypes.SET_INCOME,
				payload: {
					index: props.index,
					title: props.title,
					rows
				}
			});
		}

		if (type === TableType.EXPENSES) {
			setExpensesList(rows)
			dispatch(ExpensesActions.setExpenses(rows, props.index, props.title))
		}

		if (type === TableType.SUPPLIERS) {
			setSuppliersList(rows)
			dispatch(SuppliersActions.setSuppliers(rows, props.index, props.title))
		}

		if (type === TableType.PLANNING) {
			dispatch({
				type: PlanningActionTypes.SET_PLANNING,
				payload: rows
			});
		}


	};
	if (type == TableType.POST_ROW || type == TableType.CALLSHEET_ITEM || type == TableType.SCENE_TAKES) {
		return (<Table {...props}></Table>)
	}

	else if ((type === TableType.TASK_LIST_VIEW || type == TableType.EXPENSES) &&
		props.provided && props.innerRef) {
		return (
			<Table
				{...props}
				lists={user?.lists || []}
				provided={props.provided}
				innerRef={props.innerRef}
			></Table>
		);
	}
	else {
		return (
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId={String(props.id)}>
					{(provided: DroppableProvided): React.ReactElement => (
						<Table
							{...props}
							lists={user?.lists || []}
							provided={provided}
							innerRef={provided.innerRef}
						></Table>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
};
