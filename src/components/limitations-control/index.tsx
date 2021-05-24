import * as React from 'react';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import {RootStore} from "@root/src/store";
import {addSupplierCategory} from "@root/src/containers/suppliers/initial-state";
import {addLimitations} from "@root/src/containers/scripts/initial-state";
import {LimitationsActionTypes} from "@root/src/containers/tasks/ListsReducer";
import {config} from "@root/src/config";
import { Icon } from '@components';
import './index.scss';

import {LimitationRow} from "@components/limitations-control/LimitationRow";

// limitation: [{
// 	supplier_id: 1,
// 	date_from: '',
// 	date_to: '',
// 	reason: 'sick'
// }, {
// 	supplier_id: 2,
// 	date_from: '',
// 	date_to: '',
// 	reason: 'absence'
// }, {
// 	supplier_id: 0,
// 	date_from: '',
// 	date_to: '',
// 	reason: 'rain'
// }]

export const LimitationsControl = ({ activeEvent, shootingDays, actors, suppliers, closeLimitations }): React.ReactElement<HTMLButtonElement> => {
	const dispatch = useDispatch();
	const limitations = useSelector((state: RootStore) => state.limitations);

	const actorsLimitations = limitations && limitations.filter(limitation => limitation.supplier_id !== 0);
	const othersLimitations = limitations && limitations.filter(limitation => limitation.supplier_id === 0);

	const shootingDaysWithNumbers = shootingDays.map((shootingDay, index) => ({
		...shootingDay,
		dayNumber: index + 1,
	}));
	const daysForCharacters = (shootingDays, characterId) => shootingDays.filter(shootingDay => shootingDay.characters.find(character => character.character_id === characterId));

	// (project_id:number, limitations:any)
	const updateLimitations = () => {
		addLimitations(activeEvent.id, limitations);
	};

	return (
		<div className="limitations-control box-shadow-6">
			<div className="py-2 px-1">
				<div className="row">
					{/*ACTORS LIMITATIONS*/}
					<div className="col-md-7">
						<h4 className="mb-1 text-bold-600">Actors limitations</h4>
						<div className="row mb-05">
							<div className="col-md-3 pr-05">
								Name
							</div>
							<div className="col-md-4 pl-05">
								Cancelled shooting day
							</div>
							<div className="col-md-2 pl-05 pr-05">
								Max days
							</div>
							<div className="col-md-3 pl-05">
								New shooting day
							</div>
						</div>

						{actorsLimitations && actorsLimitations.map((limitation) => (
							<LimitationRow
								key={limitation.limitation_id}
								actors={actors}
								activeEvent={activeEvent}
								shootingDays={shootingDaysWithNumbers}
								limitation={limitation}
								limitationId={limitation.limitation_id}
							/>
						))}
						<button
							className="btn opacity-08 pl-0"
							onClick={() => {
								dispatch({
									type: LimitationsActionTypes.ADD_LIMITATION,
									payload: {
										limitation_id: uuidv4(),
										supplier_id: '',
										date_from: '',
										date_to: '',
										reason: ''
									}
								})
							}}
						>+ add</button>
					</div>

					{/*OTHER LIMITATIONS*/}
					<div className="col-md-5">
						<h4 className="mb-1 text-bold-600">Other limitations</h4>
						<div className="row mb-05">
							<div className="col-md-4 pr-05">Reason</div>
							<div className="col-md-4 pr-05 pl-05">Cancelled shooting day</div>
							<div className="col-md-4 pl-05">New shooting day</div>
						</div>

						{othersLimitations && othersLimitations.map((limitation, index) => (
							<LimitationRow
								isOther
								key={index}
								activeEvent={activeEvent}
								actors={actors}
								shootingDays={shootingDaysWithNumbers}
								limitation={limitation}
								limitationId={limitation.limitation_id}
							/>
						))}
						<button
							className="btn opacity-08 pl-0"
							onClick={() => {
								dispatch({
									type: LimitationsActionTypes.ADD_LIMITATION,
									payload: {
										limitation_id: uuidv4(),
										supplier_id: 0,
										date_from: '',
										date_to: '',
										reason: ''
									}
								})
							}}
						>+ add</button>
					</div>
					<div className="col-12 d-flex align-items-end justify-content-end">
						<button
							className="btn btn-primary"
							onClick={updateLimitations}
						>
							Update
						</button>
					</div>
				</div>
			</div>
			<div
				className="btn btn-sm width-100-per bg-gray bg-light-gray-3 d-flex justify-content-center"
				onClick={closeLimitations}>
				<Icon src={config.iconsPath + "options/dropdown-up.svg"} />
			</div>
		</div>
	)
};

export default LimitationsControl;
