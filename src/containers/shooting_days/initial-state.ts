import axios from 'axios';
import {  ShootingDay } from './interfaces';
import { config } from '../../config';
import { number } from 'prop-types';

export const getProjectShootingDays = (project_id: number) => new Promise((resolve,reject) =>{
	axios.get(config.ipServer+'/imgn/api/v1/project/shooting/get/' + project_id)
	  .then(res => {
		 if( res.data.err ) reject()
		 resolve(res.data)
	  })
})

export const addShootingDay = (shootingDay:any) => new Promise((resolve,reject) =>{
	const {add_suppliers_to_all_following_days, scene_pos, suppliers, project_shooting_day_id ,project_id, tasks, team_hours,locations, actors, employees, extra_expenses, general_comments, additional_expenses, params, shooting_day_obj, shooting_day, post_shooting_day, characters  } = shootingDay;
	axios.post(config.ipServer+'/imgn/api/v1/project/shooting/add', {add_suppliers_to_all_following_days, scene_pos, project_shooting_day_id, project_id, tasks, team_hours,locations,actors, employees, params, extra_expenses, general_comments, additional_expenses, shooting_day_obj, shooting_day, post_shooting_day, suppliers, characters})
	.then(function (response: any) {
	  resolve(response.data)
	})
  })

export const moveScenesBetweenShootingDays = (shooting_days_data:any) => new Promise((resolve,reject) =>{
	const { project_scene_id, project_shooting_day_id_from, project_shooting_day_id_to, project_id } = shooting_days_data;
	axios.post(config.ipServer+'/imgn/api/v1/project/shooting/scene/move', {project_scene_id, project_shooting_day_id_from, project_shooting_day_id_to, project_id})
		.then(function (response: any) {
			resolve(response.data)
		})
})

  export const addShootingDays = (shooting_days:any) => new Promise((resolve,reject) =>{
	axios.post(config.ipServer+'/imgn/api/v1/project/shootings/add',  shooting_days)
	.then(function (response: any) {
	  resolve(response.data)
	})
  })


export const deleteShootingDay = (id:any) => new Promise((resolve,reject) => {
	axios.delete(config.ipServer+ '/imgn/api/v1/project/shooting/delete', {data: {project_shooting_day_id: id}})
	.then(function (response: any) {
	  resolve(response.data)
	})
  })



export const shootingDaysInitialState: ShootingDay[] = [];

