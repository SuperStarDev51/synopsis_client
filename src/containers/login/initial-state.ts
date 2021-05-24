import axios from 'axios';
import { config } from '../../config';

export const LoginUser = (email: string, password: string) => new Promise((resolve,reject) =>{
	axios.post(`${config.ipServer}/imgn/api/v1/user/login`, {
		email,
		password
	})
	.then(res => {
		const { user, toekn, err } = res.data
		if( err ) reject(err)
		else {
			localStorage.setItem('user', JSON.stringify(user));
			resolve(user)
		}
	}).catch(err=> reject(err))
});
