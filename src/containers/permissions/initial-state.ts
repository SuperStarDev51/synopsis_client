import axios from 'axios';
import {  SupplierGroup } from './interfaces';
import { config } from '../../config';


export const updateUserPermissionType = (user_id: number, permission_type_id: number) => new Promise((resolve,reject) =>{
	let userData = {
		user_id,
		permission_type_id,
	};
	axios.post(config.ipServer+'/imgn/api/v1/user/update_profile', userData)
		.then(function (res: any) {
			resolve(res.data)
		})
});

export const updateUserPermissionStatus = (user_id: number, permission_status_id: number) => new Promise((resolve,reject) =>{
	let userData = {
		user_id,
		permission_status_id,
	};
	axios.post(config.ipServer+'/imgn/api/v1/user/update_profile', userData)
		.then(function (res: any) {
			resolve(res.data)
		})
});

export const updateUserJobTitle = (user_id: number, supplier_job_title_id: number) => new Promise((resolve,reject) =>{
	let userData = {
		user_id,
		supplier_job_title_id,
	};
	axios.post(config.ipServer+'/imgn/api/v1/user/update_profile', userData)
		.then(function (res: any) {
			resolve(res.data)
		})
});


export const permissionsInitialState: any[] = [

];
