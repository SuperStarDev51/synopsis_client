import { ExpensesActionTypes, IncomeActionTypes } from './enums';
import { read } from 'fs';
import { Attachment } from '@src/components/attachments/interfaces';

export interface ExpensesAction {
	type: ExpensesActionTypes;
	payload: any;
}

export interface IncomeAction {
	type: IncomeActionTypes;
	payload: any;
}

export interface Income {
	readonly id: string;
	readonly color: string;
	readonly 'income-type': string | string;
	readonly price: number | string;
	readonly vat: number | string;
	readonly fee: number | string;
	income: number | string;
	'total-income': number;
	'amount-sold': number | string;
	'supplier_name': string;
}

export interface Expense {
	readonly id: any;
	readonly account_id: number;
	readonly pos: number;
	readonly listId: number;
	readonly color: string;
	readonly type: string;
	readonly supplier_job_title: string;
	readonly type_id: number;
	readonly 'expense-description': string;
	payments: any[];
	readonly price: number | string;
	readonly quantity: number;
	readonly total: number;
	readonly 'supplier_name': string;
	readonly status: string;
	readonly status_id: number;
	readonly comments: string;
	readonly attachments: Attachment[];
	readonly project_id: number;
}


// export interface Expense {
	// readonly id: any;
	// readonly pos: number;
	// readonly listId: number;
	// readonly status: string;
	// readonly status_id: number;
	// 	 readonly account_id: number;
	// 	readonly description: string;
	// 	readonly name: string;
	// 	readonly cost: number;
	// 	readonly quantity: number;
	// 	readonly total: number;
	// 	readonly paid: any[];
	// readonly comments: string;

// }
export interface ExpenseGroup {
	id: any;
	budget_category: string;
	budget_title: any;
	budgets: {
		canban: any[];
		default: Expense[];
	};
	color:string;
	createdAt: string;
	deletedAt: string;
	updatedAt: string;
	project_id: number
}

export interface IncomeGroup {
	readonly title: string;
	readonly rows: Income[];
}
