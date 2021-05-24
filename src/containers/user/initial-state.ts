import { callbackify } from 'util'
import axios from 'axios';
import { config } from '../../config';
import { UserActionTypes } from './enums';

export const logOut = (_callback:Function) => {
    localStorage.removeItem('user')
    if(_callback) _callback()
};

export const isAuth = () => {
    return localStorage.user
};

export const userInitialState: any[] = [

];

export const getAllCompanyUsers = (company_id:number) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/user/company/get/'+ company_id)
		.then(response => {
			if (response.status !== 200 ) {
				throw new Error(response.statusText)
			}
			let data = response.data
			if( data ) {resolve(data)} else reject()
		})
})
