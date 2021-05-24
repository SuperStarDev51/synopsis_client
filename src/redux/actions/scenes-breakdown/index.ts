import { ScriptsActionTypes } from '@containers/scripts/enums';
import {
  SceneTimeActionTypes,
  SceneLocationActionTypes } from '@containers/tasks/ListsReducer';

export const setSceneParameter = ( sceneId, field: string, data:any, modifyAllScenes:boolean ) => {

	return (dispatch: any) => {
    dispatch({
      type: ScriptsActionTypes.SET_SCENE_PARAMETER,
      payload: {
        sceneId,
		field,
		data,
		modifyAllScenes,
      }})
  }
}

export const setSceneLocation = ( scene_locations:any ) => {
  return (dispatch: any) => {
    dispatch({
      type: SceneLocationActionTypes.SET_SCENE_LOCATION,
      payload: scene_locations
    });
  }
}


export const setScenetime = ( scene_times:any ) => {
  return (dispatch: any) => {
    dispatch({
      type: SceneTimeActionTypes.SET_SCENE_TIME,
      payload: scene_times
    });
  }
}



