import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import classnames from 'classnames';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell, CalendarComponent } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import {  addSupplierUnitType } from '@containers/suppliers/initial-state';
import {CharactersActionTypes, SupplierUnitTypesActionTypes} from '@src/containers/tasks/ListsReducer';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { Icon } from '@components';
import { config } from '../../config';
import {addCharacter} from "@root/src/containers/scripts/initial-state";

interface Props {
	readonly data: Supplier;
	readonly color: string;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly fields: any;
	readonly titles?: any;
}

export const TeamExtraHours: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, fields, titles, onChange, onBlur, onKeyPress } = props
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0]);
	const allSuppliers = useSelector((state: RootStore) => state.suppliers)
	const ActorsRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex == 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);
	const characters = useSelector((state: RootStore) => state.characters);
	let supplierCharacters = characters && characters.length ?  characters.map(c=> {if(c.supplier_id == data.id) return c.character_name}).filter(a=>a) : []

	const [isTypePopupOpen, setIsTypePopupOpen] = React.useState(false);
	const [dates, setDates] = React.useState([ new Date(data.start_date) ,new Date(data.end_date)]);
	const supplierUnitTypes = useSelector((state: RootStore) => state.supplierUnitTypes);
	const [unitTypes, setUnitTypes] = React.useState([...supplierUnitTypes, {supplier_unit_type:formatMessage({id: 'add_new'})}]);
	const isReadonly = (field: string): boolean => ['actors_name', 'supplier_name', 'characters', 'supplier_job_title', 'percentage1', 'percentage2', 'percentage3', 'number_of_working_days', 'total'].includes(field);
	const isOptions = (field: string): boolean => ['date', 'supplier_unit_type'].includes(field);

	// const handleRowEmailIconClick = () => {
	// 	setIsEmailIconActive(!isEmailIconActive);
	// };

	const shootingDays = useSelector((state: RootStore) => state.shootingDays);

	let shootingDaysNumber = 0;

	if (data.supplier_category === "Actors") {
		const daysForCharacters = (shootingDays, characterId) => shootingDays.filter(shootingDay => {
			return shootingDay.characters.find(character => {
				return character.character_id === characterId
			})
		});

		let daysForCharactersArr = [];
		data && data.characters && data.characters.forEach(item => {
			daysForCharactersArr = [...daysForCharactersArr, ...daysForCharacters(shootingDays, item.id)]
		});

		const uniqueDays = new Set();
		for (const day of daysForCharactersArr) {
			uniqueDays.add(day.id)
		}

		shootingDaysNumber = uniqueDays.size;
	} else {
		shootingDaysNumber = shootingDays.filter(shootingDay => shootingDay.suppliers.find(supplier_id => supplier_id === data.supplier_id)).length;
	}

	const total = data.supplier_unit_cost * shootingDaysNumber;

	const getActor = supplierId => actors.find(actor => actor.id === supplierId);

	return (
		<div
			className={
				classnames("n-row position-relative d-flex mb-02", {
					'disabled-row': data.supplier_id == 0
				})
			}
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(data.id)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, index: number) => {
				const handleChange = value => {
					if ( !isOptions(field) ) {
						if (field == 'supplier_unit_cost') {
							if (data.supplier_category) {
								onChange(value, data.id, {field, category: data.supplier_category})
							} else {
								onChange(value, getActor(data.supplier_id).id, {field, category: 'Actors'})
							}

						} else {
							onChange(value, data.id, field)
						}
					} else {
						onChange(value, data.id, field)
					}

					if (field == 'supplier_unit_type') {
						setIsTypePopupOpen(true)
					}
				};

				return <InputGroup>
					{field == 'date' ?
						<CalendarComponent
							flatpickr
							range
							className='sqaure form-control pr-0 width-10-rem border-color-white border-left'
							onChange={(dates: any): void => {
								setDates(dates)
								let start_date = dates[0] ? dates[0] : undefined
								let end_date = dates[1] ? dates[1] : undefined
								onChange(end_date, data.id, 'end_date');
								onChange(start_date, data.id, 'start_date');
								if (start_date && end_date) {
									onBlur(start_date, data.id, 'start_date')
									onBlur(end_date, data.id, 'end_date')
								}
							}}
						// placeholder={activeEvent.date ? `${activeEvent.date ? moment(new Date(activeEvent.date)).format('DD/MM/YYYY') : null}-${activeEvent.date_end ? moment(new Date(activeEvent.date_end)).format('DD/MM/YYYY') : null}` : `${formatMessage({id: 'select'})} ${formatMessage({id: 'date'})}`}
						date={dates}
						/>
						:
						<NewCell
						id={data.id}
						key={index}
						type={field === 'phone' ? 'number' : 'string'}
						field={field}
						value={
						field == 'actor_name' ? (data.supplier_id !== 0 ? getActor(data.supplier_id)?.supplier_name : '') :
						field == 'supplier_unit_cost' && !data.supplier_unit_cost ? (data.supplier_id !== 0 ? getActor(data.supplier_id)?.supplier_unit_cost : '') :
						field == 'percentage1' ? data.supplier_unit_cost && titles ? (!titles['percentage1'] ? 0 : (Number(titles['percentage1'])) * data.supplier_unit_cost) / 100 : 0 :
							field == 'percentage2' ? data.supplier_unit_cost && titles ? (!titles['percentage2'] ? 0 : (Number(titles['percentage2'])) * data.supplier_unit_cost) / 100 : 0 :
								field == 'percentage3' ? data.supplier_unit_cost && titles ? (!titles['percentage3'] ? 0 : (Number(titles['percentage3'])) * data.supplier_unit_cost) / 100 : 0 :
									field == 'characters' ? supplierCharacters.toString() :
										field === 'number_of_working_days' ? shootingDaysNumber :
											field === 'total' ? ( isNaN(total) ? 0 : total ) : (props.data as any)[field]
						}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={value => handleChange(value)}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value: any) => onBlur(value, data.id, field) : () => {
					}}

						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						classnames={['width-10-rem']}
						>
						{field === 'supplier_unit_type' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
									<div onClick={() => {
										setIsTypePopupOpen(!isTypePopupOpen)
									}}
										 className={`${isTypePopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath + "options/dropdown-down.svg"}/>
									</div>
									<Popup
										isOpen={isTypePopupOpen}
										onClick={(): void => {
											return;
										}}
										options={unitTypes.length ? unitTypes.map((option: any) => ({
											disabled: false,
											text: option.supplier_unit_type,
											action: (): void => {
												setIsTypePopupOpen(false);
												props.onChange(option.supplier_unit_type, props.data.id, field);
												let supplier_unit_type_id = option.supplier_unit_type ? supplierUnitTypes.filter((x: any) => {
													if (x['supplier_unit_type'] == option.supplier_unit_type) {
														return x
													}
												})[0].id : null;
												onBlur(supplier_unit_type_id, props.data.id, 'supplier_unit_type_id')
											}
										})) : []}
										onOutsideClick={(): void => setIsTypePopupOpen(false)}
										onAddField={async (value: string) => {
											if (!value || unitTypes.indexOf(value) > -1) {
												return;
											}

											let newSupplierUnitType: any = await addSupplierUnitType(value, null)
											if (newSupplierUnitType && newSupplierUnitType.supplier_unit_type) {
												const newUnitTypeOptions = [...supplierUnitTypes];
												newUnitTypeOptions.splice(newUnitTypeOptions.length, 0, newSupplierUnitType.supplier_unit_type);
												newUnitTypeOptions.splice(newUnitTypeOptions.length, 0, {supplier_unit_type: formatMessage({id: 'add_new'})});

												setUnitTypes(newUnitTypeOptions);
												dispatch({
													type: SupplierUnitTypesActionTypes.SET_SUPPLIER_UNIT_TYPES,
													payload: [...supplierUnitTypes, newSupplierUnitType.supplier_type]
												});
												props.onChange(value, props.data.id, field);
												props.onBlur(value, props.data.id, field);
											}
										}}
									/>
								</InputGroupText>
							</InputGroupAddon>
						) : null}
						</NewCell>
					}
				</InputGroup>
			})}
		</div>
	);
};

export default TeamExtraHours;
