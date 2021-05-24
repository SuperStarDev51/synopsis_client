import * as React from 'react';
import classnames from "classnames"
import { filteredOptions } from '../../helpers/helpers'
import { Event } from '@containers/planning/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell } from '@components';
import { LocationMapPopover } from '@src/components/CallsheetPropPopover/index.tsx';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { Icon } from '@components';
import { config } from '../../config';
import {XCircle} from "react-feather";
import moment = require("moment");
import { SceneTakesPopover } from '@src/components/SceneTakesPopover/index.tsx';
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import {addScene} from "@root/src/containers/scripts/initial-state";
import * as shootingDaysActions from "../../redux/actions/shooting-days";
import * as scenesBreakdownActions from "../../redux/actions/scenes-breakdown"

interface Props {
	readonly activeShootingDayId: any;
	readonly data: any;
	readonly color: string;
	readonly index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: number |string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly fields: any;
}

export const PostScenesRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, index, fields, onChange, onBlur, onKeyPress, activeShootingDayId } = props
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0]);
	const [isStatusPopupOpen, setIsStatusPopupOpen] = React.useState<boolean>(false);
	const [isReschedulePopupOpen, setIsReschedulePopupOpen] = React.useState<boolean>(false);
	const [isActiveTakesPopover, setActiveTakesPopoverId] = React.useState();
	const [takesFields, setTakesFields] = React.useState(['take', 'camera_angle', 'camera_card', 'sound_card', 'comments']);

	const getShootingDayDateById = id => moment(shootingDays.find(shootingDay => shootingDay.id === id).date).format('D MMMM');
	const statusOptions = [
		{scene_status_id: 1, scene_status_name: formatMessage({id: 'done'})},
		{scene_status_id: 2, scene_status_name: formatMessage({id: 'partial'})},
		{scene_status_id: 3, scene_status_name: formatMessage({id: 'not_shoot'})}
	];
	const isRescheduleShown = (statusId: number): boolean => [2,3].includes(statusId);
	const isReadonly = (field: string): boolean => ['scene_id', 'status', 'reschedule'].includes(field);
	const isOptions = (field: string): boolean => ['status', 'reschedule'].includes(field);
	const isNumber = (field: string): boolean => ['raw_time', 'screen_time'].includes(field);
	const isText = (field: string): boolean => ['scene_id', 'script_pages', 'camera_card', 'sound_card', 'comments'].includes(field);

	const rescheduledSceneStyle = data.new_shooting_day_id ? {border: '2px solid red'} : null;

	const setUpdatedTakes = takes => {
		dispatch(shootingDaysActions.setShootingDaySceneParameter(data.scene_id, 'takes', takes));
		dispatch(scenesBreakdownActions.setSceneParameter(data.scene_id, 'takes', takes));
	};
	const setUpdatedTakesTitles = takesTitles => {
		dispatch(shootingDaysActions.setShootingDaySceneParameter(data.scene_id, 'takes_titles', takesTitles));
		dispatch(scenesBreakdownActions.setSceneParameter(data.scene_id, 'takes_titles', takesTitles));
	};

	return (
		<div
			style={rescheduledSceneStyle}
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(index)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />
			{fields.map((field: string) => {
				let value;
				if (field === 'status') {
					value = statusOptions.find(statusOption => statusOption.scene_status_id === data.scene_status_id)?.scene_status_name;
				} else if (field === 'reschedule') {
					if ( data.new_shooting_day_id ) {
						value = getShootingDayDateById(data.new_shooting_day_id);
					} else {
						value = (data as any).shooting_day_id_to == 0 || (data as any).shooting_day_id_to == activeShootingDayId
							? ''
							: (data as any).shooting_day_id_to;
					}
				} else {
					value = (data as any)[field];
				}

				const updatedShootingDays = [];
				shootingDays.map((item, index) => ({...item, day_number: index + 1})).forEach(item => {
					if (item.id > activeShootingDayId) {
						updatedShootingDays.push(item)
					}
				});

				return (
					<InputGroup key={`${data.scene_id}-${field}`} style={{flexWrap: 'unset'}}>
						<>
						<NewCell
							id={index}
							type={isNumber(field) ? 'number' : isText(field) ? 'string' :  !isOptions(field) ?  'time' : 'string'}
							value={value}
							field={field}
							prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
							suffix={['fee'].includes(field) ? '%' : ''}
							onChange={!isOptions(field)
								? (value:any)=> onChange(value, data.scene_id,field)
								: (value:any)=> {
									onChange(value, data.scene_id, field);
									if( field == 'status' ) setIsStatusPopupOpen(true)
								}
							}
							onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, index, field) : ()=>{}}
							inputRef={index === 0 ? inputRef : null}
							isReadOnly={isReadonly(field)}
							classnames={field === 'reschedule' ? ['width-15-rem'] : ['width-10-rem']}
							invalid={isOptions(field) ? field == 'status' ? false ? Boolean(filteredOptions(statusOptions,field, props.data[field]).length) : false : false: false}
						>
							{field === 'scene_id' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options">
										<div
											id={`target-${data.scene_id}`}
											className="text-primary-imgn underline cursor-pointer"
											onClick={() => {
												setActiveTakesPopoverId(`target-${data.scene_id}`)
											}}
										>
											Takes
										</div>

										<SceneTakesPopover
											sceneId={data.scene_id}
											target={`target-${data.scene_id}`}
											isOpen={isActiveTakesPopover === `target-${data.scene_id}`}
											propIndex={index}
											takesTitles={data.takes_titles || {}}
											takes={data.takes}
											fields={takesFields}
											updateColumnTitleDispatch={(title, value) => {
												let updatedTitles = data.takes_titles ? {...data.takes_titles, [title]: value} : {[title]: value};
												setUpdatedTakesTitles(updatedTitles);
											}}
											addColumnDispatch={() => {
												setUpdatedTakesTitles();
											}}
											deleteColumnDispatch={(title, sceneId) => {
												// console.log('title', title)
												// console.log('sceneId', sceneId)
												// console.log('data: ', data)
												// console.log('takesFields', takesFields)

												let filteredTextFields = takesFields.filter(item => item !== title)
												setTakesFields(filteredTextFields)
												//setUpdatedTakesTitles();
											}}
											setFields={setTakesFields}
											onChange={(takeIndex, field, value) => {
												let updatedTakes = data.takes.map((take, index) => {
													if (index !== takeIndex) {
														return take;
													}
													return {
														...take,
														[field]: value,
													}
												});
												setUpdatedTakes(updatedTakes);
											}}
											onDelete={(rowIndex) => {
												let updatedTakes = data.takes?.filter((take, index) => index !== rowIndex);
												setUpdatedTakes(updatedTakes);
											}}
											onAdd={() => {
												let newTake = {
													take: '',
													camera_angle: '',
													camera_card: '',
													sound_card: '',
													comments: '',
												};
												let updatedTakes = data.takes ? [...data.takes, newTake] : [newTake];

												setUpdatedTakes(updatedTakes);
											}}
											onBlur={() => {
												console.log('data', data)
												console.log('data.takes', data.takes)
												// let scene = {
												// 	chapter_number: data.chapter_number,
												// 	project_id: activeEvent.id,
												// 	takes: data.takes,
												// 	scene_number: propItem.sceneNumber,
												// };
                                                //
												// addScene(scene);
											}}
											onClose={() => setActiveTakesPopoverId(null)}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
							{field === 'status' ? (
								<InputGroupAddon addonType="append">
								<InputGroupText className="options">
									<div onClick={() => {setIsStatusPopupOpen(!isStatusPopupOpen)}}
										 className={`${isStatusPopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
									</div>
									<Popup
										isOpen={isStatusPopupOpen}
										onClick={(): void => {return;}}
										options={statusOptions.length ? statusOptions.map((option: any) => ({
											disabled: false,
											text: option.scene_status_name,
											action: (): void => {
												setIsStatusPopupOpen(false);
												onChange(option.scene_status_id, data.scene_id, field);
												onBlur(option.scene_status_id, index, field)
											}
										})): []}
										onOutsideClick={(): void => setIsStatusPopupOpen(false)}
									/>
								</InputGroupText>
							 </InputGroupAddon>
							) : null}

							{field === 'reschedule' && isRescheduleShown(data.scene_status_id) ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options">
										<button
											className={classnames("btn p-05", {
												'btn-primary': data.shooting_day_id_to === 0,
												'btn-outline-primary': data.shooting_day_id_to !== 0
											})}
											onClick={() => {
												let shootingDayIdTo;
												if (data.shooting_day_id_to === 0) {
													shootingDayIdTo = activeShootingDayId
												} else {
													shootingDayIdTo = 0
												}
												onChange(shootingDayIdTo, data.scene_id, 'shooting_day_id_to');
												onBlur(shootingDayIdTo, index, 'shooting_day_id_to')
											}}
										>
											Auto
										</button>
										<div onClick={() => {setIsReschedulePopupOpen(!isReschedulePopupOpen)}}
											 className={`${isReschedulePopupOpen ? ' popup-open' : ''}`}>
											<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
										</div>

										<Popup
											className="position-left-auto position-right-0"
											isOpen={isReschedulePopupOpen}
											onClick={(): void => {
												return;
											}}
											options={updatedShootingDays.length ? updatedShootingDays.map((shootingDay: any, index: number) => ({
												disabled: false,
												text: shootingDay.date
													? (shootingDay.day_number + '. ' + moment(shootingDay.date).format('D MMMM'))
													: (shootingDay.day_number + '. ' + 'No date'),
												action: (): void => {
													onChange(shootingDay.id, data.scene_id, 'new_shooting_day_id');
													onBlur(shootingDay.id, index, 'shooting_day_id_to')
													setIsReschedulePopupOpen(false);
												}
											})): []}
											onOutsideClick={(): void => setIsReschedulePopupOpen(false)}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
						</NewCell>
						</>
					</InputGroup>
				)
			})}

			{!props.disableDelete ? (
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
						<XCircle
							className="n-btn-delete mr-1 mb-1"
							size={20}
							onClick={
								(): void => props.onDelete(data.scene_id)
							}/>
					</div>
				</div>
			): null}

		</div>
	);
};

export default PostScenesRow;
