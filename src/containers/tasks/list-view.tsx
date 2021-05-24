import * as React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from "react-intl"
import { UsersActionTypes } from './enums';
import { Popup, Table, TableType } from '@components';
import { ListInterface, DefaultTaskInterface } from './interfaces';
import { addTaskCategory, deleteTaskCategory } from './initial-state'

interface Props {
	id: string;
	list: ListInterface;
}

export const ListView: React.FunctionComponent<Readonly<Props>> = (props: Readonly<Props>) => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { id, list } = props;
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);
	const [isSortingPopupOpen, setIsSortingPopupOpen] = React.useState(false);
	const [sidebarTitle, setSidebarTitle] = React.useState(list.task_category);
	const handleSidebarTitleChange = (e: any): void => { if( e && e.target && e.target.value ) setSidebarTitle(e.target.value);};
	React.useEffect(() => {	setSidebarTitle(props.list.task_category)}, [props.list]);

	return (
		<div className={`c-table-wrapper c-table-wrapper`}>
			<div className={`c-table__sidebar c-table__sidebar${isPopupOpen ? ' popup-open' : ''}`}>
				<h3 className="c-table__sidebar-title c-table__sidebar-title">
					<input
						onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
							handleSidebarTitleChange(event);
						}}
						type="text"
						name=""
						id={list.id}
						placeholder={formatMessage({id: 'enter_title'})}
						value={sidebarTitle}
					/>
				</h3>
				<span
					onClick={(): void => {
						setIsPopupOpen(!isPopupOpen);
					}}
				/>

				<Popup
					isOpen={isPopupOpen}
					onClick={(): void => {
						return;
					}}
					onOutsideClick={(): void => setIsPopupOpen(false)}
					options={[
						{
							disabled: false,
							text: formatMessage({id: 'new'}),
							action: (): void => {
								setIsPopupOpen(!isPopupOpen);
								let category = {
									id: uuidv4(),
									title: formatMessage({id: 'new_list'}),
									color: '',
									tasks: {
										canban: [],
										default: []
									}
								}
								dispatch({
									type: UsersActionTypes.ADD_LIST,
									payload: {
										id,
										category
									}
								});
								// addTaskCategory(category.title, list.user_id, list.project_id, list.color, list.id )
							}
						},
						{
							disabled: false,
							text: formatMessage({id: 'delete'}),
							action: (): void => {
								setIsPopupOpen(!isPopupOpen);
								deleteTaskCategory(list.id)
								dispatch({
									type: UsersActionTypes.REMOVE_LIST,
									payload: {
										id,
										listId: list.id
									}
								});
							}
						}
					]}
					className="c-popup"
				/>
			</div>

			<div
				onClick={(): void => {
					setIsSortingPopupOpen(!isSortingPopupOpen);
				}}
				className={`c-table__options c-table__options${
					isSortingPopupOpen ? ' popup-open' : ''
				}`}
			>
				<h3 className="c-table__options-title c-table__options-title">Sort by</h3>

				<Popup
					isOpen={isSortingPopupOpen}
					onClick={(): void => {
						return;
					}}
					onOutsideClick={(): void => setIsSortingPopupOpen(false)}
					options={[
						{
							disabled: false,
							text: formatMessage({id: 'new'}),
							action: (): void => {
								setIsSortingPopupOpen(!isSortingPopupOpen);
							}
						},
						{
							disabled: false,
							text: formatMessage({id: 'due_date'}),
							action: (): void => {
								setIsSortingPopupOpen(!isSortingPopupOpen);
							}
						}
					]}
					className="c-popup"
				/>
			</div>

			<Table
				id={id}
				type={TableType.TASK_LIST_VIEW}
				rows={list.tasks.default
					.filter((task: DefaultTaskInterface) => task.status === 'Active' )//active
					.map((task: DefaultTaskInterface) => ({ ...task, listId: list.id }))}
				index={0}
				key={0}
				listId={list.id}
			/>
		</div>
	);
};
