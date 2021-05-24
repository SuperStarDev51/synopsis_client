import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { UserInterface } from '@src/containers/tasks/interfaces';
import { UsersActionTypes } from '@src/containers/tasks/enums';
import { useIntl } from "react-intl"

export const UsersNav: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const users = useSelector((state: RootStore) => state.users);

	const onUserClick = (id: string): void => {
		dispatch({
			type: UsersActionTypes.SET_USERS,
			payload: users.map(
				(user: UserInterface): UserInterface => ({
					...user,
					active: user.id === id
				})
			)
		});
	};

	const onAddUser = (): void => {
		dispatch({
			type: UsersActionTypes.SET_USERS,
			payload: [
				...users.map((user: UserInterface) => ({ ...user, active: false })),
				{
					id: uuidv4(),
					name: formatMessage({id: 'new_user'}),
					lists: [
						{
							id: uuidv4(),
							title: formatMessage({id: 'new_list'}),
							color: '',
							tasks: {
								canban: [],
								default: []
							}
						}
					],
					active: true
				}
			]
		});
	};

	return (
		<nav className="c-nav-users">
			<div className="c-nav-users__items">
				{users.map((user: UserInterface, index: number) => (
					<button
						key={index}
						className={`c-nav-users__item ${user.active ? 'current' : ''}`}
						style={{backgroundImage: `url(${user.image})`}}
						onClick={(): void => onUserClick(user.id)}
					>{user.supplier_name}</button>
				))}
			</div>

			{/* <button onClick={onAddUser} className="c-nav-users__add-new"></button> */}
		</nav>
	);
};

export default UsersNav;
