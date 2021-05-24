import axios from 'axios';
import { config } from '../../config';

interface Notification {
   readonly from_user_id: number,
   readonly user_id: number,
   readonly notification: string
}

export const getNotifications = (user_id: number) => new Promise((resolve,reject) =>{
   axios.post(config.ipServer+'/imgn/api/v1/user/notification/fetch', {user_id})
  .then((res:any) => {
     let { notifications } = res.data
     if(notifications) resolve(notifications)
	})
})

export const addNotification = (notification: Notification) => new Promise((resolve,reject) =>{
   axios.post(config.ipServer+'/imgn/api/v1/user/notification/add', notification)
  .then((res:any) => {
			resolve(res.data) 
	})
})

export const addNotifications = (notifications: Notification[]) => new Promise((resolve,reject) =>{
   axios.post(config.ipServer+'/imgn/api/v1/user/notifications/add', notifications)
  .then((res:any) => {
			resolve(res.data) 
	})
})

