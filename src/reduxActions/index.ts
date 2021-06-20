import { createAction } from "redux-actions";
import { SET_USER, UPDATE_USER_PROFILE_IMAGE } from "./actionTypes/constant";

export const setUserAction = createAction(SET_USER);
export const updateUserProfileImage = createAction(UPDATE_USER_PROFILE_IMAGE);
