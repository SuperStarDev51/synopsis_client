import axios from 'axios';
import { ExpenseGroup, IncomeGroup } from './interfaces';
import { config } from '../../config';



export const setExpenseList = (expenses: any) => new Promise((resolve,reject) =>{
	var newRows: any= []
	expenses.forEach((expense: any) => { 
		let newExpense = {
			budget_id: expense.id,
			project_id: expense.project_id,
			price: expense.price,
			budget_type_id: expense.budget_type_id,
			budget_status_id: expense.budget_status_id,
			supplier_id: expense.supplier_id,
			description: expense['expense-description'],
			comments: expense.comments,
			attachments: expense.attachments,
			text1: expense.text1,
			text2: expense.tex2,
			text3: expense.tex3,
			number1: expense.number1,
			number2: expense.number2,
			number3: expense.number3
		}
		newRows.push(newExpense)
	});
	axios.post(config.ipServer+'/imgn/api/v1/budgets/add', newRows)
	  .then(response => {
		let data = response.data
		if (response.status !== 200) {
			throw new Error(response.statusText)
		}
		resolve(data)
	  })
	  .catch(error => {	reject('err') });
  })
  

  export const addExpenseTitle = (expense_title: any) => new Promise((resolve,reject) =>{
	const { project_id, category_id, key, value } = expense_title
   axios.post(config.ipServer+'/imgn/api/v1/budget/title/add',  {
	   project_id,
	   category_id,
	   [key]: value
   })
  .then((res:any) => {
			resolve(res.data) 
	})
})



export const getExpenseList = (project_id: number) => new Promise((resolve,reject) =>{
	axios.get(`${config.ipServer}/imgn/api/v1/budget/project/get/${project_id}`)
	  .then(response => {
		let data = response.data
		if (response.status !== 200) {
			throw new Error(response.statusText)
		}
		resolve(data)
	  })
	  .catch(error => {	reject('err') });
  })

  export const setExpensesList = (expenses: any) => new Promise((resolve,reject) =>{
	var newExpenses: any= []
	expenses.forEach((expense: any) => { 
		newExpenses.push({
			budget_id: typeof(expense.id) == 'string' ? null : expense.id,
			pos: expense.pos,
			project_id: expense.project_id,
			price: expense.price,
			budget_category_id: expense.listId,
			budget_type_id:  expense.budget_type_id > 0 ? expense.budget_type_id : null, 
			budget_status_id: expense.budget_status_id > 0 ? expense.budget_status_id : null,
			description: expense['expense-description'],
			supplier_id: expense.supplier_id > 0 ? expense.supplier_id: null, 
			comments: expense.comments,
			attachments: expense.attachments,
			text1: expense.text1,
			text2: expense.text2,
			text3: expense.text3,
			number1: expense.number1,
			number2: expense.number2,
			number3: expense.number3
	})
	});
	axios.post(config.ipServer+'/imgn/api/v1/budgets/add', newExpenses)
	  .then(response => {
		let data = response.data
		if (response.status !== 200) {
			throw new Error(response.statusText)
		}
		resolve(data)
	  })
	  .catch(error => {	reject('err') });
  })


	export const deleteExpense = (budget_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/budget/delete', { data: { budget_id }})
   .then(function (res: any) {
		resolve(res.data)
   })
 	})


 export const addExpenseCategory = (budget_category: string, color: string, project_id: number, budget_category_id:number|null ) => new Promise((resolve,reject) =>{
	let category = {
		budget_category_id: typeof(budget_category_id) == 'string' ? null : budget_category_id, // (if update)
		budget_category,
		project_id,
    	color
	}
	axios.post(config.ipServer+'/imgn/api/v1/budget/category/add', category)
   .then(function (res: any) {
	 resolve(res.data) 
   })
 })
 
 export const deleteExpenseCategory = (budget_category_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/budget/category/delete', {data: {budget_category_id}})
   .then((res:any) => {
			 resolve(res.data) 
     })
 })
 
export const addExpense = (expense: any) => new Promise((resolve,reject) =>{
	axios.post(config.ipServer+'/imgn/api/v1/budget/add', {
		budget_id: typeof(expense.id) == 'string' ? null : expense.id,
		pos: expense.pos,
		project_id: expense.project_id,
		account_id: expense.account_id,
		price: expense.price,
		quantity: expense.quantity,
		budget_category_id: expense.listId,
		// budget_type_id:  expense.budget_type_id > 0 ? expense.budget_type_id : undefined, 
		// budget_status_id: expense.budget_status_id > 0 ? expense.budget_status_id : undefined,
		description: expense['expense-description'],
		supplier_name: expense.supplier_name, 
		supplier_id: expense.supplier_id, 
		supplier_job_title_id: expense.supplier_job_title_id,
		comments: expense.comments,
		attachments: expense.attachments,
		payments: expense.payments,
		text1: expense.text1,
		text2: expense.text2,
		text3: expense.text3,
		number1: expense.number1,
		number2: expense.number2,
		number3: expense.number3
})
   .then(function (res: any) {
	  resolve(res.data)
   })
 })


 export const addExpenseType = (budget_type: any, budget_type_id: any) => new Promise((resolve,reject) =>{	
	axios.post(config.ipServer+'/imgn/api/v1/budget/type/add', {
		budget_type_id,
		budget_type,
	})
	.then(function (res: any) {
	  resolve(res.data)
	})
  })

export const addExpenseStatus = (budget_status: any, budget_status_id: any) => new Promise((resolve,reject) =>{	
	axios.post(config.ipServer+'/imgn/api/v1/budget/status/add', {
		budget_status_id,
		budget_status,
	})
	.then(function (res: any) {
	  resolve(res.data)
	})
  })

  
  export const addExpenseFile = (expense_id: number, file: File) => new Promise((resolve,reject) =>{
	var data = new FormData()
	data.append(0,file)
	data.append('budget_id',String(expense_id))
	axios.post(config.ipServer+'/imgn/api/v1/budget/file/add', data)
	.then(function (res: any) {
		resolve(res)
	})
})


export const addPayment = (payment: any) => new Promise((resolve,reject) =>{	
	axios.post(config.ipServer+'/imgn/api/v1/payment/add', {
			payment_id: typeof(payment.payment_id) == 'string' ? null : payment.payment_id,
			pos: payment.pos,
			project_id: payment.project_id,
			supplier_id: payment.supplier_id,
			budget_id: payment.budget_id,
			amount_paid: payment.amount_paid,
			accounting_id: payment.accounting_id,
			tax_id: payment.tax_id,
			comments: payment.comments,
			description: payment.description,
			date: payment.date
	})
	.then(function (res: any) {
	  resolve(res.data)
	})
  })


  
  export const deletePayments = (payment_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/payment/delete', {data: {payment_id}})
   .then((res:any) => {
			 resolve(res.data) 
     })
 })

export const expensesInitialState: ExpenseGroup[] = [
	// {
	// 	budget_category: '',
	// 	budgets:{
	// 		canban: [],
	// 		default: []
	// 	}
	// },
	
];

export const incomeInitialState: IncomeGroup[] = [
	{
		title: '',
		rows: []
	}
];
