import * as React from 'react';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { filteredOptions } from '../../helpers/helpers'
import { useSelector, useDispatch } from 'react-redux';
import { SupplierJobTitlesActionTypes } from '@src/containers/tasks/ListsReducer';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { NewCell } from '@components';
import { addSupplier } from '@containers/suppliers/initial-state';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"
import { useIntl } from "react-intl";
import { Event } from '@containers/planning/interfaces';
import { Icon } from '@components';
import { config } from '../../config';
import './index.scss';


interface Props {
	readonly data: any;
	readonly type: string;
	readonly color: string;
	readonly onChange: (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number, script_index?: number, scene_time_id?: number, i?: number) => void;
	readonly onBlur: (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number,scene_number:number, script_index?: number, scene_time_id?: number, i?: number) => void;
	readonly onDelete: (index: number, type:string, chapter_number:number, scene_index:number,scene_number:number, script_index?: number, scene_time_id?: number) => void;
	// readonly onKeyPress: (id: string) => void;
	// readonly provided: DraggableProvided;
	// readonly innerRef: any;
	readonly SupplierWithJob: (supplier_job_title: string) => any;
	readonly fields: any;
	readonly characters: any[];
	readonly type_index: number;
	readonly script_index: number;
	readonly scene_time_id: number;
	readonly scene_index: number;
	readonly scene_number: number;
	readonly chapter_number: number;
}

export const BreakDownRow: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const inputRef = React.useRef(null);
	const dispatch = useDispatch();
	const { data, type, fields, type_index, scene_time_id,script_index, scene_index,SupplierWithJob, scene_number, chapter_number,characters,  onBlur, onChange } = props
	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const [isCharactersPopupOpen, setIsCharactersPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name: formatMessage({id: 'add_new'})}]);
	const [charactersOptions, setCharactersOptions] = React.useState([...characters, {character_name: formatMessage({id: 'add_new'})}]);
	const activeEvent:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])
	const [filter, setFilter] = React.useState(null);
	const supplierJobTitles = useSelector((state: RootStore) => state.supplierJobTitles);
	const [jobTitles, setJobTitles] = React.useState([...supplierJobTitles, {supplier_job_title: formatMessage({id: 'add_new'})}]);
	const [open, setOpen] = React.useState(false);

	const isReadonly = (field: string): boolean => ['supplier_name'].includes(field);
	const isOptions = (field: string): boolean => ['supplier_job_title', 'character_name'].includes(field);



	return (
		<div className="n-row position-relative d-flex w">
			<span className="n-row__color" style={{ backgroundColor: props.color }} />


			{fields.map((field: string, index: number) =>  (
				<InputGroup className="mb-1">
					<NewCell
					    styleColor="gray"
						id={props.data.id}
						key={index}
						type={field === 'phone' ? 'number' : 'string'}
						field={field}
						value={field == 'supplier_name' ? data.supplier_name ? data.supplier_name : ''
								: (props.data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ?
							(value)=> onChange(value, field, type, type_index, chapter_number, scene_index, script_index, scene_time_id)
							:
							(value)=>{
							onChange(value, field, type, type_index, chapter_number, scene_index, script_index, scene_time_id);
							if ( field === 'supplier_job_title') setOpen(true)
							else if ( field === 'supplier_name') setIsSupplierPopupOpen(true)
							else if ( field === 'character_name') setIsCharactersPopupOpen(true)
							}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value)=>onBlur(value,field, type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id) : ()=>{}}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						placeholder={field === 'supplier_job_title' ? 'description'  : field.replace(/-|_/g, ' ')}
						// invalid={isOptions(field) ? field == 'supplier_name' ? Boolean(filteredOptions(suppliersOptions,field, props.data[field]).length) : Boolean(filteredOptions(charactersOptions,field, props.data[field]).length) : false}
					>

						{/* {field === 'supplier_name' && (
						<InputGroupAddon addonType="append">
							 <InputGroupText className="options">
								<div onClick={() => {setIsSupplierPopupOpen(!isSupplierPopupOpen)}}
									   	 className={`${isSupplierPopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
								</div>

								<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={filteredOptions(suppliersOptions,field, props.data[field]).map((option: any) => ({
										disabled: false,
										text: option.supplier_name,
										action: (): void => {
											option !== formatMessage({id: 'add_new'}) && setIsSupplierPopupOpen(false);
											onChange(option.supplier_name, field, type, type_index, chapter_number, scene_index, script_index, scene_time_id)
											onBlur(option.supplier_name, field, type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id)
											let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
											onChange(supplier_id, 'supplier_id', type, type_index, chapter_number, scene_index, script_index, scene_time_id)
											onBlur(supplier_id, 'supplier_id', type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id )
										}
									}))}
									onOutsideClick={(): void => {
										setIsSupplierPopupOpen(false);
									}}
									onAddField={async(value: string) => {
										if (!value || suppliersOptions.indexOf(value) > -1) {
											return;
										}

										const newSupplier:any = await addSupplier({'supplier_name': value, project_id: activeEvent.id, company_id: activeEvent.company_id})
										if( newSupplier && newSupplier.supplier ) {
											const newSuppliersOptions = [...suppliers];
											newSuppliersOptions.splice(newSuppliersOptions.length, 0, newSupplier.supplier);
											newSuppliersOptions.splice(newSuppliersOptions.length, 0, {supplier_name:formatMessage({id: 'add_new'})});
											setSuppliersOptions(newSuppliersOptions);
											dispatch(SuppliersActions.setSuppliers([...suppliers, newSupplier.supplier],0))
										}

										onChange(value, field, type, type_index, script_index, scene_index,  chapter_number, scene_time_id)

										// setIsSupplierPopupOpen(false);
									}}
								/>
									  </InputGroupText>
								</InputGroupAddon>
						)} */}

						{field === 'character_name' && (<>

						<InputGroupAddon addonType="append">
							 <InputGroupText className="options">
								<div onClick={() => {setIsCharactersPopupOpen(!isCharactersPopupOpen)}}
									   	 className={`${isCharactersPopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
								</div>
								<Popup
									isOpen={isCharactersPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={filteredOptions(charactersOptions,field,  props.data[field]).map((option: any) => ({
										disabled: false,
										text: option.character_name,
										action: (): void => {
											option !== formatMessage({id: 'add_new'}) && setIsCharactersPopupOpen(false);
											onChange(option.character_name, field, type, type_index, chapter_number, scene_index, script_index, scene_time_id)
											// onBlur(option.character_name, field, type, type_index, script_index, scene_index, scene_number, chapter_number)

											onChange(option.character_id, 'character_id', type, type_index, chapter_number, scene_index, script_index, scene_time_id)
											onBlur(option.character_id, 'character_id', type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id)
										}
									}))}
									onOutsideClick={(): void => {
										setIsCharactersPopupOpen(false);
									}}
									onAddField={async(value: string) => {
										if (!value || suppliersOptions.indexOf(value) > -1) {
											return;
										}
									}}
								/>
									  </InputGroupText>
								</InputGroupAddon>
						</>)}


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
										list:  SupplierWithJob(option.supplier_job_title) && SupplierWithJob(option.supplier_job_title).length > 1 ?
										 SupplierWithJob(option.supplier_job_title).map((supplier: any, index:number) => ({
											text: supplier.supplier_name,
											 action: (): void => {
												option !== formatMessage({id: 'add_new'})  && setOpen(!open);
												let supplier = SupplierWithJob(option.supplier_job_title)[index]
												onChange(supplier.supplier_job_title, 'supplier_job_title', type, type_index, chapter_number, scene_index, script_index, scene_time_id,index)
												onBlur(supplier.supplier_job_title_id, 'supplier_job_title_id', type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id,index)
											 }
										 })) :undefined,
										action: (): void => {
											option !== formatMessage({id: 'add_new'})  && setOpen(!open);
											onChange(option.supplier_job_title, 'supplier_job_title', type, type_index, chapter_number, scene_index, script_index, scene_time_id)

											let supplier_job_title_id = option.supplier_job_title ? supplierJobTitles.filter((x:any) => {if(x['supplier_job_title'] == option.supplier_job_title){return x}})[0].id : null;
											console.log('supplier', supplierJobTitles)
											console.log('supplier', supplier_job_title_id)

											onBlur(supplier_job_title_id, 'supplier_job_title_id', type, type_index, chapter_number, scene_index, scene_number, script_index, scene_time_id)

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

					</NewCell>
					</InputGroup>
			))}
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle
					className="n-btn-delete mr-1 mb-1"
					size={20}
					onClick={(): void => props.onDelete(type_index, type, chapter_number, scene_index, scene_number, script_index, scene_time_id)}/>
					</div>
				</div>



		</div>
	);

}


export default BreakDownRow;
