import * as React from 'react';
import { filteredOptions } from '../../helpers/helpers'
import { Event } from '@containers/planning/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell } from '@components';
import { InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import { Icon } from '@components';
import { config } from '../../config';
import {XCircle} from "react-feather";

interface Props {
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

export const PostRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, index, fields, onChange, onBlur, onKeyPress } = props
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0])
	const [isEarlySupplierPopupOpen, setIsEarlySupplierPopupOpen] = React.useState<boolean>(false);
	const [isFinishedSupplierPopupOpen, setIsFinishedSupplierPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name: formatMessage({id: 'add_new'})}]);
	const isReadonly = (field: string): boolean => ['early_call_suppliers', 'finished_suppliers'].includes(field);
	const isOptions = (field: string): boolean => ['early_call_suppliers', 'finished_suppliers'].includes(field);
	const isNumber = (field: string): boolean => [''].includes(field);
	const isText = (field: string): boolean => ['comments'].includes(field);
	// const isTime = (field: string): boolean => ['early_call', 'call', 'breakfast',  'first_shoot', 'lunch', 'wrap', 'finished', 'over_time'].includes(field);

	return (
		<div
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(index)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, field_index: number) =>
				<InputGroup key={field_index} style={{flexWrap: 'unset'}}>
				<>
				<NewCell
					id={index}
					key={field_index}
					type={isNumber(field) ? 'number' : isText(field) ? 'string' :  !isOptions(field) ?  'time' : 'string'}
					field={field}
					value={(field == 'early_call_suppliers' ||  field == 'finished_suppliers')  && data[field].map(o=> o.supplier_name) &&  data[field].map(o=> o.supplier_name).length ? data[field].map(o=> o.supplier_name).toString() : (data as any)[field]}
					field={field}
					prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
					suffix={['fee'].includes(field) ? '%' : ''}
					onChange={!isOptions(field) ?
						(value:any)=> onChange(value, index,field)
					:
					(value:any)=>{
						onChange(value, index, field);
						if( field == 'early_call_suppliers' ) setIsEarlySupplierPopupOpen(true)
						else if( field == 'finished_suppliers' ) setIsFinishedSupplierPopupOpen(true)
					}}
					onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, data.id, field) : ()=>{}}

					inputRef={index === 0 ? inputRef : null}
					isReadOnly={isReadonly(field)}
					classnames={['width-10-rem']}
					invalid={isOptions(field) ? field == 'early_call_suppliers' ? false ? Boolean(filteredOptions(suppliersOptions,field, props.data[field]).length) : false : false: false}
				>

			{field === 'early_call_suppliers' && (
					<InputGroupAddon addonType="append">
						 <InputGroupText className="options">
							<div onClick={() => {setIsEarlySupplierPopupOpen(!isEarlySupplierPopupOpen)}}
									 className={`${isEarlySupplierPopupOpen ? ' popup-open' : ''}`}>
									<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
							</div>
							<Popup
								multiple
								isOpen={isEarlySupplierPopupOpen}
								onClick={(): void => {
									return;
								}}
								selected={(data as any)[field].map(s=>s.supplier_name)}
								options={suppliersOptions.map((option: any) => ({
									disabled: false,
									text: option.supplier_name,
									action: (): void => {
										option !== formatMessage({id: 'add_new'})
										 let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
										 let newSuppliersList = [...data[field],{supplier_name: option.supplier_name, supplier_id}].filter(o=>o)
										onChange(newSuppliersList, index, field)
										onBlur(newSuppliersList, data.id, field)

									},
									removeSelect: (): void => {
										option !== formatMessage({id: 'add_new'})
										let newSuppliersList = data[field].filter((o:any)=> o.supplier_name !== option.supplier_name)
										onChange(newSuppliersList, index, field)
										onBlur(newSuppliersList, data.id, field)

									}
								}))}
								onOutsideClick={(): void => {
									setIsEarlySupplierPopupOpen(false);
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
									let newSuppliersList = [...data[field],{supplier_name: value, supplier_id: newSupplier.supplier.id}]
									onChange(newSuppliersList, index, field)
									onBlur(newSuppliersList, data.id, field)
								}}
							/>
								  </InputGroupText>
					</InputGroupAddon>
			)}

			{ field === 'finished_suppliers' && (
					<InputGroupAddon addonType="append">
						 <InputGroupText className="options">
							<div onClick={() => {setIsFinishedSupplierPopupOpen(!isFinishedSupplierPopupOpen)}}
									 className={`${isFinishedSupplierPopupOpen ? ' popup-open' : ''}`}>
									<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
							</div>
							<Popup
								multiple
								isOpen={isFinishedSupplierPopupOpen}
								onClick={(): void => {
									return;
								}}
								selected={(data as any)[field].map(s=>s.supplier_name)}
								options={suppliersOptions.map((option: any) => ({
									disabled: false,
									text: option.supplier_name,
									action: (): void => {
										option !== formatMessage({id: 'add_new'})
										 let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
										onChange([...data[field],{supplier_name: option.supplier_name, supplier_id}].filter(o=>o), index, field)
									},
									removeSelect: (): void => {
										option !== formatMessage({id: 'add_new'})
										onChange(data[field].filter((o:any)=> o.supplier_name !== option.supplier_name), index, field)
									}
								}))}
								onOutsideClick={(): void => {
									setIsFinishedSupplierPopupOpen(false);
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
									onChange([...data[field],{supplier_name: value, supplier_id: newSupplier.supplier.id}], index, field)
								}}
							/>
								  </InputGroupText>
					</InputGroupAddon>
			)}

				</NewCell>
				 </>
				</InputGroup>
			)}
		</div>
	);
};

export default PostRow;
