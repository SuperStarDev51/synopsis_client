import axios from 'axios';
import { config } from '../../../config';

export const updateMyProfile = (userData: any) => new Promise((resolve, reject) => {
	axios.post(`${config.ipServer}/imgn/api/v1/user/update_profile`, {
	userData,
	}).then(res => console.log(res)).catch(err => reject(err))
});


{/*
	Ignore this function
*/}

// export const uploadProfileImage = (userData: any) => new Promise((resolve, reject) => {
// 			const data = new FormData();
// 			console.log(userData);
// 	    	data.append('file', userData);
// 			data.append('user_id', '2');
// 	axios.post(`${config.ipServer}/imgn/api/v1/project/imgfile/uploadProfileIMG`,
// 		data
// 	)
// 		.then(res =>
// 			console.log(res)

// 	).catch(err => reject(err))
// });
