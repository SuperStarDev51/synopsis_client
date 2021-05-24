import { IncomeActionTypes, ExpensesActionTypes } from './enums';
import { incomeInitialState, expensesInitialState } from './initial-state';
import { IncomeAction, ExpenseGroup, ExpensesAction, IncomeGroup, Expense } from './interfaces';
import { update } from 'offline-plugin/runtime';

export const expensesReducer = (state = expensesInitialState, { type, payload }: ExpensesAction): ExpenseGroup[] => {
	const copy = [...state];

	switch (type) {

		case ExpensesActionTypes.SET_EXPENSES_TABLE:
			return payload;

		case ExpensesActionTypes.DELETE_CATEGORY_COLUMN:
				return state.map((item: any) => {
						const { category_id, key } = payload
						const newExpense = (expense: any) => {
							var newExpense:any = {}
							Object.keys(expense).map((field: string, index: number) => {
								if( field == key ){
									return
								}
								newExpense[field] = expense[field]
							})
							return newExpense
						}
						if (item.id !== category_id) return item;
						else return {
									...item,
									budgets:{
										...item.budgets,
										default: item.budgets.default.map((expense: any)=> {return newExpense(expense)})
									}
					};
				})

		case ExpensesActionTypes.SET_EXPENSE_TITLE:
							const newBudgetTitle = (budget_title: any, key: string, value: any) => {
								let newBudgetTitle:any = budget_title
								newBudgetTitle[key] = value
								return newBudgetTitle
							}
							return state.map((list: any) => {
								const { category_id, key, value } = payload
								if (list.id !== category_id) {
									return list;
								}
								return {
									...list,
									budget_title: newBudgetTitle(list.budget_title, key, value)
								};
							});

		case ExpensesActionTypes.REMOVE_EXPENSE_LIST:
					return state.filter((list: any) => list.id !== payload.category_id)

		case ExpensesActionTypes.ADD_EXPENSE_LIST:
			return [...state, payload]

		case ExpensesActionTypes.UPDATE_EXPENSE_LIST:
			return copy.map(item => item.id === payload.id ? {...item, budget_category: payload.budget_category } : item);

		case ExpensesActionTypes.SET_EXPENSES:
			// eslint-disable-next-line
			const { index, title, rows } = payload;

			copy[index] = {
				...copy[index],
				budget_category: title ? title : copy[index].budget_category,
				budgets: {
					...copy[index].budgets,
					default: rows
				}
			};
			return copy


		case ExpensesActionTypes.SET_PAYMENTS:
				const { list_index, budget_index, field, value,row_index,  type_index } = payload
				var newCopy = copy
				if( field ) {
					newCopy[list_index].budgets.default[budget_index].payments[type_index][field] = value;
				}   else newCopy[list_index].budgets.default[budget_index].payments = value
			 return newCopy

		case ExpensesActionTypes.DELETE_PAYMENTS:
				copy[payload.index] = {
					...copy[payload.index],
					budgets: {
						...copy[payload.index].budgets,
						default: copy[payload.index].budgets.default.map((r:any, ri:number)=> {
							if( ri !== payload.budget_index ) return {...r}
							return {
								...r,
								payments: r.payments.filter((r:any,ri:number) => ri !== payload.row_index)
							}
						})
					}
				};
				return copy

		case ExpensesActionTypes.ADD_EXPENSES_TABLE:
			copy.unshift(payload);
			return copy;

		case ExpensesActionTypes.ADD_ROW_TO_EXPENSE_TABLE:
			return copy.map((table: ExpenseGroup) => ({
				...table,
				budgets:{
					...table.budgets,
					default: [
					...table.budgets.default,
					...payload.filter((row: Expense) => row.type.toLowerCase() === table.budget_title.toLowerCase())
					]
				}
			}));

		default:
			return state;
	}
};

export const incomeReducer = (state = incomeInitialState, { type, payload }: IncomeAction): IncomeGroup[] => {
	const copy = [...state];

	switch (type) {
		case IncomeActionTypes.SET_INCOME:
			const { index, title, rows } = payload;
			copy[index] = {
				title,
				rows
			};

			return copy;

		default:
			return state;
	}
};
