import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
const cloneDeep = require('lodash/cloneDeep');
import {RootStore} from "@root/src/store";
import moment = require("moment");
import {moveScenesBetweenShootingDays} from "@root/src/containers/shooting_days/initial-state";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";

export const MoveToShootingDay: React.FunctionComponent = ({ sd, activeEvent, projectSceneId, setReorerd, isListPreview }) => {
	const dispatch = useDispatch();
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const availableShootingDays = shootingDays?.map((item, index) => ({...item, dayNumber: index + 1})).filter(item => item.id !== sd.id);

	const reorderShootingDaysAfterMoving = (projectSceneId, shootingDayIdFrom, shootingDayIdTo) => {
		const movingScene = {};

		const updatedShootingDays = shootingDays.map(item => {
			if (item.id !== shootingDayIdFrom) {
				return item
			}
			return {
				...item,
				shooting_day: {
					...item.shooting_day,
					total_scenes: item.shooting_day.total_scenes?.filter(scene => {
						if (scene.project_scene_id === projectSceneId) {
							movingScene = cloneDeep(scene)
						}

						return scene.project_scene_id !== projectSceneId
					})
				}
			}
		}).map(item => {
			if (item.id !== shootingDayIdTo) {
				return item
			}
			return {
				...item,
				shooting_day: {
					...item.shooting_day,
					total_scenes: [
						movingScene,
						...item.shooting_day.total_scenes,
					]
				}
			}
		});

		dispatch({
			type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
			payload: updatedShootingDays
		});
		setReorerd && setReorerd(false);
	};

	return (
		<div>
			<select
				style={{borderColor: 'transparent', backgroundColor: 'transparent'}}
				onChange={(e) => {
					const shootingDayIdFrom = sd.id;
					const shootingDayIdTo = parseInt(e.target.value);

					reorderShootingDaysAfterMoving(projectSceneId, shootingDayIdFrom, shootingDayIdTo);

					moveScenesBetweenShootingDays({
						project_id: activeEvent.id,
						project_scene_id: projectSceneId,
						project_shooting_day_id_from: shootingDayIdFrom,
						project_shooting_day_id_to: shootingDayIdTo,
					});
				}}
			>

				<option value="">{isListPreview ? 'Move scene to' : ''}</option>
				{availableShootingDays.map((shootingDay, index) => (
					<option key={shootingDay.id} value={shootingDay.id}>
						{shootingDay.dayNumber}. {shootingDay.date ? moment(shootingDay.date).format('D MMM') : 'No date'}
					</option>
				))}
			</select>
		</div>
	)
};

export default MoveToShootingDay;

