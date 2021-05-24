import { ExpensesActionTypes } from '@containers/budget/enums';
import { ExpenseGroup } from '@containers/budget/interfaces';

export const setExpenseTable = (expenses: any) => {
  return (dispatch: any) => {
    dispatch({
      type: ExpensesActionTypes.SET_EXPENSES_TABLE,
      payload: expenses
    });
  }
}


export const setExpenses = (rows: any, index: number, title?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: ExpensesActionTypes.SET_EXPENSES,
      payload: {
        rows,
        title,
        index
      }
    });
  }
}

export const setExpenseTitle = (category_id: number, key: string, value: any) => {
  return (dispatch: any) => {
    dispatch({
      type: ExpensesActionTypes.SET_EXPENSE_TITLE,
      payload: {category_id, key, value}
    })
  }
}

export const setPayments = (list_index: number,  budget_index:number, value: any, field?: string, type_index?:number, ) => {
  return (dispatch: any) => {
    dispatch({
      type: ExpensesActionTypes.SET_PAYMENTS,
      payload: {
        value,
        list_index,
        budget_index,
        type_index,
        field
      }
    });
  }
}

export const deletePayments = (index: number, budget_index:number ,row_index:number) => {
  return (dispatch: any) => {
    dispatch({
      type: ExpensesActionTypes.DELETE_PAYMENTS,
      payload: {
        budget_index,
        row_index,
        index
      }
    });
  }
}




