import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
const cloneDeep = require('lodash/cloneDeep');
import {RootStore} from "@root/src/store";
import moment = require("moment");
import { Timepicker } from "@components/timepicker/timepicker";
import {moveScenesBetweenShootingDays} from "@root/src/containers/shooting_days/initial-state";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";

export const SceneTimeInput: React.FunctionComponent = ({ sd, activeEvent, projectSceneId, value, timepickerChangeValue }) => {
	const dispatch = useDispatch();
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const [isTimepickerOpen, setTimepickerOpen] = React.useState(false)

	return (
		<div className="position-relative width-50 d-inline-block">
			<input
				type="text"
				className="bg-transparent border-0 w-100 text-blue5"
				value={moment(value).format('HH:mm')}
				onClick={(): void => setTimepickerOpen(true)}
			/>
			<Timepicker
				value={moment(value).format('HH:mm')}
				changeValue={timepickerChangeValue}
				isOpen={isTimepickerOpen}
				onOutsideClick={(): void => setTimepickerOpen(false)}
			/>
		</div>
	)
};

export default SceneTimeInput;

