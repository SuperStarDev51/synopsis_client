import axios from 'axios';
import { config } from '../../config';

export const getAllProjectsCompany = (company_id: number, user_id: any) => new Promise((resolve,reject) => {
	axios.get(config.ipServer+`/imgn/api/v1/project/company/${company_id}/${user_id}`)
	  .then(res => {
		if( res.data && res.data.length > 0 ) resolve(res.data)
	  })
})

export const updateProjectName = (project_name: string, project_id: number) => new Promise((resolve,reject) => {
	let project = {
		 project_name,
		 project_id
	}
	axios.post(config.ipServer+'/imgn/api/v1/user/project/nameEdit', project)
	  .then(function (res) {
		resolve(res.data)
	})
})
