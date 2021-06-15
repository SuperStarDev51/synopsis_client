import { UserActionTypes } from "@src/containers/user/enums";
import { Dispatch } from "react";
import { updateMyProfile } from ".";

export const updateUserProfileThunk = (userData: any) => {
	return (dispatch: Dispatch<any>) => {
		updateMyProfile(userData).then(()=>dispatch({
			type: UserActionTypes.SET_USER,
			payload: userData
		})).catch(e=> console.log(e))
	}
}
