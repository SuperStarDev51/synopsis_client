import axios from 'axios';
import {  SupplierGroup } from './interfaces';
import { config } from '../../config';

  export const getSuppliersList = (project_id:number) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/supplier/project/get/'+ project_id)
	  .then(response => {
		if (response.status !== 200 ) {
			throw new Error(response.statusText)
		}
		let data = response.data
		if( data ) {resolve(data)} else reject()
	  })
  })

  export const setSuppliersList = (rows: any) => new Promise((resolve,reject) =>{
	var newRows: any= []
	rows.forEach((supplier: any) => {
		let newSupplier = {
				pos: supplier.pos,
				company_id: supplier.company_id,
				supplier_id: typeof(supplier.id) == 'string' ? null : supplier.id,
				supplier_name: supplier['supplier_name'],
				supplier_type_id: supplier.type,
				service_description: supplier['service_description'],
				contact_name: supplier['contact_name'],
				phone: supplier.phone,
				email: supplier.email,
				comments: supplier.comments,
				supplier_status_id: supplier.status,
				attachments: supplier.attachments,
				number1: supplier.number1,
				number2: supplier.number2,
				number3: supplier.number3,
				text1: supplier.text1,
				text2: supplier.text2,
				text3: supplier.text3
		}
		newRows.push(newSupplier)
	});
	axios.post(config.ipServer+'/imgn/api/v1/suppliers/add', newRows)
	  .then(response => {
		let data = response.data
		if (response.status !== 200) {
			throw new Error(response.statusText)
		}
		resolve(data)
	  })
	  .catch(error => {	reject('err') });
  })

  export const addSupplier = (supplier: any) => new Promise((resolve,reject) =>{
	let newSupplier = {
		pos: supplier.pos,
		supplier_category_id: supplier.category_id,
		company_id: supplier.company_id,
		project_id: supplier.project_id,
		supplier_id: typeof(supplier.id) == 'string' ? null : supplier.id,
		supplier_name: supplier['supplier_name'],
		supplier_type_id: supplier.supplier_type_id > 0 ? supplier.supplier_type_id : null,
		service_description: supplier['service_description'],
		supplier_job_title_id: supplier.supplier_job_title_id,
		supplier_unit_cost: supplier.supplier_unit_cost,
		supplier_unit_type_id: supplier.supplier_unit_type_id > 0 ? supplier.supplier_unit_type_id : null,
		budget_comments: supplier.budget_comments,
		contact_name: supplier['contact_name'],
		phone: supplier.phone,
		email: supplier.email,
		start_date: supplier.start_date,
		end_date: supplier.end_date,
		comments: supplier.comments,
		supplier_status_id: supplier.supplier_status_id > 0 ? supplier.supplier_status_id : null,
		attachments: supplier.attachments,
		number1: supplier.number1,
		number2: supplier.number2,
		number3: supplier.number3,
		text1: supplier.text1,
		text2: supplier.text2,
		text3: supplier.text3,
		//dashboard
		actor_name: supplier.actor_name,
		character: supplier.character,
		agency: supplier.agency,
		pickup: supplier.pickup,
		site: supplier.site,
		end_time: supplier.end_time,
		post_comments: supplier.post_comments,
	}
	axios.post(config.ipServer+'/imgn/api/v1/supplier/add', newSupplier)
	.then(function (response: any) {
	  resolve(response.data)
	})
  })

  export const addSupplierTitle = (supplier_title: any) => new Promise((resolve,reject) =>{
	const { company_id,project_id,  category_id, key, value } = supplier_title
		axios.post(config.ipServer+'/imgn/api/v1/supplier/title/add',  {
			company_id,
			project_id,
			category_id,
			[key]: value
		})
		.then((res:any) => {
					resolve(res.data)
		})
   })

  export const addSupplierType = (supplier_type: any, supplier_type_id: any) => new Promise((resolve,reject) =>{
		axios.post(config.ipServer+'/imgn/api/v1/supplier/type/add', {
			supplier_type,
			supplier_type_id
		})
		.then(function (response: any) {
		resolve(response.data)
		})
  })

  export const addSupplierUnitType = (supplier_unit_type: any, supplier_type_id: any) => new Promise((resolve,reject) =>{
	axios.post(config.ipServer+'/imgn/api/v1/supplier/type/add', {
		supplier_unit_type,
		supplier_type_id
	})
	.then(function (response: any) {
	resolve(response.data)
	})
})


  export const addSupplierJobTitle = (supplier_job_title: any, supplier_job_title_id: any) => new Promise((resolve,reject) =>{
		axios.post(config.ipServer+'/imgn/api/v1/supplier/status/add', {
			supplier_job_title_id,
			supplier_job_title,
		})
		.then(function (response: any) {
		resolve(response.data)
		})
  })


  export const addSupplierFile = (supplier_id: number, file: File) => new Promise((resolve,reject) =>{
	var data = new FormData()
	data.append(0,file)
	data.append('supplier_id',String(supplier_id))
	axios.post(config.ipServer+'/imgn/api/v1/supplier/file/add', data)
	.then(function (res: any) {
		resolve(res)
	})
})
	export const deleteSupplier = (supplier_id: number) => new Promise((resolve,reject) =>{
		axios.delete(config.ipServer+'/imgn/api/v1/supplier/delete', { data: { supplier_id }})
		.then(function (response: any) {
			resolve(true)
		})
 })

export const addSupplierCategory = (supplier_category: string, color: string, supplier_category_id:number|null ) => new Promise((resolve,reject) =>{
  	let category = {
		supplier_category_id: typeof(supplier_category_id) == 'string' ? null : supplier_category_id, // (if update)
		supplier_category,
		color
	}
	axios.post(config.ipServer+'/imgn/api/v1/supplier/category/add', category)
		.then(function (res: any) {
			resolve(res.data)
		})
})

export const deleteSupplierCategory = (supplier_category_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/supplier/category/delete', {data: {supplier_category_id}})
		.then((res:any) => {
			resolve(res.data)
		})
})

export const suppliersInitialState: SupplierGroup[] = [];
