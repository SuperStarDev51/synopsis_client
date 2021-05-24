import axios from 'axios';
import { config } from '../../config';


export const Search = (v: string) => new Promise((resolve,reject) =>{
   axios.post(config.ipServer+'/imgn/api/v1/user/notification/fetch', v)
  .then((res:any) => {
     let { results } = res.data
     if(results) resolve(results)
	})
})
