import axios from 'axios';
import { UserInterface } from './interfaces';
import { config } from '../../config';
import { Task } from 'redux-saga';

export const getProjectTasks = (eventId: string, with_tasks: number) => new Promise((resolve,reject) =>{
	axios.get(`${config.ipServer}/imgn/api/v1/task/project/user/get/${eventId}/${with_tasks}`)
	.then(res => {
		let {tasks} = res.data
		if( tasks && tasks.length > 0 ) {
			let ActiveUserID = 1
			const i = tasks.findIndex((user: UserInterface) => user.id === ActiveUserID );
			if( i > 0) { tasks[i].active = true }
			else { tasks[0].active = true }
			resolve(tasks)
		}
	}).catch(err=> reject('Error'))
})

export const setTasksList = (tasks: any) => new Promise((resolve,reject) =>{
	var newTasks: any= []
	tasks.forEach((task: any) => {
		newTasks.push({
			pos: task.pos,
			task_id: typeof(task.id) == 'string' ? null : task.id,
			task_name: task['task-to-do'],
			project_id: task.eventId,
			task_category_id: task.listId,
			task_type_id: task.type > 0 ? task.type : null,
			task_status_id: task.status_id ? task.status_id : 1,
			// supplier_id: task.supplier_id > 0 ? task.supplier_id: null,
			price: task.price ? task.price : 0,
			supplier_id: task.supplier_id,
			comments: task.comments,
			parent_task_id: task.parent_task_id ? task.parent_task_id : 0,
			due_date: task.due_date,
			attachments: task.attachments,
	})
	});
	axios.post(config.ipServer+'/imgn/api/v1/tasks/add', newTasks)
	  .then(response => {
		let data = response.data
		if (response.status !== 200) {
			throw new Error(response.statusText)
		}
		resolve(data)
	  })
	  .catch(error => {	reject('err') });
  });

  export const getTaskTypes = () => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/task/type/get')
	.then(function (res: any) {
			 let typeOptions = res.data
			 if( typeOptions && typeOptions.length > 0 ) {
				 resolve(typeOptions)
	 } else resolve([])

  }) .catch(error => {	reject('err') });
});


export const addTaskCategory = (task_category: string,  supplier_id: number, project_id: number, color: string, task_category_id: any) => new Promise((resolve,reject) =>{
	let category = {
		task_category_id: typeof(task_category_id) == 'string' ? null : task_category_id, // (if update)
		supplier_id,
		project_id,
    	task_category,
    	color
	}
	axios.post(config.ipServer+'/imgn/api/v1/task/category/add', category)
   .then(function (res: any) {
	 resolve(res.data)
   })
 });


export const addTaskType = (task_type: string,  task_type_id: any) => new Promise((resolve,reject) =>{
	axios.post(config.ipServer+'/imgn/api/v1/task/type/add', {task_type, task_type_id})
   .then(function (res: any) {
	 resolve(res.data)
   })
 });


 export const deleteTaskCategory = (task_category_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/task/category/delete', {data: {task_category_id}})
   .then((res:any) => {
			 resolve(res.data)
     })
 })

 export const deleteTaskTitles = (project_id: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/task/title/delete', {data: {project_id}})
   .then((res:any) => {
			 resolve(res.data)
     })
 })


 export const addTaskTitle = (task_title: any) => new Promise((resolve,reject) =>{
	 const { project_id, category_id, key, value } = task_title
	axios.post(config.ipServer+'/imgn/api/v1/task/title/add',  {
		project_id,
		category_id,
		[key]: value
	})
   .then((res:any) => {
			 resolve(res.data)
     })
 })


 export const addTask = (task: any) => new Promise((resolve,reject) =>{
	let newTask = {
		shooting_day_id: task.shooting_day_id,
		pos: task.pos,
		task_id: typeof(task.id) == 'string' ? null : task.id,
		task_name: task['description'],
		project_id: task.project_id,
		task_category_id: task.listId,
		task_type_id: task.task_type_id > 0 ? task.task_type_id : null,
		task_status_id: task.status_id ? task.status_id : 1,
		supplier_id: task.supplier_id > 0 ? task.supplier_id: null,
		price: task.price ? task.price : 0,
		comments: task.comments,
		parent_task_id: task.parent_task_id ? task.parent_task_id : 0,
		number1: task.number1,
		number2: task.number2,
		number3: task.number3,
		text1: task.text1,
		text2: task.text2,
		text3: task.text3,
		due_date: task.due_date,
		attachments: task.attachments,
}
	axios.post(config.ipServer+'/imgn/api/v1/task/add', newTask)
   .then(function (res: any) {
	  resolve({...res.data, listId: res.data.task_category_id})
   })
 })


	export const addTaskFile = (task_id: number, file: File) => new Promise((resolve,reject) =>{
		var data = new FormData()
		data.append(0,file)
		data.append('task_id',String(task_id))
		axios.post(config.ipServer+'/imgn/api/v1/task/file/add', data)
		.then(function (res: any) {
			resolve(res)
		})
	})

	export const deleteTaskFile = (file_id: string, file_name: string, task_id: string) => new Promise((resolve,reject) =>{
		axios.delete(config.ipServer+'/imgn/api/v1/task/file/delete', {data: {task_id, file_id, file_name}})
			.then(function (res: any) {
				resolve(res)
			})
	})





 export const deleteTask = (task_id: any) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/task/delete', { data: { task_id } })
   .then(function (res: any) {
		resolve(res)
   })
 })



export const usersInitialState: UserInterface[] = [

	// {
	// 	id: null,//uuidv4(),
	// 	name: null,
	// 	active: true,
	// 	lists: [
	// 		{
	// 			id: uuidv4(),
	// 			task_category: 'To Do',
	// 			color: 'red',
	// 			tasks: {
	// 				canban: [],
	// 				default: []
	// 			}
	// 		}
	// 	]
	// }

	// 		// {
	// 		// 	id: uuidv4(),
	// 		// 	title: 'In Progress',
	// 		// 	color: 'rebecapurple',
	// 		// 	tasks: {
	// 		// 		canban: [],
	// 		// 		default: []
	// 		// 	}
	// 		// },
	// 		// {
	// 		// 	id: uuidv4(),
	// 		// 	title: 'Completed',
	// 		// 	color: 'green',
	// 		// 	tasks: {
	// 		// 		canban: [],
	// 		// 		default: []
	// 		// 	}
	// 		// }
	// 	],

	// 	active: true
	// },
	// {
	// 	id: '3',//uuidv4(),
	// 	name: 'Admin1',
	// 	lists: [
	// 		{
	// 			id: uuidv4(),
	// 			title: 'To Do',
	// 			color: 'red',
	// 			tasks: {
	// 				canban: [],
	// 				default: []
	// 			}
	// 		}
	// 	]
	// }
];
