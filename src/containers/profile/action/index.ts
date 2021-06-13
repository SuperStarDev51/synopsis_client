import axios from 'axios';
import { config } from '../../../config';

export const updateMyProfile = (userData: any) => new Promise((resolve,reject) =>{
	axios.post(`${config.ipServer}/imgn/api/v1/user/userUpdate`, {
		body: JSON.stringify(userData)
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
