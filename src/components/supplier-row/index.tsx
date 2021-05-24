import * as React from 'react';
import SVG from 'react-inlinesvg';
import { DraggableProvided } from 'react-beautiful-dnd';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { addCharacter } from '@containers/scripts/initial-state'
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell, Attachments } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import {  addSupplierType, addSupplierFile } from '@containers/suppliers/initial-state';
import { SupplierJobTitlesActionTypes, SupplierTypesActionTypes, CharactersActionTypes } from '@src/containers/tasks/ListsReducer';
import { InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import { XCircle} from "react-feather"
import { Icon } from '@components';
import { config } from '../../config';
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";

interface Props {
	readonly sdId :any;
	readonly disableDelete? :boolean;
	readonly data: Supplier;
	readonly color: string;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly fields: any;
}

export const SupplierRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, fields, onChange, onBlur, onKeyPress, permissionMod } = props
	const [open, setOpen] = React.useState(false);
	const [permissionsPopupOpen, setPermissionsPopupOpen] = React.useState(false);
	const [statusPopupOpen, setStatusPopupOpen] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [isTypePopupOpen, setIsTypePopupOpen] = React.useState(false);
	const [isCaractersPopupOpen, setIsCaractersPopupOpen] = React.useState(false);
	const [isAttachmentsOpen, setIsAttachmentsOpen] = React.useState(false);
	const permissionTypes = useSelector((state: RootStore) => state.permissionTypes);
	const permissionStatus = useSelector((state: RootStore) => state.permissionStatus);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0]);
	const suppliers = useSelector((state: RootStore) => state.suppliers);
	const supplierStatus = useSelector((state: RootStore) => state.supplierStatus);
	const supplierJobTitles = useSelector((state: RootStore) => state.supplierJobTitles);
	const [jobTitles, setJobTitles] = React.useState([...supplierJobTitles, {supplier_job_title:formatMessage({id: 'add_new'})}]);
	const [statuses, setStatuses] = React.useState([...supplierStatus, {supplier_job_title:formatMessage({id: 'add_new'})}]);
	const supplierTypes = useSelector((state: RootStore) => state.supplierTypes);
	const [typeOptions, setTypeOptions] = React.useState([...supplierTypes, {supplier_type:formatMessage({id: 'add_new'})}]);
	const [isEmailIconActive, setIsEmailIconActive] = React.useState<boolean>(false);
	const [isAttachmentsIconActive, setIsAttachmentsIconActive] = React.useState<boolean>(false);
	const characters = useSelector((state: RootStore) => state.characters);
	let supplierCharacters = characters && characters.length ? characters.map(c=> {if(c.supplier_id == data.id) return c.character_name}).filter(a=>a) : []
	const selectedCharacters = characters && characters.length ? characters.filter(character => character.supplier_id !== 0).map(item => item.character_name) : [];
	const isReadonly = (field: string): boolean => ['characters'].includes(field);

	const isOptionsList = permissionMod
		? ['characters', 'type', 'supplier_job_title', 'permissions', 'status']
		: ['characters', 'type', 'supplier_job_title'];
	const isOptions = (field: string): boolean => isOptionsList.includes(field);

	// const handleRowEmailIconClick = () => {
	// 	setIsEmailIconActive(!isEmailIconActive);
	// };

	return (
		<div
			ref={props.innerRef}
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(data.id)
				}
			}}
			{...props.provided.draggableProps}
			{...props.provided.dragHandleProps}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, index: number) =>
				['pos', 'id', 'color', 'attachments', 'company_id'].includes(field) ? null : (
					<InputGroup key={`${index}`}>
					<NewCell
						id={data.id}
						type={field === 'phone' ? 'number' : 'string'}
						field={field}
						value={field == 'characters' ? data.character ? data[field].toString() : supplierCharacters ?  supplierCharacters.toString() : (data as any)[field] : (data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ?
							(value:any)=> onChange(value, data.id,field)
						:
						(value:any)=>{
							onChange(value, data.id, field);
							if( field == 'supplier_job_title' ) setOpen(true)
							else if ( field == 'type' ) setIsTypePopupOpen(true)
							else if ( field == 'permissions' ) setPermissionsPopupOpen(true)
							else if ( field == 'status' ) setStatusPopupOpen(true)
							else if( field == 'characters' ) setIsCaractersPopupOpen(true)
						}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, data.id, field) : ()=>{}}
						classnames={['width-10-rem']}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
					>

					{ field === 'characters' && !data.character &&  (
						<InputGroupAddon addonType="append">
							 <InputGroupText className="options">
								<div
									onClick={() => {setIsCaractersPopupOpen(!isCaractersPopupOpen)}}
									className={`${isCaractersPopupOpen ? ' popup-open' : ''}`}
								>
									<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
								</div>
								<Popup
									multiple
									isOpen={isCaractersPopupOpen}
									onClick={(): void => {
										return;
									}}
									className="c-popup--5-columns"
									selected={selectedCharacters}
									options={characters.map((option: any) => ({
										disabled: false,
										text: option.character_name,
										action: async () => {
											option !== formatMessage({id: 'add_new'})
											await addCharacter({
												...option,
												project_id: activeEvent.id,
												supplier_id: data.id,
												add_character_supplier_to_shooting_days: 1,
											})
											dispatch({
												type: ShootingDaysActionTypes.SET_SHOOTING_DAY_CHARACTERS,
												payload: {
													characterId: option.character_id,
													supplierId: data.id,
												}
											});
											dispatch({
												type: CharactersActionTypes.SET_CHARACTERS,
												payload: characters.map((c:any)=> {
													if( c.character_id !== option.character_id ) return c
													else return {...c,	supplier_id: data.id}
												})
											});
										},
										removeSelect: async () => {
											option !== formatMessage({id: 'add_new'})
											await addCharacter({
												...option,
												project_id: activeEvent.id,
												supplier_id: 0,
												add_character_supplier_to_shooting_days: 1,
											})
											dispatch({
												type: ShootingDaysActionTypes.SET_SHOOTING_DAY_CHARACTERS,
												payload: {
													characterId: option.character_id,
													supplierId: 0,
												}
											});
											dispatch({
												type: CharactersActionTypes.SET_CHARACTERS,
												payload: characters.map((c:any) => {
													 if( c.character_id !== option.character_id ) return c
													 return {...c,supplier_id: 0}
												})
											})
										}
									}))}
									onOutsideClick={(): void => {
										setIsCaractersPopupOpen(false);
									}}
								/>
									  </InputGroupText>
						</InputGroupAddon>
				)}

						{field === 'supplier_job_title' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
									<div onClick={() => {setOpen(!open)}}
																		 className={`${open ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
									</div>
									<Popup
										isOpen={open}
										onClick={(): void => {
											return;
										}}
										options={jobTitles.map((option: any) => ({
											disabled: false,
											text: option.supplier_job_title,
											action: (): void => {
												option !== formatMessage({id: 'add_new'})  && setOpen(!open);
												onChange(option.supplier_job_title, props.data.id, field);
												let supplier_job_title_id = option.supplier_job_title ? supplierJobTitles.filter((x:any) => {if(x['supplier_job_title'] == option.supplier_job_title){return x}})[0].id : null;
												onBlur(supplier_job_title_id, props.data.id, 'supplier_job_title_id')
											}
										}))}
										onOutsideClick={(): void => setOpen(false)}
										onAddField={async(value: string) => {
											if (!value || jobTitles.indexOf(value) > -1) {
												return;
											}
											let supplier_job_title = value ? supplierJobTitles.filter((x:any) => {if(x['supplier_job_title'] == value){return x}})[0] : undefined;
											let supplier_job_title_id = supplier_job_title ?  supplier_job_title.id : null
											addSupplier({'supplier_name': value, supplier_job_title_id, company_id: activeEvent.company_id})
												.then((newSupplier:any)=>{
													if( newSupplier && newSupplier.supplier ) {
														dispatch(SuppliersActions.setSuppliers([...suppliers, newSupplier.supplier],0))
														if( newSupplier.supplier.job_title ) {
															const newJobTitles = [...supplierJobTitles];
															newJobTitles.splice(newJobTitles.length, 0, newSupplier.supplier.job_title);
															newJobTitles.splice(newJobTitles.length, 0, {supplier_job_title:formatMessage({id: 'add_new'}) });
															setJobTitles(newJobTitles);
															dispatch({
																type: SupplierJobTitlesActionTypes.SET_SUPPLIER_JOB_TITLES,
																payload: [...supplierJobTitles,  newSupplier.supplier.job_title]
															});
														}
													}
												})
										}}
									/>
								</InputGroupText>
							</InputGroupAddon>
						) : null}

						{field === 'permissions' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
									<div onClick={() => {setPermissionsPopupOpen(!permissionsPopupOpen)}}
										 className={`${permissionsPopupOpen ? ' popup-open' : ''}`}
									>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
									</div>
									<Popup
										isOpen={permissionsPopupOpen}
										onClick={(): void => {return}}
										options={permissionTypes.map(permission => ({
											disabled: false,
											text: formatMessage({id: permission.permission_type}),
											action: (): void => {
												setPermissionsPopupOpen(!permissionsPopupOpen);
											}
										}))}
										onOutsideClick={(): void => setPermissionsPopupOpen(false)}
									/>
								</InputGroupText>
							</InputGroupAddon>
						) : null}

						{field === 'status' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
									<div onClick={() => {setStatusPopupOpen(!statusPopupOpen)}}
										 className={`${statusPopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
									</div>
									<Popup
										isOpen={statusPopupOpen}
										onClick={(): void => {return}}
										options={permissionStatus.map(status => ({
												disabled: false,
												text: formatMessage({id: status.permission_status}),
												action: (): void => {
													setStatusPopupOpen(!statusPopupOpen);
												}
											}))}
										onOutsideClick={(): void => setStatusPopupOpen(false)}
									/>
								</InputGroupText>
							</InputGroupAddon>
						) : null}


						{field === 'type' ? (
								<InputGroupAddon addonType="append">
								<InputGroupText className="options">
								<div onClick={() => {setIsTypePopupOpen(!isTypePopupOpen)}}
									   	 className={`${isTypePopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
								</div>
								<Popup
									isOpen={isTypePopupOpen}
									onClick={(): void => {
										return;
									}}
									options={typeOptions.length ? typeOptions.map((option: any) => ({
										disabled: false,
										text: option.supplier_type,
										action: (): void => {
											setIsTypePopupOpen(false);
											onChange(option.supplier_type, props.data.id, field);
											let supplier_type_id = option.supplier_type ? supplierTypes.filter((x:any) => {if(x['supplier_type'] == option.supplier_type){return x}})[0].id : null;
											onBlur(supplier_type_id, props.data.id, 'supplier_type_id')
										}
									})): []}
									onOutsideClick={(): void => setIsTypePopupOpen(false)}
									onAddField={async(value: string) => {
										if (!value || typeOptions.indexOf(value) > -1) {
											return;
										}

										let newSupplierType:any = await addSupplierType(value, null)
										if( newSupplierType && newSupplierType.supplier_type ) {
											const newTypeOptions = [...supplierTypes];
											newTypeOptions.splice(newTypeOptions.length, 0, newSupplierType.supplier_type);
											newTypeOptions.splice(newTypeOptions.length, 0, {supplier_type: formatMessage({id: 'add_new'})});

											setTypeOptions(newTypeOptions);
											dispatch({
												type: SupplierTypesActionTypes.SET_SUPPLIER_TYPES,
												payload: [...supplierTypes, newSupplierType.supplier_type]
											});
											onChange(value, props.data.id, field);
											let supplier_type_id = value ? supplierTypes.filter((x:any) => {alert(x['supplier_type']);alert(value);if(x['supplier_type'] == value){return x}})[0].id : null;
											onBlur(supplier_type_id, props.data.id, 'supplier_type_id')
										}
										// setIsTypePopupOpen(false);
									}}
								/>
							 </InputGroupText>
					 	 </InputGroupAddon>
						) : null}
					</NewCell>
					</InputGroup>
				)
			)}

			{/* <div className="c-table__cell-actions">
							<button
									type="button"
									onClick={(): void => {
										setIsAttachmentsOpen(true);
									}}
									className={`c-btn-icon c-btn-icon--clip`}
								>
									<SVG src="/assets/images/clip-icon.svg" />
							</button>
								<Attachments
									isOpen={isAttachmentsOpen}
									attachments={data.attachments}
									setIsAttachmentsOpen={setIsAttachmentsOpen}
									onChange={(f:File): void => {addSupplierFile(data.id, f)}} // Todo: dispach update
									onOutsideClick={(): void => setIsAttachmentsOpen(false)}
								/>
			</div> */}
			{!props.disableDelete ? (
			<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle
					className="n-btn-delete mr-1 mb-1"
					size={20}
					onClick={(): void => props.onDelete(props.data.id)}/>
					</div>
	       </div>
			):null}
		</div>
	);
};

export default SupplierRow;
