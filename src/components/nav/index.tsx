import * as React from 'react';
import SVG from 'react-inlinesvg';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Event } from '@containers/planning/interfaces';

import { Routes } from '@utilities';
import { RootStore } from '@src/store';

import * as DnsIcon from '@assets/images/dns-icon.svg';
import * as DoneIcon from '@assets/images/done-icon.svg';
import * as PlanningIcon from '@assets/images/layers.svg';
import * as OverviewIcon from '@assets/images/overview.svg';
import * as DollarIcon from '@assets/images/dollar-icon.svg';
import * as FolderIcon from '@assets/images/folder-icon.svg';
import * as SettingsIcon from '@assets/images/settings-dark.svg';

import './index.scss';

export const Nav: React.FunctionComponent = () => {
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0]);

	return (
		<div className="c-nav">
			<NavLink className="c-nav__item" to={Routes.PLANNING.replace(':id',activeEvent.id)} exact>
				<SVG src={PlanningIcon as any} />
				Planning
			</NavLink>

			<NavLink className={`c-nav__item`} to={Routes.BUDGET.replace(':id',activeEvent.id)} exact>
				<SVG src={DollarIcon as any} />
				Budget
			</NavLink>

			<NavLink className={`c-nav__item`} to={Routes.TASKS.replace(':id',activeEvent.id)} exact>
				<SVG src={DoneIcon as any} />
				Tasks
			</NavLink>

			<NavLink className={`c-nav__item`} to={Routes.SUPPLIERS.replace(':id',activeEvent.id)} exact>
				<SVG src={DnsIcon as any} />
				Suppliers
			</NavLink>

			<NavLink className={`c-nav__item`} to={Routes.OVERVIEW.replace(':id',activeEvent.id)} exact>
				<SVG src={OverviewIcon as any} />
				Overview
			</NavLink>

			<NavLink className={`c-nav__item`} to={Routes.FILES.replace(':id',activeEvent.id)} exact>
				<SVG src={FolderIcon as any} />
				Files
			</NavLink>

			<a className="c-nav__item c-nav__item-last">
				<SVG src={SettingsIcon as any} />
				Settings
			</a>
		</div>
	);
};

export default Nav;
