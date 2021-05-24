import * as React from 'react';
import * as moment from 'moment';
import axios from 'axios';
import SVG from 'react-inlinesvg';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { NewCell, Attachments } from '@components';
import CalendarComponent from '../calendar';
import { TaskListViewItem } from '@src/containers/tasks';
import { addSupplier } from '@containers/suppliers/initial-state';
import { TaskTypesActionTypes } from '@src/containers/tasks/ListsReducer';
import { addTaskType, addTaskFile, deleteTaskFile } from '@src/containers/tasks/initial-state';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { Event } from '@containers/planning/interfaces';
import { useIntl } from "react-intl";
import { User } from 'react-feather'
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"


import {
	Droppable,
	Draggable,
	DropResult,
	DragDropContext,
	DraggableLocation,
	DroppableProvided,
	DraggableProvided,
	DraggableStateSnapshot
} from 'react-beautiful-dnd';

interface Props {
	readonly data: TaskListViewItem;
	readonly color: string;
	readonly fields : any;
	readonly listIndex:number
	readonly listId:number
	readonly child?: boolean;
	readonly DragSnapshot?: any;
	readonly index: number;
	readonly onChange: (value: any, id: string, field: string, parent_id?: number) => void;
	readonly onBlur: (value: any, id: string | number, field: string, parent_id?: number) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onDelete: (id: string, parent_id?: number) => void;
	disableParentDroppable?: string;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly onStatusChange: (id: string) => void;
}

export const TaskListViewRow: React.FunctionComponent<Props> = (props: Props) => {
	const { fields, child, listIndex,listId , data, index, innerRef, provided,  DragSnapshot, disableParentDroppable, onChange, onBlur, onKeyPress} = props
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const inputRef = React.useRef(null);
	const [isAttachmentsOpen, setIsAttachmentsOpen] = React.useState(false);
	const [isTypePopupOpen, setIsTypePopupOpen] = React.useState(false);
	const taskTypes = useSelector((state: RootStore) =>state.taskTypes);
	const [typeOptions, setTypeOptions] = React.useState([...taskTypes, {task_type: formatMessage({id: 'add_new'})}]);
	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date>(new Date());
	const [isDateChosen, setIsDateChosen] = React.useState(data.due_date ? true : false);
	const [isChecked, setIsCheched] = React.useState<boolean>(false);
	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);

	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name:formatMessage({id: 'add_new'})}]);
	const event = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])
	React.useEffect(() => {
		if (data.due_date) {
			setDate(new Date(data.due_date))
		}
	}, [data.due_date]);

	const isReadonly = (field: string): boolean => ['scene_id', 'synofsis', 'location'].includes(field);
	const isOptions = (field: string): boolean => ['type', 'supplier_name'].includes(field);
	const handleRowCalendarClick = () => {
		setIsCalendarOpen(!isCalendarOpen);
	};


	return (
		<div
			ref={innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			className={`n-row position-relative d-flex mb-02 ${isCalendarOpen ? 'is-calendar-open' : ''} ${child ? 'c-row_child' : '' }`}

		>

			{false && (
				<input type="checkbox" checked={child} className="n-row__checkbox"/>
			)}

			{isCalendarOpen && (
				<CalendarComponent
					onChange={async(date: Date) => {
						setDate(date);
						onChange(date, data.id, 'due_date', data.parent_task_id);
						onBlur(date, data.id, 'due_date', data.parent_task_id);
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



			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields &&
			(
			fields.map((field: string, index: number) =>
			<InputGroup>
					<NewCell
						id={data.id}
						key={index}
						type={field === 'price' || field.includes('number') ? 'number' : 'string'}
						field={field}
						date={date}
						value={(data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ?
							(value)=>onChange(value,data.id,field,data.parent_task_id)
						:
						(value)=>{
							onChange(value, data.id, field,data.parent_task_id);
							if( field == 'type' ) setIsTypePopupOpen(true)
							else if ( field === 'supplier_name') setIsSupplierPopupOpen(true)
						}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value)=> onBlur(value, data.id, field, data.parent_task_id) : ()=>{}}
						classnames={['width-10-rem']}
						onKeyPress={props.onKeyPress}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
					>
						{field === 'type' ? (
							<>
								<button
									type="button"
									onClick={(): void => {
										setIsTypePopupOpen(!isTypePopupOpen);
									}}
									className={`c-btn-arrow-down${open ? ' popup-open' : ''}`}
								></button>


								<Popup
									isOpen={isTypePopupOpen}
									onClick={(): void => {
										return;
									}}
									options={typeOptions.length ? typeOptions.map((option: any) => ({
										disabled: false,
										text: option.task_type,
										action: (): void => {
											setIsTypePopupOpen(!isTypePopupOpen);
											props.onChange(option.task_type, data.id, field, data.parent_task_id);
										}
									})) : []}
									onOutsideClick={(): void => setIsTypePopupOpen(false)}
									onAddField={async(value: string) => {
										if (!value || typeOptions.indexOf(value) > -1) {
											return;
										}

										const newTaskType:any = await addTaskType(value, null)
										if( newTaskType && newTaskType.task_type ) {
											const newTypeOptions = [...taskTypes];
											newTypeOptions.splice(newTypeOptions.length, 0, newTaskType.task_type);
											newTypeOptions.splice(newTypeOptions.length, 0, {task_type: formatMessage({id: 'add_new'})});
											setTypeOptions(newTypeOptions);
											dispatch({
												type: TaskTypesActionTypes.SET_TASK_TYPES,
												payload: [...taskTypes, newTaskType.task_type]
											});
										}
										onChange(value, data.id, field, data.parent_task_id);
										onBlur(value, data.id, field, data.parent_task_id);
									}}
								/>
							</>
						) : null}



						</NewCell>
			</InputGroup>
			))}

			<div className="d-flex">
					<div className="position-relative">
							<button
									type="button"
									onClick={(): void => {
										setIsSupplierPopupOpen(true);
									}}
									className="cursor-pointer d-flex align-items-center bg-gray-important border-color-white form-control pr-1-important"
								>
									<User />
							</button>
							<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={suppliersOptions.map((option: any) => ({
										disabled: false,
										text: option.supplier_name,
										action: (): void => {
											option !== formatMessage({id: 'add_new'}) && setIsSupplierPopupOpen(false);
											let supplier_id = option.supplier_name ? suppliers.filter((x:any) => {if(x['supplier_name'] == option.supplier_name){return x}})[0].id : null;
											onBlur(supplier_id, data.id, 'supplier_id', data.parent_task_id);
											// move to other user
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
											newSuppliersOptions.splice(newSuppliersOptions.length, 0, {supplier_name:formatMessage({id: 'add_new'})});
											setSuppliersOptions(newSuppliersOptions);
											dispatch(SuppliersActions.setSuppliers([...suppliers, newSupplier.supplier],0))
										}
										props.onChange(value, data.id, 'supplier_name', data.parent_task_id);
										// setIsSupplierPopupOpen(false);
									}}
								/>
						</div>
							<button
									type="button"
									onClick={(): void => {
										setIsAttachmentsOpen(true);
									}}
									className="cursor-pointer d-flex align-items-center bg-gray-important border-color-white form-control pr-1-important"
								>
									<SVG src="/assets/images/clip-icon.svg" style={{height: '1.5rem', width: '1.5rem'}}/>
								</button>
								<Attachments
									isOpen={isAttachmentsOpen}
									setIsAttachmentsOpen={setIsAttachmentsOpen}
									attachments={data.attachments}
									onFileDelete={(file_id: string, file_name: string): void => {
										deleteTaskFile(file_id, file_name, data.id)
									}}
									onOutsideClick={(): void => setIsAttachmentsOpen(false)}
									onChange={(f:File): void => {addTaskFile(data.id, f)}} // Todo: dispach update
								/>
								{/* <button
									type="button"
									onClick={handleRowCalendarClick}
									className={`c-btn-icon c-btn-icon--calendar`}
								>
									{isDateChosen ? (
										`${moment(date).format('DD/MM/YYYY')}`
									) : (
										<SVG src="/assets/images/calendar-icon1.svg" />
									)}
								</button> */}

								<button
									type="button"
									onClick={(): void => {
										setIsCheched(!isChecked);
										props.onStatusChange(data.id);
										return;
									}}
									className={`cursor-pointer d-flex align-items-center bg-gray-important border-color-white form-control pr-1-important ${isChecked ? ' checked' : ''}`}
								>
									<SVG src="/assets/images/tick-icon.svg" style={{height: '1.5rem', width: '1.5rem'}}/>
								</button>


							</div>

				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle
					className="n-btn-delete mr-1 mb-1"
					size={20}
					onClick={(): void => props.onDelete(props.data.id)}/>
					</div>
	      		 </div>


			{/* <Droppable  droppableId={`${listId}-${listIndex}-${index}`} key={`${index}`} direction="vertical"
			 			isDropDisabled={disableParentDroppable != `${listId}-${listIndex}-${index}`}>
		{(provided: DroppableProvided, snapshot: DraggableStateSnapshot): React.ReactElement => (
						<div ref={provided.innerRef}  {...provided.droppableProps}>
					{data.child_tasks && data.child_tasks.length ?
					data.child_tasks.map((data: TaskListViewItem, key: number) =>
					<Draggable index={key} key={key} draggableId={`${data.id}${key}`} isDragDisabled={false}>
						{(provided: DraggableProvided): React.ReactElement => (<>
							<TaskListViewRow
								child
								fields={fields}
								data={data}
								color={data.color}
								onKeyPress={props.onKeyPress}
								onDelete={props.onDelete}
								onChange={props.onChange}
								onBlur={props.onBlur}
								provided={provided}
								innerRef={provided.innerRef}
								onStatusChange={props.onStatusChange}
							/>


				</>	)}
					</Draggable>

					)
					:null}

				{provided.placeholder}
			</div>
			)}

			</Droppable>	 */}
	</div>
	);
};

export default TaskListViewRow;
