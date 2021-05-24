import * as React from 'react';
import SVG from 'react-inlinesvg';
import classnames from "classnames"
import * as moment from 'moment';
import { filteredOptions ,timeStringToNumber, durationBetweenDates} from '../../helpers/helpers'
import { Event } from '@containers/planning/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell, CalendarComponent } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { Icon } from '@components';
import { config } from '../../config';
import { Timepicker } from "@components/timepicker/timepicker";

interface Props {
	readonly data: any;
	readonly sdId: any;
	readonly color: string;
	readonly index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: number |string) => void;
	readonly onKeyPress?: (id: number) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly fields: any;
}

export const PostEmployeesRow: React.FunctionComponent<Props> = (props: Props) => {
	const { sdId, data, index, fields, onChange, onBlur, onKeyPress } = props;
	const inputRef = React.useRef(null);
	const [isPickupPopupOpen, setPickupPopupOpen] = React.useState(false);
	const [isSitePopupOpen, setSitePopupOpen] = React.useState(false);
	const [isEndTimePopupOpen, setEndTimePopupOpen] = React.useState(false);

	const { formatMessage } = useIntl();
	const dispatch = useDispatch();

	const state = useSelector((state: RootStore) => state)
	const events:Event[] =  state.events
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const shootingDays = useSelector((state: RootStore) => state.shootingDays)
	const isReadonly = (field: string): boolean => ['supplier_name', 'actor_name','characters', 'pickup', 'site', 'end_time'].includes(field);
	const isOptions = (field: string): boolean => [''].includes(field);
	const isNumber = (field: string): boolean => ['hours','extra_hours'].includes(field);
	const isTime = (field: string): boolean => [].includes(field);

	const defaultShootingStartTime = activeEvent.params.filter(param => param.type === 'shooting_hours')[0].inside.start;
	const defaultShootingEndTime = activeEvent.params.filter(param => param.type === 'shooting_hours')[0].inside.end;
	const defaultDuration = defaultShootingEndTime ? moment.duration(moment(defaultShootingEndTime, "HH:mm").diff(moment(defaultShootingStartTime, "HH:mm"))) : 0;
	const defaultWorkingHours = parseInt(defaultDuration.asHours());

	const startTime = data.site ? moment(data.site, "HH:mm") : moment(defaultShootingStartTime, "HH:mm");
	const endTime = data.end_time ? moment(data.end_time, "HH:mm") : moment(defaultShootingEndTime, "HH:mm");

	const duration = endTime ? moment.duration(endTime.diff(startTime)) : 0;
	const workingHours = parseInt(duration.asHours());

	const extraHours = workingHours > defaultWorkingHours
		? workingHours - defaultWorkingHours
		: 0;

	return (
		<div
			className={classnames("n-row position-relative d-flex mb-02", {

			})}
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(index)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />
			{fields.map((field: string, field_index: number) => {
				let value;
				if (field === 'site' || field === 'end_time') {
					if (field === 'site') {
						value = data?.site ? data.site : defaultShootingStartTime;
					} else {
						value = data?.end_time ? data.end_time : defaultShootingEndTime;
					}
				} else if (field === 'supplier_job_title') {
					value = data?.supplier_job_title_name ? data?.supplier_job_title_name : '';
				} else if (field === 'hours') {
					value = workingHours ? workingHours : '';
				} else if (field === 'extra_hours') {
					value = extraHours;
				} else {
					value = (data as any)[field]
				}

				const handleChange = value => {
					if ( !isOptions(field) ) {
						onChange(value, data.id, field)
					} else {
						onChange(value, data.id, field)
					}
				};

				const timepickerChangeValue = value => {
					onChange(value, data.id, field);
					onBlur(value, data.id, field)
				};

				return (
					<InputGroup key={field_index} style={{flexWrap: 'unset'}}>
						<>
						<NewCell
							id={index}
							key={field_index}
							type={
								 isTime(field) ? 'time' : isNumber(field) ? 'number' : 'string'
								//isTime(field) ? 'string' : isNumber(field) ? 'number' : 'string'
							}
							value={value}
							field={field}
							prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
							suffix={['fee'].includes(field) ? '%' : ''}
							onChange={value=> handleChange(value)}
							onBlur={!isOptions(field) || !isReadonly(field)
								? (value: any) => onBlur(value, data.id, field)
								: () => {}
							}
							inputRef={index === 0 ? inputRef : null}
							isReadOnly={isReadonly(field)}
							classnames={(field === 'pickup' || field === 'site' || field === 'end_time') ? ['width-10-rem timepicker-wrap'] : ['width-10-rem']}
							invalid={isOptions(field) ? field == 'status' ? false ? Boolean(filteredOptions(statusOptions, field, props.data[field]).length) : false : false : false}
						>
							{ field === 'pickup' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options position-relative">
										<div onClick={()=> setPickupPopupOpen(!isPickupPopupOpen)}>
											<Icon src={config.iconsPath+"options/clock.svg"}/>
										</div>
										<Timepicker
											value={value ? value : ''}
											changeValue={timepickerChangeValue}
											isOpen={isPickupPopupOpen}
											onOutsideClick={(): void => setPickupPopupOpen(false)}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
							{ field === 'site' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options position-relative">
										<div onClick={()=> setSitePopupOpen(!isSitePopupOpen)}>
											<Icon src={config.iconsPath+"options/clock.svg"}/>
										</div>
										<Timepicker
											value={value ? value : ''}
											changeValue={timepickerChangeValue}
											isOpen={isSitePopupOpen}
											onOutsideClick={(): void => setSitePopupOpen(false)}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
							{ field === 'end_time' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options position-relative">
										<div onClick={()=> setEndTimePopupOpen(!isEndTimePopupOpen)}>
											<Icon src={config.iconsPath+"options/clock.svg"}/>
										</div>
										<Timepicker
											value={value ? value : ''}
											changeValue={timepickerChangeValue}
											isOpen={isEndTimePopupOpen}
											onOutsideClick={(): void => setEndTimePopupOpen(false)}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
						</NewCell>
						</>
					</InputGroup>
				)})
			}
			{/*{!props.disableDelete ? (*/}
				{/*<div className="fonticon-container">*/}
					{/*<div className="fonticon-wrap width-0 height-auto">*/}
						{/*<XCircle*/}
							{/*className="n-btn-delete mr-1 mb-1"*/}
							{/*size={20}*/}
							{/*onClick={*/}
								{/*(): void => data.character_id ? props.onDelete(data.character_id) : props.onDelete(data.id)*/}
							{/*}/>*/}
					{/*</div>*/}
				{/*</div>*/}
			{/*): null}*/}
		</div>
	);
};

export default PostEmployeesRow;
