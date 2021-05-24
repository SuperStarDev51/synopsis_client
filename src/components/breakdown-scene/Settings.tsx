import * as React from 'react';
import { MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import {RootStore} from "@root/src/store";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";

export const Settings: React.FunctionComponent = ({ resetSelection }) => {
	const dispatch = useDispatch();
	const infoTypes = ['Type 1', 'Type 2', 'Type 3', 'Type 4']
	const [isMenuOpen, setMenuOpen] = React.useState(false)

	return (
		<div className="">
			<MenuItem
				className="mt-1 text-white btn-secondary text-uppercase"
			>
				<span onClick={() => {
					setMenuOpen(true);
					window.dispatchEvent(new Event('resize'));
				}}>
					Settings
				</span>
			</MenuItem>
			{isMenuOpen ? (
				<div className="bg-light-gray">
					{infoTypes.map((item, key) => (
						<div
							key={key}
							className="cursor-pointer px-1"
							onClick={() => {
								setMenuOpen(false)
								resetSelection()
							}}
						>
							{item}
						</div>
					))}
				</div>
			):null}
		</div>
	)
};

export default Settings;

