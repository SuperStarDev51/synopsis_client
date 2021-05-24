import axios from 'axios';
import { config } from '../../config';

export const getAllProjectsCompany = (company_id: number, user_id: any) => new Promise((resolve,reject) => {
	console.log('2user_id!!!!!!',  user_id)
	axios.get(config.ipServer+`/imgn/api/v1/project/company/${company_id}/${user_id}`)
	  .then(res => {
		if( res.data && res.data.length > 0 ) resolve(res.data)
	  })
})
