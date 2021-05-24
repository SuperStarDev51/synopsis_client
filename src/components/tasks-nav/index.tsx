import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import classnames from 'classnames'
import { FormattedMessage , useIntl} from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useOutsideClick } from '@src/utilities';
import { RootStore } from '@src/store';
import { UserInterface } from '@src/containers/tasks/interfaces';
import { UsersActionTypes } from '@src/containers/tasks/enums';
import {Nav, NavItem, NavLink} from "reactstrap";
import {XCircle} from "react-feather";
import {deleteCharacter} from "@containers/scripts/initial-state";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import {CharactersActionTypes} from "@root/src/containers/tasks/ListsReducer";

export const TasksNav: React.FunctionComponent = ({ setDayView, setCharacterView, setLocationsView }) => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();

	const characters = useSelector((state: RootStore) => state.characters);
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);

	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];

	const [usersWithoutTasksShown, setUsersWithoutTasksShown] = React.useState<boolean>(false);
	const [active, setActive] =  React.useState<number>(null);
	const navRef: React.MutableRefObject<any> = React.useRef(null);

	const resetMenu = () => {
		setActive();
		setUsersWithoutTasksShown(false);
	};

	useOutsideClick(navRef, resetMenu);

	const onDayClick = (id: string): void => {
		dispatch({
			type: ShootingDaysActionTypes.SET_ACTIVE_DAY,
			payload: shootingDays.map(
				(shootingDay, index)=> ({
					...shootingDay,
					dayNumber: index + 1,
					active: shootingDay.id === id,
				})
			)
		});
	};

	const onCharacterClick  = (characterId: string): void => {
		dispatch({
			type: CharactersActionTypes.SET_ACTIVE_CHARACTER,
			payload: characters.map(character => ({
					...character,
					active: character.character_id === characterId
				})
			)
		});
	};

	const handleDeleteCharacter = (characterId: string): void => {
		deleteCharacter(
			characterId,
			activeEvent.id,
			1,
			0,
			0
		);

		dispatch({
			type: CharactersActionTypes.DELETE_CHARACTER,
			payload: {characterId},
		})
	};

	return (
		<Nav pills className="floating-btns">
			<NavItem>
				<div ref={navRef} className="floating-btns__menu mb-1 mr-05">
					{shootingDays.map((shootingDay: any, index: number) => (
						<div
							key={shootingDay.id}
							className="floating-btns__menu-item d-flex align-items-center justify-content-between"
							onClick={(): void => {
								onDayClick(shootingDay.id);
								resetMenu();
								setDayView();
							}}
						>
							<span>{index + 1}. {shootingDay.date ? moment(shootingDay.date).format('D MMM') : 'No date'}</span>
						</div>
					))}
				</div>

				<NavLink
					className={classnames({
						active: true
					})}
					onClick={() => {}}>
					<FormattedMessage id="shooting_days" />
				</NavLink>
			</NavItem>
			<NavItem>
				<div ref={navRef} className="floating-btns__menu mb-1 mr-05">
					{characters.map((character: any) => (
						<div
							key={character.character_id}
							className="floating-btns__menu-item d-flex align-items-center justify-content-between"
						>
							<span
								className="flex-grow-1"
								onClick={(): void => {
									onCharacterClick(character.character_id);
									resetMenu();
									setCharacterView();
								}}
							>
								{character.character_name}
							</span>
							<XCircle
								className="n-btn-delete mr-05"
								size={20}
								onClick={(): void => handleDeleteCharacter(character.character_id)}/>
						</div>
					))}
				</div>

				<NavLink
					className={classnames({
						active: true
					})}
					onClick={() => {}}
				>
					<FormattedMessage id="actors" />
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink
					className={classnames({
						active: true
					})}
					onClick={() => setLocationsView()}
				>
					<FormattedMessage id="locations" />
				</NavLink>
			</NavItem>
		</Nav>
	);
};

export default TasksNav;
