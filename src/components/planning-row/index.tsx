import * as React from 'react';
import SVG from 'react-inlinesvg';
import { useSelector, useDispatch } from 'react-redux';
import { DraggableProvided } from 'react-beautiful-dnd';
import { addSupplier } from '@containers/suppliers/initial-state';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import * as moment from 'moment';
import { RootStore } from '@src/store';
import { Cell, Popup, Attachments, CalendarComponent } from '@components';
import { UserInterface } from '@containers/tasks/interfaces';
import { TaskPlanning } from '@containers/planning/interfaces';

interface Props {
	readonly data: TaskPlanning;
	readonly color: string;
	readonly onChange: (value: string, id: string, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onAddToBudget?: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly onStatusChange: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly description: string;
	readonly owner: string;
}

export const PlanningRow: React.FunctionComponent<Props> = (props: Props) => {
	const dispatch = useDispatch();
	const inputRef = React.useRef(null);
	const { data } = props
	const [isOwnerPopupOpen, setIsOwnerPopupOpen] = React.useState(false);
	const [isTypePopupOpen, setIsTypePopupOpen] = React.useState(false);
	const [isAttachmentsOpen, setIsAttachmentsOpen] = React.useState(false);

	const users = useSelector((state: RootStore) => state.users);
	const owners = users.map((user: UserInterface) => `${user.first_name} ${user.last_name}`)
	const [ownersOptions, setOwnerOptions] = React.useState([...owners, 'Add new']);
	const typeOptions = ['Artists', 'Authority', 'Marketing', 'Logistics', 'Vendors'];
	const event:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])

	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name:'Add new'}]);

	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date>(new Date());
	const [isDateChosen, setIsDateChosen] = React.useState(false);

	const handleRowCalendarClick = () => {
		setIsCalendarOpen(!isCalendarOpen);
	};

	const isReadonly = (field: string): boolean => ['owner', 'supplier_name', 'type'].includes(field);

	return (
		<div
			ref={props.innerRef}
			className="c-row"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					props.onKeyPress(props.data.id)
				}
			}}
			{...props.provided.draggableProps}
			{...props.provided.dragHandleProps}
		>
			{isCalendarOpen && (
				<CalendarComponent
					onChange={(date: Date): void => {
						setDate(date);
						setIsCalendarOpen(!isCalendarOpen);
						setIsDateChosen(true);
					}}
					onOutsideClick={() => {
						setIsCalendarOpen(false);
					}}
					date={date}
					minDate={moment().toDate()}
					className="n-calendar--inRow"
				/>
			)}
			<span className="c-row__color" style={{ backgroundColor: props.color }} />

			{Object.keys(props.data).map((field: string, index: number) =>
				['id', 'color', 'status'].includes(field) ? null : (
					<Cell
						id={props.data.id}
						key={index}
						type="string"
						field={field}
						value={(props.data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={props.onChange}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						placeholder={
							field === 'owner'
								? 'Enter owner name...'
								: field === 'description'
								? 'Enter description...'
								: field === 'supplier_name'
								? 'Supplier name'
								: ''
						}
					>
						{field === 'type' ? (
							<>
								<button
									type="button"
									onClick={(): void => {
										setIsTypePopupOpen(true);
									}}
									className={`c-btn-arrow-down${isTypePopupOpen ? ' popup-open' : ''}`}
								></button>

								<Popup
									isOpen={isTypePopupOpen}
									onClick={(): void => {
										return;
									}}
									options={typeOptions.map((option: string) => ({
										disabled: false,
										text: option,
										action: (): void => {
											setIsTypePopupOpen(false);
											props.onChange(option, props.data.id, field);
										}
									}))}
									onOutsideClick={(): void => setIsTypePopupOpen(false)}
								/>
							</>
						) : null}

						{field === 'owner' ? (
							<>
								<button
									type="button"
									onClick={(): void => {
										setIsOwnerPopupOpen(true);
									}}
									className={`c-btn-arrow-down${isOwnerPopupOpen ? ' popup-open' : ''}`}
								></button>
								
				
								<Popup
									isOpen={isOwnerPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={ownersOptions.map((option: string) => ({
										disabled: false,
										text: option,
										action: (): void => {
											option !== 'Add new' && setIsOwnerPopupOpen(false);
											props.onChange(option, props.data.id, field);
											let user_id = users.length ? users.filter((o:any) => {if(`${o.first_name} ${o.last_name}` == option){return o}})[0].id : null;
											props.onChange(user_id, props.data.id, 'user_id');
										}
									}))}
									onOutsideClick={(): void => {
										setIsOwnerPopupOpen(false);
									}}
									onAddField={(value: string): void => {
										if (!value || ownersOptions.indexOf(value) > -1) {
											return;
										}

										const newOwnerOptions = [...ownersOptions];

										newOwnerOptions.splice(newOwnerOptions.length - 1, 0, value);

										setOwnerOptions(newOwnerOptions);
										props.onChange(value, props.data.id, field);
										setIsOwnerPopupOpen(false);
									}}
								/>
							</>
						) : field === 'supplier_name' ? (
							<>
								<button
									type="button"
									onClick={(): void => {
										setIsSupplierPopupOpen(true);
									}}
									className={`c-btn-arrow-down${isSupplierPopupOpen ? ' popup-open' : ''}`}
								></button>

								<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={suppliersOptions.map((option: any) => ({
										disabled: false,
										text: option.supplier_name,
										action: (): void => {
											option !== 'Add new' && setIsSupplierPopupOpen(false);
											props.onChange(option.supplier_name, props.data.id, field);
											let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
											props.onChange(supplier_id, props.data.id, 'supplier_id');
										}
									}))}
									onOutsideClick={(): void => {
										setIsSupplierPopupOpen(false);
									}}
									onAddField={async(value: string) => {
										if (!value || suppliersOptions.indexOf(value) > -1) {
											return;
										}

										const newSupplier:any = await addSupplier({'supplier_name': value, project_id: event.id, company_id: event.company_id})
										if( newSupplier && newSupplier.supplier ) {
											const newSuppliersOptions = [...suppliers];
											newSuppliersOptions.splice(newSuppliersOptions.length, 0, newSupplier.supplier);
											newSuppliersOptions.splice(newSuppliersOptions.length, 0, {supplier_name:'Add new'});
											setSuppliersOptions(newSuppliersOptions);
											dispatch(SuppliersActions.setSuppliers([...suppliers, newSupplier.supplier],0))
										}
									
										props.onChange(value, props.data.id, field);
									
										// setIsSupplierPopupOpen(false);
									}}
								/>
							</>
						) : null}
					</Cell>
				)
			)}

			
			<div className="c-table__cell-actions">
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
									onChange={(): void => {// Todo: dispach update
										return;
									}}
									onOutsideClick={(): void => setIsAttachmentsOpen(false)}
								/>

								<button
									type="button"
									onClick={handleRowCalendarClick}
									className={`c-btn-icon c-btn-icon--calendar`}
								>
									{isDateChosen ? (
										`${moment(date).format('DD/MM/YYYY')}`
									) : (
										<SVG src="/assets/images/calendar-icon1.svg" />
									)}
								</button>
								{/* <button
									type="button"
									onClick={(): void => {
										setIsCheched(!isChecked);
										props.onStatusChange(props.data.id);
										return;
									}}
									className={`c-btn-icon c-btn-icon--tick${isChecked ? ' checked' : ''}`}
								>
									<SVG src="/assets/images/tick-icon.svg" />
								</button> */}
			</div>

			<button
				type="button"
				onClick={(): void => props.onDelete(props.data.id)}
				className="c-btn-add-more c-btn-close"
			>
				<SVG src="/assets/images/add_circle-gray.svg" />
			</button>
		</div>
	);
};

export default PlanningRow;
