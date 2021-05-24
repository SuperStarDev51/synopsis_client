import axios from 'axios';
import { config } from '../../config';

export const RegisterUser = registerData => {
	const {
		first_name,
		last_name,
		email,
		password,
		company_id,
		company_name,
		country_id,
		permission_status_id,
		permission_type_id,
		supplier_job_title_id,
		code,
		admin_user_id
	} = registerData;
	return new Promise((resolve, reject) => {
		axios.post(`${config.ipServer}/imgn/api/v1/user/register`, {
			first_name,
			last_name,
			email,
			password,
			company_id,
			country_id,
			permission_status_id,
			permission_type_id,
			supplier_job_title_id,
			company_name,
			code,
			admin_user_id
		})
			.then(res => {
				const {user, toekn, err} = res.data
				if (err) reject(err)
				else {
					localStorage.setItem('user', JSON.stringify(user));
					resolve(user)
				}
			}).catch(err => reject('Error'))
	})
}

export const sendInvitation = (
	user_id: any,
	project_id: any,
	email: string
) => {
	return new Promise((resolve, reject) => {
		axios.post(`${config.ipServer}/imgn/api/v1/user/invite`, {
			user_id,
			project_id,
			email,
		})
			.then(res => {
				const {code, err} = res.data
				if (err) reject(err)
				else {
					resolve(code)
				}
			}).catch(err => reject('Error'))
	})
}

export default RegisterUser;
