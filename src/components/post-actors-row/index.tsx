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

export const PostActorsRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const [isPickupPopupOpen, setPickupPopupOpen] = React.useState(false);
	const [isSitePopupOpen, setSitePopupOpen] = React.useState(false);
	const [isEndTimePopupOpen, setEndTimePopupOpen] = React.useState(false);

	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { sdId, data, index, fields, onChange, onBlur, onKeyPress } = props;
	const state = useSelector((state: RootStore) => state)
	const events:Event[] =  state.events
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const shootingDays = useSelector((state: RootStore) => state.shootingDays)
	const allSuppliers = useSelector((state: RootStore) => state.suppliers)
	const ActorsRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex == 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);
	const shootingDayActors = shootingDays.find(shootingDay => shootingDay.id === sdId).actors;
	const [currentActor, setCurrentActor] = React.useState(shootingDayActors.find(actor => actor.id === data.supplier_id));
	const isReadonly = (field: string): boolean => ['supplier_name', 'actor_name','characters', 'site', 'end_time'].includes(field);
	const isOptions = (field: string): boolean => [''].includes(field);
	const isNumber = (field: string): boolean => ['hours','extra_hours'].includes(field);
	// const isTime = (field: string): boolean => ['pickup', 'pickup', 'site', 'end_time'].includes(field);
	const isTime = (field: string): boolean => [].includes(field);

	React.useEffect(()=> {
		setCurrentActor( shootingDayActors.find(actor => actor.id === data.supplier_id) )
	},[shootingDays]);

	const defaultShootingStartTime = activeEvent.params.filter(param => param.type === 'shooting_hours')[0].inside.start;
	const defaultShootingEndTime = activeEvent.params.filter(param => param.type === 'shooting_hours')[0].inside.end;
	const defaultDuration = defaultShootingEndTime ? moment.duration(moment(defaultShootingEndTime, "HH:mm").diff(moment(defaultShootingStartTime, "HH:mm"))) : 0;
	const defaultWorkingHours = parseInt(defaultDuration.asHours());

	const startTime = currentActor?.site ? moment(currentActor.site, "HH:mm") : moment(defaultShootingStartTime, "HH:mm");
	const endTime = currentActor?.end_time ? moment(currentActor.end_time, "HH:mm") : moment(defaultShootingEndTime, "HH:mm");

	const duration = endTime ? moment.duration(endTime.diff(startTime)) : 0;
	const workingHours = parseInt(duration.asHours());

	const extraHours = workingHours > defaultWorkingHours
		? workingHours - defaultWorkingHours
		: 0;

	return (
		<div
			className={classnames("n-row position-relative d-flex mb-02", {
				'disabled-row': !currentActor,
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
				if (field === 'pickup' || field === 'site' || field === 'end_time') {
					if (!(data as any)[field]) {
						if (field === 'site') {
							value = currentActor?.site ? currentActor.site : defaultShootingStartTime;
						} else if (field === 'pickup') {
							value = currentActor?.pickup ? currentActor.pickup : '';
						} else {
							value = currentActor?.end_time ? currentActor.end_time : defaultShootingEndTime;
						}
					} else {
						value = (data as any)[field]
					}
				} else if (field == 'characters' && data) {
					value = (data as any)['character_name'].toString();
				} else if (field == 'actor_name' && data && currentActor?.supplier_name) {
					value = currentActor.supplier_name;
				} else if (field == 'hours' && currentActor) {
					value = workingHours ? workingHours : '';
				} else if (field == 'extra_hours' && currentActor) {
					value = extraHours;
				} else {
					value = (data as any)[field]
				}

				const handleChange = value => {
					if ( !isOptions(field) ) {
						onChange(value, currentActor.id, field)
					} else {
						onChange(value, currentActor.id, field)
					}
				};

				const timepickerChangeValue = value => {
					onChange(value, currentActor?.id, field);
					onBlur(value, currentActor?.id, field);
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
								? (value: any) => onBlur(value, currentActor.id, field)
								: () => {}
							}
							inputRef={index === 0 ? inputRef : null}
							isReadOnly={isReadonly(field)}
							classnames={
								(field === 'pickup' || field === 'site' || field === 'end_time')
									? ['width-10-rem timepicker-wrap']
									: ['width-10-rem']
							}
							invalid={isOptions(field) ? field == 'status' ? false ? Boolean(filteredOptions(statusOptions, field, props.data[field]).length) : false : false : false}
						>
							{ field === 'pickup' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options position-relative">
										<div onClick={()=> setPickupPopupOpen(!isPickupPopupOpen)}>
											<Icon src={config.iconsPath+"options/clock.svg"}/>
										</div>
										<Timepicker
											value={value}
											changeValue={timepickerChangeValue}
											onOutsideClick={(): void => setPickupPopupOpen(false)}
											isOpen={isPickupPopupOpen}
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
											value={value}
											changeValue={timepickerChangeValue}
											onOutsideClick={(): void => setSitePopupOpen(false)}
											isOpen={isSitePopupOpen}
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
											value={value}
											changeValue={timepickerChangeValue}
											onOutsideClick={(): void => setEndTimePopupOpen(false)}
											isOpen={isEndTimePopupOpen}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
						</NewCell>
						</>
					</InputGroup>
				)})
			}
			{!props.disableDelete ? (
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
						<XCircle
							className="n-btn-delete mr-1 mb-1"
							size={20}
							onClick={
								(): void => data.character_id ? props.onDelete(data.character_id) : props.onDelete(data.id)
							}/>
					</div>
				</div>
			): null}
		</div>
	);
};

export default PostActorsRow;
