import axios from 'axios';
import { Script } from './interfaces';
import { config } from '../../config';

export const getProjectScript = (project_id: number, chapter_number: number) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/project/script/get/'+ project_id + '/' + chapter_number)
	  .then(res => {
		if( res.data ) resolve(res.data)
	  })
})

export const deleteEpisode = (project_id: number, chapter_number: number) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/project/script/delete/'+ project_id + '/' + chapter_number)
		.then(res => {
			if( res.data ) resolve(res.data)
		})
});

export const addScene = (scene:any) => new Promise((resolve,reject) =>{
	const {takes, takes_titles, coordinates, address, cost, timeStart, timeEnd, specials, modify_all_scenes, scene_status_id, chapter_number, shooting_day_id, shooting_day_id_to, characters, project_id, text, scene_number, time, time_id, location, bits, bits_text, props, extras, extras_text, prepare, one_shoot, reshoots, clothes, makeups, others, status, screen_time, raw_time, camera_card, sound_card, comments, scene_duration } = scene

	axios.post(config.ipServer+'/imgn/api/v1/project/scene/add', {takes, takes_titles, coordinates, address, cost, timeStart, timeEnd, specials, modify_all_scenes, scene_status_id, chapter_number, shooting_day_id, shooting_day_id_to, characters, time, time_id, location,  bits, bits_text, project_id, scene_number,text, extras, extras_text, makeups, prepare, one_shoot, reshoots, props, clothes, others, status, screen_time, raw_time, camera_card, sound_card, comments, scene_duration })
		.then(function (response: any) {
			resolve(response.data)
		})
})

export const buildSchedule = (project_id:number, params: any[], max_shooting_days:number) => new Promise((resolve,reject) =>{
	axios.post(config.ipServer+'/imgn/api/v1/project/build/schedule', {project_id, max_shooting_days, params})
		.then(function (res: any) {
			resolve(res.data)
		})
})

export const getAllProjectCharacters = (project_id:number) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/project/character/get/' + project_id)
		.then(function (res: any) {
			resolve(res.data)
		})
})

export const getLimitations = (project_id:number, limitations:any) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/project/get/' + project_id)
		.then(function (res: any) {
			resolve(res.data)
		})
})

export const addLimitations = (project_id:number, limitations:any) => new Promise((resolve,reject) => {
	axios.post(config.ipServer+'/imgn/api/v1/project/limitation/add',  {
		project_id,
		limitations
	})
	.then(function (res: any) {
		resolve(res.data)
	})
})

export const addCharacter = (character:any) => new Promise((resolve,reject) =>{
	const { associated_num, character_id, character_name, character_type, project_id, supplier_id, project_scene_id, add_character_supplier_to_shooting_days  } = character
	axios.post(config.ipServer+'/imgn/api/v1/character/add', {associated_num, character_id, character_name, character_type, project_id, supplier_id, project_scene_id, add_character_supplier_to_shooting_days })
	.then(function (res: any) {
	 console.log("RESPONSE", res.data)
	  resolve(res.data)
	})
  })

export const deleteCharacter = (character_id:number, project_id:any, delete_from_character:number, delete_from_script:number, delete_from_shooting_day:number ) => new Promise((resolve,reject) =>{
	axios.delete(config.ipServer+'/imgn/api/v1/character/delete', {data: {
		character_id,
		project_id,
		delete_from_character,
		delete_from_script,
		delete_from_shooting_day
	}})
	.then(function (res: any) {
	  resolve(res.data)
	})
  })

export const scriptsInitialState: Script[] = [];

