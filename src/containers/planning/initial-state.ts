import axios from 'axios';
import { Event, PlanningState } from './interfaces';
import { config } from '../../config';


export const getLists = () => new Promise((resolve,reject) => {
	axios.get(config.ipServer+'/imgn/api/v1/list/get')
	  .then(res => {
		  resolve(res.data)
	  })
	//   .catch(err => window.location.href = Routes.NOT_FOUND)
})

export const addProject = (project: any) => new Promise((resolve,reject) => {
	let { user_id, company_id, project_id, project_name, date,date_end, budget, tasks, attachments, params, max_shooting_days } = project
	let newDate = new Date()
	var formData = new FormData()
	if( attachments ) {
		attachments.forEach((a:any, i:any) => {
			formData.append(i, a)
		});
	}
	formData.append('user_id', user_id)
	formData.append('company_id', company_id)
	formData.append('project_id', project_id)
	formData.append('project_name', project_name)
	formData.append('date', date)
	formData.append('date_end', date_end)
	formData.append('budget', budget)
	formData.append('tasks', tasks)
	formData.append('country_id', String(1))//israerl
	formData.append('createdAt', String(newDate))
	formData.append('updatedAt', String(newDate))
	formData.append('attachments', attachments)
	formData.append('params', params)
	formData.append('max_shooting_days', max_shooting_days)

	axios.post(config.ipServer+'/imgn/api/v1/project/add', formData)
		.then(function (res) {
			resolve(res.data)
		})
});


export const deleteProject = (project_id: number, user_id: any) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/project/delete', { data: { project_id, user_id }})
	.then(function (res: any) {
			resolve(res.data)
	})
})

export const getAllUsersCompany = (company_id: number) => new Promise((resolve,reject) => {
	axios.get(config.ipServer+'/imgn/api/v1/user/company/' + company_id )
	.then(function (res: any) {
		resolve(res.data)
	})
})




export const planningInitialState: PlanningState = {
	completed: [],
	active: []
};

export const eventsInitialState: Event[] = [
	// {
	// 	id: null,
	// 	project_name: '',
	// 	date: '',
	// 	budget: 0,
	// 	vat: 0,
	// 	company_id: 0,
	// 	created: false,
	// 	status: 'active',
	// 	// preview: false,

	// }
];
