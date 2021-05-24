import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { addSupplier } from '@containers/suppliers/initial-state';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { SupplierJobTitlesActionTypes } from '@src/containers/tasks/ListsReducer';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
import { Expense } from '@containers/budget/interfaces';
import {NewCell,TableType, ListView,Popup } from '@components';
import { useIntl } from 'react-intl';
import { Event } from '@containers/planning/interfaces';
import { InputGroup, InputGroupText, InputGroupAddon,Card,  CardBody } from 'reactstrap';
import { XCircle} from "react-feather"
import { Icon } from '@components';
import { config } from '../../config';

interface Props {
	readonly data: Expense;
	readonly color: string;
	readonly index: number;
	readonly row_index: number;
	readonly onChange: (value: any, id: string | number, field: string, i?: number) => void;
	readonly onBlur: (value: any, id: string | number, field: string, i?: number) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly SupplierWithJob: (supplier_job_title: string) => any;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly fields: any[];
	readonly isPricePrimCellVisible?: boolean;
}

export const ExpenseRow: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const { data, index,isPricePrimCellVisible, row_index, fields,SupplierWithJob,  onBlur, onChange } = props;
	const dispatch = useDispatch();
	const event:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])

	const inputRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);
	const supplierJobTitles = useSelector((state: RootStore) => state.supplierJobTitles);
	const [jobTitles, setJobTitles] = React.useState([...supplierJobTitles, {supplier_job_title: formatMessage({id: 'add_new'})}]);
	const budgetStatus = useSelector((state: RootStore) => state.budgetStatus);
	const [statuses, setStatuses] = React.useState([...budgetStatus, {budget_status: formatMessage({id: 'add_new'})}]);
	const [isTypePopupOpen, setIsTypePopupOpen] = React.useState(false);
	const [isPaymentsOpen, setIsPaymentsOpen] = React.useState<boolean>(false);
	const budgetTypes = useSelector((state: RootStore) => state.budgetTypes);
	const [types, setTypes] = React.useState([...budgetTypes, {budget_type: formatMessage({id: 'add_new'})}]);
	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const allSuppliers = useSelector((state: RootStore) => state.suppliers )
	const suppliersRootStore:any[] = allSuppliers.map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const ActorsRootStore:any[] = allSuppliers.map((suppliers, listIndex)=> {if( listIndex == 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);
	const activeEvent:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])

	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name: formatMessage({id: 'add_new'})}]);

	const isReadonly = (field: string): boolean => ['supplier_name', 'total', 'payments'].includes(field);
	const isOptions = (field: string): boolean => ['type', 'status', 'supplier_job_title', 'payments'].includes(field);

	let draggableProps = props.provided ? props.provided.draggableProps : null
	let dragHandleProps = props.provided ? props.provided.dragHandleProps : null

	return (
		<div>
		<div
			ref={props.innerRef}
			className="n-row position-relative d-flex mb-02"
			{...draggableProps}
			{...dragHandleProps}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, index: number) => (
			<InputGroup>
				<NewCell
						onClick={field == 'payments' ? ()=>setIsPaymentsOpen(!isPaymentsOpen): ()=>{}}
						id={props.data.id}
						key={index}
						type={
							field === 'account_id' || field === 'price' || field === 'quantity'
								? 'number'
								: 'string'
						}
						field={field}
						value={field == 'total' ? data.quantity > 0 ?  Number(data.price) * data.quantity : data.price :
							   field == 'supplier_name' ? data.supplier_name ? data.supplier_name : '':
							   field == 'payments' ? formatMessage({id:'click_here'})  :
							   (data as any)[field]}
						prefix={['price', 'income', 'total', 'vat', 'price-prim'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ?
							(value)=>onChange(value,props.data.id,field)
						:
						(value)=>{
							onChange(value, props.data.id, field);
							if( field == 'type' ) setIsTypePopupOpen(true)
							else if ( field === 'supplier_job_title') setOpen(true)
							else if ( field === 'supplier_name') setIsSupplierPopupOpen(true)
						}}
						classnames={ field == 'payments' ? ['cursor-pointer','width-10-rem'] : ['width-10-rem']}
						inputRef={index === 0 ? inputRef : null}
						isPricePrimCellVisible={isPricePrimCellVisible}
						isReadOnly={isReadonly(field)}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value)=> onBlur(value, props.data.id, field) : ()=>{}}
						placeholder={field === 'supplier_job_title' ? 'description'  : field}
						// placeholder={
						// 	field === 'expense-description'
						// 		? 'enter_description'
						// 		: field === 'supplier_name'
						// 		? 'enter_supplier_name'
						// 		: field === 'comments'
						// 		? 'enter_comment'
						// 		: undefined
						// }
					>
						{/* {field === 'type' ? (
						<InputGroupAddon addonType="append">
							 <InputGroupText className="options">
								<ArrowDownCircle
										className={`n-btn-arrow-down${isTypePopupOpen ? ' popup-open' : ''}`}
										size={20}
										onClick={(): void => {setIsTypePopupOpen(true)}}
								/>

								<Popup
									isOpen={isTypePopupOpen}
									onClick={(): void => {
										return;
									}}
									options={types.map((option: any) => ({
										text: option.budget_type,
										action: (): void => {
											setIsTypePopupOpen(false);
											props.onChange(option.budget_type, props.data.id, field);
										},
									}))}
									onOutsideClick={(): void => setIsTypePopupOpen(false)}
									onAddField={async(value: string): void => {
										if (!value || types.indexOf(value) > -1) {
											return;
										}

										const newExpenseType:any = await addExpenseType(value, null)
										if( newExpenseType.budget_type ) {
											const newTypes = [...budgetTypes];
											newTypes.splice(newTypes.length, 0, newExpenseType.budget_type);
											newTypes.splice(newTypes.length, 0, {budget_type: formatMessage({id: 'add_new'})});
											setTypes(newTypes)
											dispatch({
												type: BudgetTypesActionTypes.SET_BUDGET_TYPES,
												payload: [...budgetTypes, newExpenseType.budget_type]
											});
											props.onChange(value, props.data.id, field);
										}
									}}
								/>
						  </InputGroupText>
						</InputGroupAddon>
						) : null} */}

						{/* {field === 'status' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
								   <ArrowDownCircle
										   className={`n-btn-arrow-down${open ? ' popup-open' : ''}`}
										   size={20}
										   onClick={(): void => {setOpen(!open)}}
								   />

								<Popup
									isOpen={open}
									onClick={(): void => {
										return;
									}}
									options={statuses.length ? statuses.map((option: any) => ({
										text: option.budget_status,
										action: (): void => {
											option !==  formatMessage({id: 'add_new'}) && setOpen(!open);
											props.onChange(option.budget_status, props.data.id, field);
										}
									})): []}
									onOutsideClick={(): void => setOpen(false)}
									onAddField={async(value: string): void => {
										if (!value || statuses.indexOf(value) > -1) {
											return;
										}

										const newExpenseStatus:any = await addExpenseStatus(value, null)
										if( newExpenseStatus.budget_status ) {
											const newStatuses = [...budgetStatus];
											newStatuses.splice(newStatuses.length, 0, newExpenseStatus.budget_status);
											newStatuses.splice(newStatuses.length, 0, {budget_status: formatMessage({id: 'add_new'})});
											setStatuses(newStatuses)
											dispatch({
												type: BudgetStatusActionTypes.SET_BUDGET_STATUS,
												payload: [...budgetStatus, newExpenseStatus.budget_status]
											});
											props.onChange(value, props.data.id, field);
										}
									}}
								/>
						  </InputGroupText>
						</InputGroupAddon>
						) : null} */}


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
												onChange(supplier.supplier_job_title, props.data.id, field, index);
												onBlur(supplier.supplier_job_title_id, props.data.id, 'supplier_job_title_id', index)
											 }
										 })) :undefined,
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


			{field === 'payments' ? (
							<InputGroupAddon addonType="append">
								<InputGroupText className="options">
								  	<div onClick={() => {setIsPaymentsOpen(!isPaymentsOpen)}}
									   	 className={`${isPaymentsOpen ? ' popup-open' : ''}`}>
										<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
									</div>
								 </InputGroupText>
								 </InputGroupAddon>

						) : null}


				{/* {field === 'supplier_name' ? (
						<InputGroupAddon addonType="append">
							<InputGroupText className="options">
							   <ArrowDownCircle
									   className={`n-btn-arrow-down${isSupplierPopupOpen ? ' popup-open' : ''}`}
									   size={20}
									   onClick={(): void => {setIsSupplierPopupOpen(true)}}
							   />

								<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={suppliersOptions.map((option: any) => ({
										disabled: false,
										text: option.supplier_name,
										action: (): void => {
											option !==  formatMessage({id: 'add_new'}) && setIsSupplierPopupOpen(false);
											props.onChange(option.supplier_name, props.data.id, field);
										}
									}))}
									onOutsideClick={(): void => {
										setIsSupplierPopupOpen(false);
									}}
									onAddField={async(value: string) => {
										if (!value || suppliersOptions.indexOf(value) > -1) {
											return;
										}

										const newSupplier:any = await addSupplier({'supplier_name': value, company_id: event.company_id})
										// if( newSupplier && newSupplier.supplier ) {
										// 	const newSupplierJobTitlesOptions = [...supplierJobTitles];
										// 	newSupplierJobTitlesOptions.splice(newSupplierJobTitlesOptions.length, 0, newSupplier.supplier);
										// 	newSupplierJobTitlesOptions.splice(newSupplierJobTitlesOptions.length, 0, {supplier_name: formatMessage({id: 'add_new'})});
										// 	setSuppliersOptions(newSupplierJobTitlesOptions);
										// 	dispatch({
										// 		type: SupplierJobTitlesActionTypes.SET_SUPPLIER_JOB_TITLES,
										// 		payload: [...supplierJobTitles, newSupplier.supplier]
										// 	});
										// }
										props.onChange(value, props.data.id, field);
										// setIsSupplierPopupOpen(false);
									}}
								/>
						  </InputGroupText>
						</InputGroupAddon>
						) : null} */}




				</NewCell>
			</InputGroup>
			))}

			<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle
					className="n-btn-delete mr-1 mb-1"
					size={20}
					onClick={(): void => props.onDelete(props.data.id)}/>
					</div>
	       </div>

		</div>
		{isPaymentsOpen && (
			<div className="bg-transparent mb-05" style={{borderLeft: '0.275rem solid', borderRight: '0.275rem solid', borderBottom: '0.275rem solid', borderColor: data.color}}>
				<CardBody className="pt-0 pb-0 px-1" >
							<ListView
										fields={['accounting_id','description', 'tax_id', 'date', 'amount_paid', 'comments']}
										setFields={(v)=>{}}
										type={TableType.PAYMENTS}
										id={data.id}
										index={index} // list expense index
										list={{id:row_index}} // expense index
										category={data.supplier_job_title && data.supplier_name ? data.supplier_name + ' - ' + data.supplier_job_title  : formatMessage({id:'payments'})}
										rows={data.payments ? data.payments : []}
						/>
				</CardBody>
			</div>
		)}
		</div>
	);
};

export default ExpenseRow;
