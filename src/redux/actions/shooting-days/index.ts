import { ShootingDaysActionTypes } from '@src/containers/shooting_days/enums';


export const setShootingDayParameter = ( shooting_day_index:number, type: string, data:any ) => {
  return (dispatch: any) => {
    dispatch({
      type: ShootingDaysActionTypes.SET_SHOOTING_DAY_PARAMETER,
      payload: {
        shooting_day_index,
        type,
        data
      }})
  }
}

export const deleteShootingDayParameter = ( shooting_day_index:number , index: any, type:string ) => {
  return (dispatch: any) => {
    dispatch({
      type: ShootingDaysActionTypes.DELETE_SHOOTING_DAY_PARAMETER,
      payload: {
        shooting_day_index,
        type,
        index
      }})
  }
}


export const setShootingDayParameterValue = ( shooting_day_index:number, type: string, value:any, field?: string ,type_index?:number ) => {
	return (dispatch: any) => {
    dispatch({
      type: ShootingDaysActionTypes.SET_SHOOTING_DAY_PARAMETER_VALUE,
      payload: {
        shooting_day_index,
        type,
        field,
        type_index,
        value
      }})
  }
}


export const setPostShootingDayValue = ( shooting_day_index:number, type: string, value:any ) => {
  return (dispatch: any) => {
    dispatch({
      type: ShootingDaysActionTypes.SET_POST_SHOOTING_DAY_VALUE,
      payload: {
        shooting_day_index,
        type,
        value
      }})
  }
}

export const setShootingDayPreview = ( shooting_day_index:number ) => {
  return (dispatch: any) => {
    dispatch({
      type: ShootingDaysActionTypes.SET_SHOOTING_DAY_PREVIEW,
      payload: shooting_day_index
    })
  }
}

export const setShootingDaySceneParameter = ( sceneId, field: string, data:any, modifyAllScenes:boolean ) => {
	if (field === 'status') field = 'scene_status_id';

	return (dispatch: any) => {
		dispatch({
			type: ShootingDaysActionTypes.SET_SHOOTING_DAY_SCENE_PARAMETER,
			payload: {
				sceneId,
				field,
				data,
				modifyAllScenes
			}
		})
	}
}
