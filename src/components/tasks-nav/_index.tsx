import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames'
import { FormattedMessage , useIntl} from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useOutsideClick } from '@src/utilities';
import { RootStore } from '@src/store';
import { UserInterface } from '@src/containers/tasks/interfaces';
import { UsersActionTypes } from '@src/containers/tasks/enums';
import {Nav, NavItem, NavLink} from "reactstrap";

export const UsersNavCategorised: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();

	const users = useSelector((state: RootStore) => state.users);
	const suppliers = useSelector((state: RootStore) => state.suppliers);

	const [usersWithoutTasksShown, setUsersWithoutTasksShown] = React.useState<boolean>(false);
	const [active, setActive] =  React.useState<number>(null);
	const navRef: React.MutableRefObject<any> = React.useRef(null);

	const resetMenu = () => {
		setActive();
		setUsersWithoutTasksShown(false);
	};

	useOutsideClick(navRef, resetMenu);

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
		<Nav pills className="floating-btns">
			{suppliers.length
				? suppliers.map((data: any, index:number) =>  {
					let userIds = [];
					users.forEach(user => {
						userIds.push(user.id)
					});
					const suppliersWithTasks = data.suppliers.default.filter(item => userIds.includes(item.id));
					const suppliersWithOutTasks = data.suppliers.default.filter(item => !userIds.includes(item.id));

					return (
						<NavItem key={index}>
							{active == index ? (
								<div ref={navRef} className="floating-btns__menu mb-1 mr-05">
									{suppliersWithTasks.map((supplier: any) => (
										<div
											className="floating-btns__menu-item"
											onClick={(): void => {
												onUserClick(supplier.id);
												resetMenu();
											}}
										>
											{supplier.supplier_name}
										</div>
									))}
									{usersWithoutTasksShown ? (
										<div className="opacity-05">
											{suppliersWithOutTasks.map((supplier: any) => (
												<div
													className="floating-btns__menu-item"
													onClick={(): void => {
														onAddUser();
														resetMenu();
													}}
												>
													{supplier.supplier_name}
												</div>
											))}
										</div>
									): null}
									{!usersWithoutTasksShown ? (
									<div
										className="floating-btns__menu-item"
										onClick={(): void => setUsersWithoutTasksShown(true)}
									>
										+ <FormattedMessage id={'add_new'} />
									</div>
									): null}
								</div>
							) : null }
							<NavLink
								className={classnames({
									active: active == index
								})}
								onClick={() => setActive(index)}>
								<FormattedMessage id={data.supplier_category} />
							</NavLink>
						</NavItem>
					)
				}) : null}
		</Nav>
	);
};

export default UsersNavCategorised;
