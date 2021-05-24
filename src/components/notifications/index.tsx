import * as React from 'react';
import './index.scss';
import { useSelector }  from 'react-redux';
import { RootStore }  from '@src/store'
import { useOutsideClick } from '@src/utilities';
import { getNotifications, addNotification } from './helpers'

interface Props {
	readonly onOutsideClick: () => void;
}

export const NotificationsComponent: React.FC<Props> = (props: Props) => {
	const ref: React.MutableRefObject<any> = React.useRef(null);
	const {  onOutsideClick } = props;
	const [notifications, setNotifications] = React.useState([]);
	const user = useSelector((state: RootStore) => state.user)

	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	useOutsideClick(ref, onOutsideClick!);
	React.useEffect(()=>{
		if( user ) getNotifications(user.id).then(n=>setNotifications(n))
	},[user])

	return  (
		<div className={`c-notifications`} ref={ref}>
			<ul className="c-notifications__items">
				<h4>notifications:</h4>

				<button onClick={():void => {
						addNotification({from_user_id: 1, user_id: 2, notification: 'bla bla bla'})
				}}>
					click me !!!!

				</button>
			{notifications.map((n:any)=> (
				<div className="c-notifications__item">
					{n.notification}
				</div>
			))}

				</ul>
		</div>
			)
};

export default NotificationsComponent;
