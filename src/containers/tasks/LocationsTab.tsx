import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Icon, TableType} from '@components';
import classnames from 'classnames';
import * as moment from 'moment';
import { RootStore } from '@src/store';
import { UserInterface } from './interfaces';
import {UsersNavCategorised} from "@root/src/components/users-nav-categorised";
import {TasksNav} from "@root/src/components/tasks-nav";
import { setSceneParameter } from "@root/src/redux/actions/scenes-breakdown";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import {addScene} from "@root/src/containers/scripts/initial-state";
import {Popup} from "@root/src/components/popup";
import {addShootingDay} from "@root/src/containers/shooting_days/initial-state";
import {ListView} from "@components/list-view";
import './index.scss';

export const LocationsTab: React.FunctionComponent = () => {
	const [fields, setFields] = React.useState(['name', 'location', 'address', 'scene_cost', 'comments', 'geolocation'])
	const dispatch = useDispatch();
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const shootingDaysWithNumbers = shootingDays.map((shootingDay, index) => ({
		...shootingDay,
		dayNumber: index + 1,
	}));

	return (
		<div>
			{shootingDaysWithNumbers.map((data, index) => {
				const scenesWithUniquePlaces = data.shooting_day.total_scenes.filter((elem, index, self) =>
					index === self.findIndex((t) => (
						t.name === elem.name
					))
				);

				return (
					<ListView
						disableAddNew
						key={index}
						fields={fields}
						setFields={setFields}
						id={data.id}
						type={TableType.LOCATIONS}
						index={index}
						list={data}
						category={`${data.dayNumber}. ${data.date ? moment(data.date).format('D MMMM') : 'No date'}`}
						rows={scenesWithUniquePlaces}
					/>
				)
			})}
		</div>
	)
};

export default LocationsTab;
