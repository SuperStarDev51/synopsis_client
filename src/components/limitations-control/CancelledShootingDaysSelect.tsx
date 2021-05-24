import * as React from 'react';
import * as moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Flatpickr from "react-flatpickr";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
} from "reactstrap"
import {RootStore} from "@root/src/store";
import {addSupplierCategory} from "@root/src/containers/suppliers/initial-state";
import {addLimitations} from "@root/src/containers/scripts/initial-state";
import {LimitationsActionTypes} from "@root/src/containers/tasks/ListsReducer";
import {config} from "@root/src/config";
import { Icon } from '@components';

import './index.scss';
import Select from "react-select"
import {LimitationRow} from "@components/limitations-control/LimitationRow";
import { Timepicker } from "@components/timepicker/timepicker";

export const CancelledShootingDaysSelectedOption = ({ label, limitation, limitationId, shootingDays  }) => {
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] =  React.useState(false);
	const [isTimepickerStartOpen, setTimepickerStartOpen] = React.useState(false);
	const [isTimepickerEndOpen, setTimepickerEndOpen] = React.useState(false);
	const cancelledShootingDay = shootingDays.filter((sd) => limitation.date_from?.includes(sd.id))[0];

	return (
		<div style={{ display: "flex" }}>
			<div>{label}</div>
			<div
				className="limitations-cancelled-time zindex-5"
				style={{ height: '.8rem', width: '.8rem', marginLeft: '.3rem', position: 'relative' }}
			>
				<div onClick={() => setIsModalOpen(true)}>
					<Icon
						src={config.iconsPath + "script/duration_black.svg"}
						style={{ height: '.8rem', width: '.8rem', marginTop: '.11rem' }}
					/>
				</div>
				<Modal
					isOpen={isModalOpen}
					toggle={() => setIsModalOpen(false)}
					className="modal-dialog-centered modal-sm"
				>
					<ModalHeader toggle={() => setIsModalOpen(false)}>
						<span className="opacity-05">Cancelled time for </span>day&nbsp;
						<strong>
							{cancelledShootingDay?.date
								? `${cancelledShootingDay?.dayNumber}. ${moment(cancelledShootingDay?.date).format('D MMMM')}`
								: `${cancelledShootingDay?.dayNumber}`
							}
						</strong>
					</ModalHeader>
					<ModalBody className="mx-3 my-1">
						<div className="d-flex align-items-center">
							<div className="position-relative">
								<input
									type="text"
									className="form-control timepicker-wrap"
									value={limitation.time_start ? limitation.time_start : '00:00'}
								/>
								<div
									className="cancelled-time-input-icon"
									onClick={() => setTimepickerStartOpen(!isTimepickerStartOpen)}
								>
									<Icon src={config.iconsPath+"options/clock.svg"} />
								</div>

								<Timepicker
									value={limitation.time_start ? limitation.time_start : '00:00'}
									changeValue={(value) => {
										dispatch({
											type: LimitationsActionTypes.UPDATE_LIMITATION,
											payload: {
												limitation_id: limitationId,
												field: 'time_start',
												value: value
											}
										})
									}}
									isOpen={isTimepickerStartOpen}
									onOutsideClick={(): void => setTimepickerStartOpen(false)}
								/>
							</div>
							<span className="mx-1">-</span>
							<div className="position-relative">
								<input
									type="text"
									className="form-control timepicker-wrap"
									value={limitation.time_end ? limitation.time_end : '00:00'}
								/>
								<div
									className="cancelled-time-input-icon"
									onClick={() => setTimepickerEndOpen(!isTimepickerEndOpen)}
								>
									<Icon src={config.iconsPath+"options/clock.svg"} />
								</div>
								<Timepicker
									value={limitation.time_end ? limitation.time_end : '00:00'}
									changeValue={(value) => {
										dispatch({
											type: LimitationsActionTypes.UPDATE_LIMITATION,
											payload: {
												limitation_id: limitationId,
												field: 'time_end',
												value: value
											}
										})
									}}
									isOpen={isTimepickerEndOpen}
									onOutsideClick={(): void => setTimepickerEndOpen(false)}
								/>
							</div>
						</div>
					</ModalBody>
				</Modal>
			</div>
		</div>
	)
}

export const CancelledShootingDaysSelect = ({ limitation, limitationId, shootingDays }) => {
	const dispatch = useDispatch();
	const [isDatesSelectVisible, setDatesSelectVisible] = React.useState(false);
	const [isSelectMenuOpen, setSelectMenuOpen] = React.useState(false);

	const formatOptionLabel = ({ label }) =>
		<CancelledShootingDaysSelectedOption
			label={label}
			limitation={limitation}
			shootingDays={shootingDays}
			limitationId={limitationId}
		/>;

	return (
		<div className="limitations-cancelled-shooting-days">
			{isDatesSelectVisible ? (
				<div className="form-control d-flex align-items-center pl-05 p-0">
					<Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
					<Flatpickr
						placeholder="Select cancelled dates"
						className="bg-white no-border height-auto cursor-pointer p-0 font-medium-1"
						options={{mode: "range", altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", defaultDate: new Date()}}
						value={limitation.cancelled_date_range}
						onChange={date => {
							dispatch({
								type: LimitationsActionTypes.UPDATE_LIMITATION,
								payload: {
									limitation_id: limitationId,
									field: 'cancelled_date_range',
									value: date
								}
							})
						}}
					/>
				</div>
			) : (
				<Select
					isMulti
					closeMenuOnSelect={true}
					components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
					name="time"
					placeholder="Select shooting days"
					styles={{
						control: styles => ({ ...styles , fontWeight: 'bold', border: '1px solid #e0e0e0', backgroundColor: 'white!important' })
					}}
					menuPosition={'fixed'}
					className="ml-auto webkit-fill-available"
					classNamePrefix='Date from'
					value={limitation.date_from.length ?
						shootingDays.filter((sd) => limitation.date_from?.includes(sd.id)).map((item, index) => ({
						value: item.id,
						label: item.date
						? `${item.dayNumber}. ${moment(item.date).format('D MMMM')}`
						: `${item.dayNumber}. No date`
					})) : ''
					}
					onChange={(e: any) => {
						let shootingDaysFromIds = [];
						e?.forEach(item => shootingDaysFromIds.push(item.value));
						dispatch({
							type: LimitationsActionTypes.UPDATE_LIMITATION,
							payload: {
								limitation_id: limitationId,
								field: 'date_from',
								value: shootingDaysFromIds,
							}
						})
					}}
					onFocus={() => setSelectMenuOpen(true)}
					onBlur={() => setSelectMenuOpen(false)}
					menuIsOpen={isSelectMenuOpen}
					formatOptionLabel={formatOptionLabel}
					options={
						shootingDays.map((sd: any, sdi: number) => ({
							index: sdi,
							value: sd.id,
							label: sd.date
								? `${sd.dayNumber}. ${moment(sd.date).format('D MMMM')}`
								: `${sd.dayNumber}. No date`
						}))
					}
				/>
			)}
			<div className="limitations-dates-days-switcher">
				{isDatesSelectVisible ? (
					<div onClick={() => setDatesSelectVisible(false)}>Switch to shooting days</div>
				) : (
					<div onClick={() => setDatesSelectVisible(true)}>Switch to datepicker</div>
				)}
			</div>
		</div>
	)
};

export default CancelledShootingDaysSelect;
