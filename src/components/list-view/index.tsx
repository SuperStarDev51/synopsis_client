import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { Options } from '@containers/options'
import { sortRows } from '@utilities'
import * as moment from 'moment';
import { UsersActionTypes } from '@containers/tasks/enums';
import { Popup, Table, TableType } from '@components';
import { Event } from '@containers/planning/interfaces';
import { ArrowDown, ArrowUp } from 'react-feather';
import { FormattedMessage, useIntl } from "react-intl"
import { Icon } from '@components';
import { config } from '../../config';

interface Props {
	readonly id: string;
	readonly extraRows: any[];
	readonly extraRowsFields: any[];
	readonly options?: boolean;
	readonly titles?: any;
	readonly type: TableType
	readonly index: number;
	readonly list: any;
	readonly headerColor?: string;
	readonly rows: any;
	readonly number?: number;
	readonly category: any;
	readonly provided?: any;
	readonly disableParentDroppable?: string;
	readonly innerRef?: any;
	readonly fields: any;
	readonly isDone?: boolean;
	readonly setFields: (value: any[]) => void;
	readonly addColumnDispatch: (key: string, value: any, category_id: number) => void;
	readonly deleteColumnDispatch: (key: string, category_id: number) => void;
	readonly updateColumnTitleDispatch: (key: string, value: string, category_id: any) => void;
	readonly addNewCategory?: () => void;
	readonly deleteCategory?: (listId:number) => void;
	readonly handleSidebarTitleChange?: (event: React.ChangeEvent<HTMLInputElement>, user_id: number, project_id: number, color: any, id: number) => void;
	readonly availableShootingDaysOptions: any[];
}
	export const ListView: React.FC<Props> = (props: Props) => {

	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { id, sd, list,titles, availableShootingDaysOptions, headerColor, extraRows, extraRowsFields,  isDone, type, permissionMod, options, rows, index,fields, category, number, setFields,addColumnDispatch, deleteColumnDispatch, updateColumnTitleDispatch, addNewCategory, deleteCategory, handleSidebarTitleChange, provided,  innerRef , disableParentDroppable} = props;
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);
	const [sidebarTitle, setSidebarTitle] = React.useState(category);
	const event = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])

	const totalExpenses = type === TableType.EXPENSES || type === TableType.UNPLANNED ? rows.reduce((acc: number, row: any) => {
		if (row.price === undefined) {
			return acc + 0;
		}
		let quantity = row.quantity ? Number(row.quantity) : 1
		return Number(acc) + (Number(row.price) * quantity);
	}, 0) : 0;
			// const maxIndexColumn = (fields: any, type: string) => {
			// 	let columnItems:any = fields.map((field:any, index:number)=> {
			// 		if(type == 'number' && field.includes('number')) {
			// 			return Number(field.split('number')[1])
			// 		}
			// 		if(type == 'text' &&  field.includes('text') ) {
			// 			return Number(field.split('text')[1])
			// 		}
			// 		else return
			// 	})
			// 	return columnItems.filter(c=>c).length ?  Math.max(...columnItems.filter(c=>c)) : 0
			// }
			// React.useEffect(() => {
			// 		setSidebarTitle();
			// }, [list]);
	const [isShootingDaysPopupOpen, setIsShootingDaysPopupOpen] = React.useState(false);

	React.useEffect(()=>{
		setSidebarTitle(category)
	},[category]);

	return (
		<div className="p-2" data-id="">
			<div className="font-medium-3 d-flex align-items-center position-relative">
				<div className="d-flex align-items-center" style={{color: list.color}}>
					{sidebarTitle && sidebarTitle === 'no_date' && (
						typeof(sidebarTitle) === 'object'
							?
							<div className="d-flex justify-content-start align-items-center">
								<div className="bg-light-gray font-medium-1 p-05">{number+1}</div>
								<div className="d-flex align-items-center bg-light-gray font-medium-1 p-05 ml-1">
									<Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
									({sidebarTitle ? moment(sidebarTitle).locale('he').format('LL') : null})
								</div>
							</div>
							:
							<div>
								<div>
									<span
										className="cursor-pointer"
										onClick={(): void => {setIsShootingDaysPopupOpen(!isShootingDaysPopupOpen)}}
									>
										<FormattedMessage id="no_date"/>
									</span>
									<Popup
										isOpen={isShootingDaysPopupOpen}
										onClick={(): void => {return;}}
										onOutsideClick={(): void => setIsShootingDaysPopupOpen(false)}
										options={availableShootingDaysOptions.map(shootingDay => ({
											key: shootingDay.dayId,
											text: shootingDay.dayNumber.toString(),
											disabled: !addNewCategory,
											action: (): void => {
												setIsShootingDaysPopupOpen(!isShootingDaysPopupOpen);
												handleSidebarTitleChange(shootingDay.dayId, list.id)
											}
										}))}
										className="c-popup--tasks-list-view"
									/>
								</div>
							</div>
					)}
					{(sidebarTitle && sidebarTitle !== 'no_date')
						? typeof(sidebarTitle) === 'object'
							? <div className="d-flex justify-content-start align-items-center">
								<div className="bg-light-gray font-medium-1 p-05">{number+1}</div>
								<div className="d-flex align-items-center bg-light-gray font-medium-1 p-05 ml-1">
									<Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
									({sidebarTitle ? moment(sidebarTitle).locale('he').format('LL') : null})
								</div>
								</div>
							: handleSidebarTitleChange
								? <input
									onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
										handleSidebarTitleChange(event,list.id, list.project_id, undefined, list.id);
										setSidebarTitle(event.target.value);

									}}
									type="text"
									className="max-width-10-rem  bg-transparent border-0 width-10-rem"
									id={list.id}
									placeholder={formatMessage({id: 'enter_title'})}
									value={sidebarTitle}
									style={{color: list.color}}
								  />
								: sidebarTitle
						: null}

					{addNewCategory && (
					<div className="p-075"
						onClick={(): void => {
							setIsPopupOpen(!isPopupOpen);
						}}>
					{/* {isPopupOpen ? <ArrowUp className="text-light-purple" size={16}/> : <ArrowDown className="text-light-purple" size={16}/>} */}
					{isPopupOpen ?
						<Icon src={config.iconsPath+"options/dropdown-down.svg"}/> :
						<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
					}
					</div>
				)}
				</div>

				<Popup
					isOpen={isPopupOpen}
					onClick={(): void => {
						return;
					}}
					onOutsideClick={(): void => setIsPopupOpen(false)}
					options={[
						{
							text: formatMessage({id: 'new'}),
							disabled: !addNewCategory,
							action: (): void => {
								setIsPopupOpen(!isPopupOpen);
								if( addNewCategory) addNewCategory()
							}
						},
						{
							text: formatMessage({id: 'delete'}),
							disabled: Boolean(rows.length > 0),
							action: (): void => {
								setIsPopupOpen(!isPopupOpen);
								if( deleteCategory ) deleteCategory(list.id)
							}
						}
					]}
					className="c-popup--tasks-list-view"
				/>

			{/* {type === TableType.EXPENSES || type === TableType.UNPLANNED && (
				<div className="d-flex h6"><FormattedMessage id="total"/>- <div className="ml-05 text-bold-600">${totalExpenses}</div></div>
			)} */}

			</div>

		{options && (
			<Options
			   fields={fields}
			   category_id={list.id}
			   addColumnDispatch={addColumnDispatch}
			   setFields={setFields}
			   sortBy={(field: string)=>{
				sortRows(list.tasks.default, field)
				.then(rows=>{
					dispatch({
						type: UsersActionTypes.SET_TASKS,
						payload: {
							id,
							rows,
							listId: list.id
						}
					});
				})

			}}/>

		)}

			<Table
				id={id}
				sd={sd}
				type={type}
				permissionMod={permissionMod}
				rows={rows.map((row:any) => {
					return { ...row, color: list.color
				}})}
				titles={titles ? titles : undefined}
				setFields={setFields}
				disableParentDroppable={disableParentDroppable}
				deleteColumnDispatch={deleteColumnDispatch}
				updateColumnTitleDispatch={updateColumnTitleDispatch}
				fields={fields}
				provided={provided}
				innerRef={innerRef}
				headerColor={headerColor}
				index={index}
				key={index}
				isDone={isDone}
				listId={list.id}
			/>
			{extraRows && extraRows.length && index == 0 ? (
				<Table
					disableDelete
					disableAddNew
					id={id}
					type={TableType.CHARACTER}
					rows={rows.map((row:any)=> { return { ...row, color: list.color}})}
					extraRows={extraRows.map((row:any)=> { return { ...row, color: list.color}})}
					titles={titles ? titles : undefined}
					fields={extraRowsFields}
					index={index}
					isDone={isDone}
					listId={list.id}
				/>
			): null}
		</div>
	);
};

export default ListView;
