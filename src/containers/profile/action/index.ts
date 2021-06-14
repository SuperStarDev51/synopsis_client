import axios from 'axios';
import { config } from '../../../config';

export const updateMyProfile = (userData: any) => new Promise((resolve, reject) => {
	axios.post(`${config.ipServer}/imgn/api/v1/user/update_profile`, {
		body: JSON.stringify(userData)
	})
		.then(res =>
			console.log(res)

	).catch(err => reject(err))
});
