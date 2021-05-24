import * as React from 'react';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import Flatpickr from "react-flatpickr";
import {RootStore} from "@root/src/store";
import {addSupplierCategory} from "@root/src/containers/suppliers/initial-state";
import {addLimitations} from "@root/src/containers/scripts/initial-state";
import {LimitationsActionTypes} from "@root/src/containers/tasks/ListsReducer";
import {XCircle} from "react-feather";
import {config} from "@root/src/config";
import { Icon } from '@components';
import { useIntl } from "react-intl"

import './index.scss';
import Select from "react-select"
import {CancelledShootingDaysSelect} from "@components/limitations-control/CancelledShootingDaysSelect";

export const LimitationRow = ({ shootingDays, limitation, limitationId, actors, isOther, activeEvent }): React.ReactElement<HTMLButtonElement> => {
	const dispatch = useDispatch();
	const [isDateAutoSelect, setIsDateAutoSelect] = React.useState(false);
	const { formatMessage } = useIntl();

	return (
		<div id={limitationId} className="limitation-item row mb-05 position-relative pr-2">
			{isOther
				? (<div className="col-md-4 pr-05">
						<input
							type="text"
							className="form-control"
							placeholder="Type reason..."
							value={limitation.reason}
							onChange={(e) => {
								dispatch({
									type: LimitationsActionTypes.UPDATE_LIMITATION,
									payload: {
										limitation_id: limitationId,
										field: 'reason',
										value: e.target.value,
									}
								})
							}}
						/>
					</div>)
				: (
					<div className="col-md-3 pr-05">
						<Select
							closeMenuOnSelect={false}
							components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
							name="time"
							placeholder={formatMessage({ id: 'select' })}
							styles={{
								control: styles => ({ ...styles , fontWeight: 'bold', border: '1px solid #e0e0e0', backgroundColor: 'white!important' })
							}}
							menuPosition={'fixed'}
							className="ml-auto webkit-fill-available"
							classNamePrefix='Date from'
							value={{
								value: limitation.supplier_id,
								label: actors?.find(item => item.supplier_id == limitation?.supplier_id)?.supplier_name
							}}
							onChange={(e: any) => {
								dispatch({
									type: LimitationsActionTypes.UPDATE_LIMITATION,
									payload: {
										limitation_id: limitationId,
										field: 'supplier_id',
										value: e.value
									}
								})
							}}
							options={
								actors.map((actor: any, actorIndex: number) => ({
									index: actorIndex,
									value: actor.supplier_id,
									label: actor.supplier_name
								}))
							}
						/>
					</div>
				)
			}
			<div className="pr-05 pl-05 col-md-4">
				<CancelledShootingDaysSelect
					limitation={limitation}
					limitationId={limitationId}
					shootingDays={shootingDays}
				/>
			</div>
			{!isOther ? (
				<div className="col-md-2 pl-05">
					<input
						value={limitation.max_days}
						type="number"
						className="form-control"
						onChange={e => {
							dispatch({
								type: LimitationsActionTypes.UPDATE_LIMITATION,
								payload: {
									limitation_id: limitationId,
									field: 'max_days',
									value: e.target.value,
								}
							})
						}}
					/>
				</div>
			):null}
			<div
				className={classnames("pl-05",{
					"col-md-4": isOther,
					"col-md-3 pr-05": !isOther
				})}
			>
				<div className="form-control d-flex align-items-center pl-05 p-0">
					<Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
					{!isDateAutoSelect
						? <Flatpickr
							placeholder="First shooting day"
							className="bg-white width-100 no-border height-auto cursor-pointer p-0 font-medium-1"
							value={limitation.date_to ? limitation.date_to : new Date()}
							options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", defaultDate: new Date()}}
							onChange={date => {
								dispatch({
									type: LimitationsActionTypes.UPDATE_LIMITATION,
									payload: {
										limitation_id: limitationId,
										field: 'date_to',
										value: date
									}
								})
							}}
						/>
						: 'Automatic selection'
					}

					{!isOther
						? <button
							className={classnames("btn px-0 width-50 ml-auto",{
								"btn-primary": isDateAutoSelect,
								"btn-secondary": !isDateAutoSelect
							})}
							onClick={() => setIsDateAutoSelect(!isDateAutoSelect)}
						>
							Auto
						</button>
						: null}
				</div>
			</div>
			<div
				className="limitation-item__delete"
				onClick={() => {
					dispatch({
						type: LimitationsActionTypes.DELETE_LIMITATION,
						payload: { limitation_id: limitationId }
					})
				}}
			>
				<XCircle
					className="cursor-pointer"
					size={20}
				/>
			</div>
		</div>
	)
}

export default LimitationRow;
