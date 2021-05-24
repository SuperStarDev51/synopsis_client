import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ExpensesActionTypes } from '@containers/budget/enums';
import { Divider } from '@material-ui/core'
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";
import classnames from 'classnames'
import { RootStore } from '@src/store';
import {  Table, TableType, ListView } from '@components';
import { Expense, ExpenseGroup, IncomeGroup } from './interfaces';
import { Options } from '@containers/options'
import { setExpensesList, deleteExpenseCategory, addExpenseTitle, addExpenseCategory } from './initial-state'
import { sortRows } from '@utilities'
import * as ExpensesActions from "../../redux/actions/budget/expenses"
import { addSupplierTitle } from '@containers/suppliers/initial-state'
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { DailyBudget } from '@containers/budget/daily-budget/DailyBudget';

import * as moment from 'moment';

import {TabContent, TabPane, Button, Nav, Card, CardBody, NavItem, NavLink, Row, Col} from "reactstrap"
import {
	Droppable,
	DropResult,
	DragDropContext,
	DraggableLocation,
	DroppableProvided,
} from 'react-beautiful-dnd';
import { Event } from '@containers/planning/interfaces';
import { FormattedMessage, useIntl } from "react-intl"
import {ShootingDay} from "@root/src/containers/shooting_days/interfaces";


export const Budget: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const history = useHistory();
	const [render, setRender] = React.useState(false);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])
	const [additionalExpenses, setAdditionalExpenses] = React.useState([]);
	const [unplannedFields, setUnplannedFields] = React.useState(['description', 'price', 'quantity', 'total', 'comments']);
	// const [TeamExtraHroursFields, setTeamExtraHroursFields] = React.useState<any>(['supplier_name','supplier_job_title', 'supplier_unit_cost', 'supplier_unit_type', 'percentage1', 'percentage2', 'budget_comments']);
	const [TeamExtraHroursFields, setTeamExtraHroursFields] = React.useState<any>(['supplier_name', 'supplier_job_title', 'supplier_unit_cost', 'supplier_unit_type', 'percentage1', 'percentage2', 'number_of_working_days', 'total']);
	const [TeamExtraHroursFieldsActors, setTeamExtraHroursFieldsActors] = React.useState<any>(['supplier_name', 'characters', 'supplier_job_title', 'supplier_unit_cost', 'supplier_unit_type', 'percentage1', 'percentage2', 'number_of_working_days', 'total']);

	const state = useSelector((state: RootStore) => state);
	// const navItems = ['budget', 'unplanned', 'payments','team_extra_hours']
	const navItems = ['HR', 'daily'];
	let URL = window.location.pathname
	// let activePage:number = Number(URL.split('/budget/')[1])
	const [active, setActive] =  React.useState<number>(0);
	// React.useEffect(()=>{ if( activeEvent ) history.push('/'+activeEvent.id+'/budget/'+active)},[activeEvent, active])
	const income = useSelector((state: RootStore) => state.income);
	const expenses = useSelector((state: RootStore) => state.expenses);
	const calculatedExpenses = (index:number) => expenses && expenses[index] ? expenses[index].budgets.default.reduce((sub: number, subrow: Expense) => {
			let total = Number(subrow.quantity) > 0 ? (Number(subrow.price) * Number(subrow.quantity)) : Number(subrow.price)
			return sub + (total);
		}, 0): 0;
	const calculatedTotal = (rows:any, element: string) => rows && rows.length ? rows.reduce((sub: number, subrow: any) => {
			let total = Number(subrow.quantity) > 0 ? (Number(subrow[element]) * Number(subrow.quantity)) : Number(subrow[element])
			return sub + (total);
		}, 0): 0;

	const calculatedPayed = (index:number) => expenses && expenses[index] && expenses[index] ?  expenses[index].budgets.default.reduce((acc: number, expense: Expense) => {
			var subTotal = 0
				const subTotalPayments = expense.payments ? expense.payments.reduce((sub: number, subrow: any) => {
					return  subrow.amount_paid  ? sub + Number(subrow.amount_paid) : sub;
				}, 0) : 0
				subTotal += subTotalPayments
			return acc + subTotal;
	}, 0): 0;

	const suppliers = useSelector((state: RootStore) => state.suppliers )
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const sdActive = shootingDays.findIndex((sd: ShootingDay) => sd.preview);
	const reorderRows = (rows: any, startIndex: any, endIndex: any, source_list_index: number): any => {
		let reordered = [...rows];
		const [removed] = reordered.splice(startIndex, 1);
		reordered.splice(endIndex, 0, removed);
		reordered.forEach((row, index) =>  row.pos = index+1)
		dispatch(ExpensesActions.setExpenses(reordered,source_list_index))
		return [...rows];

	};

	React.useEffect(()=>{
		setRender(true)
	},[suppliers])

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

		if (!sourceList || !sourceList.length || !destinationList  ) {
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
		var lists = expenses
		const newLists = lists.map((list: any) => {
			if (list.id === source_list_id) {
				return {
					...list,
					budgets: {
						...list.tasks,
						default: sourceCards
					}
				};
			}

			if (list.id === destination_list_id) {
				return {
					...list,
					budgets: {
						...list.tasks,
						default: destinationCards
					}
				};
			}
			return list;
		});

		dispatch(ExpensesActions.setExpenseTable(newLists))

		return [...sourceCards, ...destinationCards]
	};

	const onDragEnd = (result: DropResult): void => { //budget

		const { source, destination } = result;
		if (!destination) {
			return;
		}
		var lists = expenses
		let source_list_id = Number(source.droppableId.split('-')[0])
		let source_list_index = Number(source.droppableId.split('-')[1])
		let destination_list_id = Number(destination.droppableId.split('-')[0])
		let destination_list_index = Number(destination.droppableId.split('-')[1])
		let sourceList = lists[source_list_index].budgets.default
		let destinationList = lists[destination_list_index].budgets.default

		const rows =
		source_list_index === destination_list_index
			? reorderRows(sourceList, destination.index, source.index, source_list_index)
		     :reorderRowsInDifferentLists(destination,source, sourceList, destinationList,source_list_id, destination_list_id);
			 if( rows && rows.length ) setExpensesList(rows);
	};


	// React.useEffect(()=>{
	// 	let rows:any = []
	// 	shootingDays.forEach((sd: any, sdi: number) => {
	// 		if( sd.additional_expenses.length ) rows = [...rows, ...sd.additional_expenses]
	// 	})
	// 	setAdditionalExpenses(rows)
	// },[shootingDays])




	const addNewCategory = async () => {
		let category: ExpenseGroup = {
			id: uuidv4(),
			budget_category: formatMessage({id: 'new_list'}),
			budgets: {
				canban: [],
				default: []
			}
		}
		let newExpenseCategory:any = await addExpenseCategory(category.budget_category, category.color, activeEvent.id, null)
		if ( newExpenseCategory && newExpenseCategory.budget_category) {
			newExpenseCategory.budget_category.budgets = {
				canban: [],
				default: []
			}
			dispatch({
				type: ExpensesActionTypes.ADD_EXPENSE_LIST,
				payload: newExpenseCategory.budget_category
			});
		}
	}


	return (
		<div>
	<Row>
		<Nav pills className="floating-btns">
		  {navItems.map((item: any, index:number)=> (
			  <NavItem key={index}>
			  <NavLink
			  className={classnames('text-capitalize', {
				  active: active == index
			  })}
			   onClick={() => {setActive(index)}}>
			   <FormattedMessage id={item} />
			   </NavLink>
			 </NavItem>
		  ))}
		  </Nav>
	  </Row>


	  <div>
	 	 <TabContent activeTab={active}>
			{navItems.map((item:any ,index:number)=> (
			<TabPane tabId={index}>
			<div className="mr-2">
			{active == index && (
				navItems[active] == 'budget' ?
				<DragDropContext onDragEnd={onDragEnd}>
				{expenses.length ?
				<>
				<div className="d-flex">
					<div className="mt-1 ml-2 h1 text-bold-600 text-capitalize"><FormattedMessage id={navItems[active]}/></div>
					<div className="mt-1 ml-1 d-flex align-items-center">
						{expenses.map((data: ExpenseGroup, index: number) => (
							<>
							 <Divider  orientation="vertical" className="ml-3"/>
								<div className="ml-3 d-flex-column">
									<div className="h4 mb-1" style={{color: data.color}}><div className="text-bold-600">{data.budget_category}</div></div>
									<div className="d-flex h6"><FormattedMessage id="total"/>- <div className="ml-05 text-bold-600">{calculatedExpenses(index)}</div></div>
									<div className="d-flex h6"><FormattedMessage id="paid"/>- <div className="ml-05 text-bold-600">{calculatedPayed(index)}</div></div>
									<div className="d-flex h6"><FormattedMessage id="to_pay"/>- <div className="ml-05 text-bold-600">{Number(calculatedExpenses(index)) - Number(calculatedPayed(index))}</div></div>
								</div>
							</>
						))}
					</div>
				</div>
					{expenses.map((data: ExpenseGroup, index: number) => (
							<ExpenseList addNewCategory={addNewCategory} data={data} index={index}/>
					))}
				</>
					:
					<button
					className="c-btn c-btn--rounded c-btn--rounded-centered"
					 onClick={addNewCategory}><FormattedMessage id='start_your_budet'/>...</button>
				}
				</DragDropContext>
					:
				navItems[active] == 'income' ?
					income.map((tableData: IncomeGroup, index: any) => (
						<Table
							id={`income-table-${index}}`}
							type={TableType.INCOME}
							rows={[]}
							index={index}
							title={tableData.title}
						/>
					))
					:
					navItems[active] == 'payments' ?
					<>
					<div className="d-flex">
					<div className="mt-1 ml-2 h1 text-bold-600 text-capitalize"><FormattedMessage id={navItems[active]}/></div>
					<div className="mt-1 ml-1 d-flex align-items-center">
						{expenses.length ?
						expenses.map((ExpenseGroup: ExpenseGroup, index: number) => (
							ExpenseGroup.budgets.default.map((expense: Expense, expense_row: number) =>  expense.payments && expense.payments.length ? (
							<>
							 <Divider  orientation="vertical" key={expense_row} className="ml-3"/>
								<div className="ml-3 d-flex-column">
									<div className="h4 mb-1" style={{color: ExpenseGroup.color}}><div className="text-bold-600">{expense.supplier_name ? expense.supplier_name +' - '+ formatMessage({id:'payments'}) : formatMessage({id:'payments'})}</div></div>
									<div className="d-flex h6"><FormattedMessage id="total"/>- <div className="ml-05 text-bold-600">{calculatedTotal(expense.payments, 'amount_paid')}</div></div>
								</div>
							</>
						):null))):null}
					</div>
					</div>
					<div>
					{expenses.length ?
						expenses.map((ExpenseGroup: ExpenseGroup, index: number) => (
							ExpenseGroup.budgets.default.map((expense: Expense, expense_row: number) =>  expense.payments && expense.payments.length ? (
								<ListView
										fields={['accounting_id','description', 'paid_to', 'tax_id', 'date', 'amount_paid', 'comments']}
										setFields={(v)=>{}}
										type={TableType.PAYMENTS}
										id={expense.id}
										index={index}
										list={{id:expense_row}}
										category={expense.supplier_name ? expense.supplier_name +' - '+ formatMessage({id:'payments'}) : formatMessage({id:'payments'})}
										rows={expense.payments}
						/>
						):null)
						))
						:null}
					</div>
					</>
					:
					navItems[active] == 'HR' ?
					<>
					<div className="d-flex">
						<div className="mt-1 ml-2 h1 text-bold-600 text-capitalize">
							<FormattedMessage id={navItems[active]}/>
						</div>
						{/* <div className="mt-1 ml-1 d-flex align-items-center">
							{suppliers.map((data: any, index: number) => (
								<>
								 <Divider  orientation="vertical" key={index} className="ml-3"/>
									<div className="ml-3 d-flex-column">
										<div className="h4 mb-1" style={{color: data.color}}><div className="text-bold-600">{data.supplier_category}</div></div>
										<div className="d-flex h6"><FormattedMessage id="total"/>- <div className="ml-05 text-bold-600">{calculatedTotal(data.suppliers, 'price')}</div></div>
									</div>
								</>
							))}
						</div> */}
					</div>

					{suppliers.map((data: any, index: number) => {
						return (
							<ListView
							   fields={data.supplier_category === 'Actors' ? TeamExtraHroursFieldsActors : TeamExtraHroursFields}
							   setFields={data.supplier_category === 'Actors' ? setTeamExtraHroursFieldsActors : setTeamExtraHroursFields}
							   id={data.id}
							   type={TableType.CALCULATOR}
							   index={index}
							   list={data}
							   category={data.supplier_category}
							   rows={data.suppliers.default}
							   titles={data.supplier_title}
							   updateColumnTitleDispatch={(key: string, value: any, category_id: number) => {
									addSupplierTitle({company_id: activeEvent.company_id, project_id: activeEvent.id, category_id, key, value})
									dispatch({
										type: SuppliersActionTypes.SET_SUPPLIER_TITLE,
										payload: {key, value, category_id}
									})
								}}
							/>
					)})}
					</>
					:
					navItems[active] == 'daily' ?
					<DailyBudget
						sdActive={sdActive}
						shootingDays={shootingDays}
						suppliers={suppliers}
					/>
					:
					navItems[active] == 'unplanned' ?
					<>
					<div className="d-flex">
					<div className="mt-1 ml-2 h1 text-bold-600 text-capitalize"><FormattedMessage id={navItems[active]}/></div>
					<div className="mt-1 ml-1 d-flex align-items-center">
						{shootingDays && shootingDays.length ?
						shootingDays.map((sd: any, sdi: number) => sd.additional_expenses && sd.additional_expenses.length ? (
							<>
							 <Divider  orientation="vertical" key={sdi} className="ml-3"/>
								<div className="ml-3 d-flex-column">
									<div className="h4 mb-1" style={{color: sd.color}}><div className="text-bold-600">{sd.date ? moment(new Date(sd.date)).format('DD/MM/YYYY') : formatMessage({id: 'no_date'})}</div></div>
									<div className="d-flex h6"><FormattedMessage id="total"/>- <div className="ml-05 text-bold-600">{calculatedTotal(sd.additional_expenses, 'price')}</div></div>
								</div>
							</>
						):null):null}
					</div>
					</div>
						{shootingDays && shootingDays.length ?
						shootingDays.map((sd: any, sdi: number) => sd.additional_expenses && sd.additional_expenses.length ?
							<div key={sdi} className="c-table__body">
									<ListView
										page={navItems[active]}
										// isDone={Boolean(new Date(sd.date) < new Date())}
										fields={unplannedFields}
										setFields={setUnplannedFields}
										type={TableType.UNPLANNED}
										id={sd.id}
										index={sdi}
										list={sd}
										number={sdi}
										category={sd.date ? new Date(sd.date) : formatMessage({id: 'no_date'})}
										rows={sd.additional_expenses.map((ad:any)=> { return {...ad, shooting_day_index: sdi, shooting_day_id: sd.id}})}
									/>
							</div>
					:<></>)
					:null}
					</>
				: null
				)}
			</div>
			</TabPane>
			))}
	</TabContent>
	</div>
	</div>
	);
};

export default Budget;

interface Props {
	readonly data: any;
	readonly index: number;
	readonly addNewCategory: () => void;
}

export const ExpenseList: React.FC<Props> = (props: Props) => {
	const {data, index, addNewCategory} = props;
	const dispatch = useDispatch();
	const expenses = useSelector((state: RootStore) => state.expenses);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0]);
	const [fields, setFields] = React.useState<any>(['account_id','supplier_job_title','supplier_name', 'price', 'quantity', 'total', 'payments', 'comments']);

	const handleSidebarTitleChange = async (event, color, project_id, budget_category_id ): void => {
		let newExpenseCategory:any = await addExpenseCategory(event.target.value, color, project_id, budget_category_id);
		if ( newExpenseCategory && newExpenseCategory.budget_category) {
			dispatch({
				type: ExpensesActionTypes.UPDATE_EXPENSE_LIST,
				payload: {
					id: budget_category_id,
					budget_category: event.target.value,
				}
			});
		}
	};

	return(
	<Droppable droppableId={`${data.id}-${index}`} direction="vertical"  key={data.id}>
	{(provided: DroppableProvided): React.ReactElement => (
		<div ref={provided.innerRef} style={{width: 'fit-content'}} {...provided.droppableProps}>
						 <ListView
						 	options
							fields={fields}
							setFields={setFields}
							id={`expenses-table-${index}`}
							type={TableType.EXPENSES}
							index={index}
							addNewCategory={addNewCategory}
							handleSidebarTitleChange={() => {
								handleSidebarTitleChange(event, data.color, activeEvent.id, data.id)
							}}
							deleteCategory={(listId:number)=>{
								deleteExpenseCategory(listId)
								dispatch({
									type: ExpensesActionTypes.REMOVE_EXPENSE_LIST,
									payload: {category_id: listId}
								});
							}}
							addColumnDispatch={(key: string, value: any, category_id: number)=>{
								let titleName= `New ${key.replace(/[0-9]/g, '')} column`
								addExpenseTitle({project_id: activeEvent.id, category_id ,key, value: titleName})
								dispatch(ExpensesActions.setExpenseTitle(category_id, key, titleName))
								let newRows = expenses.map((list: any) => {
									return {
										...list,
									budgets: {
										...list.budgets,
										default: list.budgets.default.map((task: any) => {
											return {
												...task,
												[key]: value
											};
										})
									}
								};
								})
								dispatch(ExpensesActions.setExpenses(newRows, category_id))
							}}
							updateColumnTitleDispatch={(key: string, value: any, category_id: number)=>{
								addExpenseTitle({project_id: activeEvent.id, category_id: category_id, key, value:value})
								dispatch(ExpensesActions.setExpenseTitle(category_id, key, value))
							}}
							deleteColumnDispatch={(key: string, category_id: number)=>{
								addExpenseTitle({project_id: activeEvent.id, category_id, key, value:null})
								setFields(fields.map((field: string, index: number) => {
														if(field == key) { return }
														return field
										   }).filter(e=>e)
								)
								dispatch({
									type: ExpensesActionTypes.DELETE_CATEGORY_COLUMN,
									payload: {category_id, key}
								})
								dispatch(ExpensesActions.setExpenseTitle(category_id, key, undefined))
							}}
							list={data}
							category={data.budget_category}
							rows={data.budgets.default}
							provided={provided}
							innerRef={provided.innerRef}
							titles={data.budget_category}
							/>
</div>

		)}
		</Droppable>
	)
}
