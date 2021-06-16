import { setUserAction } from "@src/reduxActions";
import { Dispatch } from "react";
import axios from 'axios';
import { config } from '../../../config';

export const updateUserProfileThunk = (userData: any) => {
	return (dispatch: Dispatch<any>) => {
		axios.post(`${config.ipServer}/imgn/api/v1/user/update_profile`, {
			userData,
			}).then(()=>dispatch(setUserAction(userData)))
			.then(()=>localStorage.setItem('user', JSON.stringify(userData)))
			.catch(e=> console.log(e))
	}
}
