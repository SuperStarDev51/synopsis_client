import * as React from 'react';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { filteredOptions } from '../../helpers/helpers'
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { NewCell } from '@components';
import { addSupplier } from '@containers/suppliers/initial-state';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle} from "react-feather"
import { useIntl } from "react-intl";
import { Event } from '@containers/planning/interfaces';
import { Icon } from '@components';
import { config } from '../../config';

import './index.scss';

interface Props {
	readonly data: any;
	readonly type: string;
	readonly type_index: number;
	readonly color: string;
	readonly fields: any;
	readonly sdi: number;
	readonly onChange: (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number) => void;
	readonly onBlur: (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number) => void;
	readonly onDelete: (index: any, type:string, shooting_day_index:number)  => void;
	// readonly onKeyPress: (id: string) => void;
	// readonly provided: DraggableProvided;
	// readonly innerRef: any;
}

export const TaskShootingDayRow: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const inputRef = React.useRef(null);
	const dispatch = useDispatch();
	const { data, type, type_index,  fields, sdi,  onBlur, onChange, onDelete } = props
	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const [isCharactersPopupOpen, setIsCharactersPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name: formatMessage({id: 'add_new'})}]);
	const activeEvent:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])
	const isReadonly = (field: string): boolean => [''].includes(field);
	const isOptions = (field: string): boolean => ['supplier_name'].includes(field);
	
	return (
		<div className="n-row position-relative d-flex">
			<span className="n-row__color" style={{ backgroundColor: props.color }} />
			{fields.map((field: string, index: number) => {
				return (<>
					<InputGroup className="mb-1">
					<NewCell
						styleColor="gray"
						id={data.id}
						key={index}
						type={field === 'price' ? 'number' : 'string'}
						field={field}
						value={(data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ? 
							(value)=> onChange(value, type, sdi, field, type_index)
							: 
							(value)=>{ 
							onChange(value, type, sdi, field, type_index);
							if( field == 'supplier_name' ) setIsSupplierPopupOpen(true)
							}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value)=> onBlur(value, type, sdi, field, type_index) : ()=>{}}
						onKeyPress={()=>{}}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						placeholder={field.replace(/-|_/g, ' ')}
						invalid={isOptions(field) ? field == 'supplier_name' ? Boolean(filteredOptions(suppliersOptions,field, data[field]).length) : false : false}
					>
						
						{field === 'supplier_name' && (
						<InputGroupAddon addonType="append">
							 <InputGroupText className="options">
								<div onClick={() => {setIsSupplierPopupOpen(!isCharactersPopupOpen)}}
									   	 className={`${isCharactersPopupOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
								</div>
								<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={filteredOptions(suppliersOptions,field, data[field]).map((option: any) => ({
										disabled: false,
										text: option.supplier_name,
										action: (): void => {
											option !== formatMessage({id: 'add_new'}) && setIsSupplierPopupOpen(false);
											onChange(option.supplier_name, type, sdi, field, type_index);
											onBlur(option.supplier_name, type, sdi, field, type_index)

											let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
											onChange(supplier_id, type, sdi, 'supplier_id', type_index);
											onBlur(supplier_id, type, sdi, 'supplier_id', type_index)

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

										onChange(value, type, sdi, field, type_index)
									}}
								/>
									  </InputGroupText>
								</InputGroupAddon>	  
						)}

				
					</NewCell>
					</InputGroup>
				
					</>
				
			)})}
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle 
					className="n-btn-delete mr-1 mb-1" 
					size={20} 
					onClick={(): void => onDelete(type_index, type, sdi)}/>
					</div>
				</div>
				
				
		</div>	
	);
	
}


export default TaskShootingDayRow;
