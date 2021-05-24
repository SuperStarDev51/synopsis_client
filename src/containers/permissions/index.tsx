import * as React from 'react';
import SVG from 'react-inlinesvg';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector, useDispatch } from 'react-redux';
import {PermissionsAction, PermissionsActionTypes} from '@containers/permissions/enums';
import {UserActionTypes, UsersActionTypes} from '@containers/user/enums';
import { RootStore } from '@src/store';
import { TableType, Table , ListView} from '@components';
import { Options } from '@containers/options'
import { addSupplierTitle, addSupplierCategory, deleteSupplierCategory } from './initial-state'
import {Routes, sortRows} from '@utilities'
import { Event } from '@containers/planning/interfaces';
import { updateUserPermissionType, updateUserPermissionStatus, updateUserJobTitle } from './initial-state'
import {getAllCompanyUsers} from "@root/src/containers/user/initial-state";

export const Permissions: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const suppliers = useSelector((state: RootStore) => state.suppliers);
	const events = useSelector((state: RootStore) => state.events)
	const user = useSelector((state: RootStore) => state.user)

	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [fields, setFields] = React.useState<any>(['supplier_name', 'email', 'supplier_job_title', 'permissions', 'status']);

	const permissionTypes = useSelector((state: RootStore) => state.permissionTypes);
	const permissionStatus = useSelector((state: RootStore) => state.permissionStatus);
	const allCompanyUsers = useSelector((state: RootStore) => state.allCompanyUsers);

	const tableHeadingStyle = {background: '#fff', fontSize: '1.2rem'};

	let allCompanyUsersData = {};
	allCompanyUsers
	&& allCompanyUsers.map((companyUser: any, index: number, allCompanyUsers: []) => {
		allCompanyUsersData = {
			id: companyUser.id,
			color: "#e3a481",
			supplier_category: "Users",
			allCompanyUsers: allCompanyUsers
		};
	});

	const changePermissionType = (userId, permissionTypeId): void => {
		updateUserPermissionType(userId, Number(permissionTypeId));
		// dispatch({
		// 	type: PermissionsActionTypes.UPDATE_USER_PERMISSION_TYPE,
		// 	payload: {
		// 		userId,
		// 		permissionTypeId
		// 	}
		// });
	};

	const changeJobTitle = (userId, jobTitleId): void => {
		updateUserJobTitle(userId, Number(jobTitleId));
		// dispatch({
		// 	type: PermissionsActionTypes.UPDATE_USER_JOB_TITLE,
		// 	payload: {
		// 		userId,
		// 		jobTitleId
		// 	}
		// });
	};

	const changePermissionStatus = (userId, permissionStatusId) => {
		updateUserPermissionStatus(userId, Number(permissionStatusId));
	};

	return (
		<div className="overflow-auto p-2">
			<div>
			{/*{allCompanyUsers.length*/}
				{/*?*/}
				{/*<ListView*/}
					{/*key={allCompanyUsersData.id}*/}
					{/*options*/}
					{/*fields={fields}*/}
					{/*setFields={setFields}*/}
					{/*id={allCompanyUsersData.id}*/}
					{/*type={TableType.SUPPLIERS}*/}
					{/*permissionMod*/}
					{/*index={allCompanyUsersData.id}*/}
					{/*list={allCompanyUsersData}*/}
					{/*category={formatMessage({id: 'users'})}*/}
					{/*rows={allCompanyUsersData.allCompanyUsers}*/}
				{/*/>*/}
				{/*:*/}
				{/*null*/}
			{/*}*/}

				<table className="table" style={{background: '#f2f4f6'}}>
					<thead>
					<tr>
						<th style={tableHeadingStyle}>Name</th>
						<th style={tableHeadingStyle}>Email</th>
						<th style={tableHeadingStyle}>Job title</th>
						<th style={tableHeadingStyle}>Permissions</th>
						<th style={tableHeadingStyle}>Status</th>
					</tr>
					</thead>
					<tbody>
					{allCompanyUsers.length
						? allCompanyUsers.map((companyUser: any) =>  {
						return (
							<UserRow
								key={companyUser.id}
								companyUser={companyUser}
								permissionTypes={permissionTypes}
								permissionStatus={permissionStatus}
								changePermissionType={changePermissionType}
								changePermissionStatus={changePermissionStatus}
								changeJobTitle={changeJobTitle}
							/>
						)
					}) : null}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export const UserRow: React.FunctionalComponent = ({
   companyUser,
   permissionTypes,
   permissionStatus,
   changePermissionType,
   changePermissionStatus,
   changeJobTitle,
}) => {
	const supplierJobTitles = useSelector((state: RootStore) => state.supplierJobTitles);

	const getTitleById = (titlesArr, companyUser, titleIdField, titleNameField) => {
		const correspondingJobTitleObj = titlesArr.filter(title => title.id === companyUser[titleIdField]);

		if (
			correspondingJobTitleObj
			&& correspondingJobTitleObj[0]
			&& correspondingJobTitleObj[0][titleNameField]
		) {
			return correspondingJobTitleObj[0][titleNameField];
		} else {
			return 'Not selected';
		}
	};

	return (
		<tr>
			<td>{companyUser.first_name} {companyUser.last_name}</td>
			<td>{companyUser.email}</td>
			<td>
				<select
					name=""
					id={'supplier-job-title' + companyUser.id}
					onChange={e => changeJobTitle(companyUser.id, e.target.value)}
				>
					<option value={companyUser.supplier_job_title}>
						{getTitleById(supplierJobTitles, companyUser, 'supplier_job_title_id', 'supplier_job_title')}
					</option>
					{supplierJobTitles.map(jobTitle => {
						return (
							<option
								key={jobTitle.id}
								value={jobTitle.id}
							>
								{jobTitle.supplier_job_title}
							</option>
						)
					})}
				</select>
			</td>
			<td>
				<select
					name=""
					id={'permission-type-' + companyUser.id}
					onChange={e => changePermissionType(companyUser.id, e.target.value )}
				>
					<option value={companyUser.permission_type_id}>
						{getTitleById(permissionTypes, companyUser, 'permission_type_id', 'permission_type')}
					</option>
					{permissionTypes.map(permissionType => {
						return (
							<option
								key={permissionType.id}
								value={permissionType.id}
							>
								{permissionType.permission_type}
							</option>
						)
					})}
				</select>
			</td>
			<td>
				<select
					name=""
					id={'permission-status-' + companyUser.id}
					onChange={e => changePermissionStatus(companyUser.id, e.target.value)}
				>
					<option value={companyUser.permission_status_id}>
						{getTitleById(permissionStatus, companyUser, 'permission_status_id', 'permission_status')}
					</option>
					{permissionStatus.map(permissionStatusItem => {
						return (
							<option
								key={permissionStatusItem.id}
								value={permissionStatusItem.id}
							>
								{permissionStatusItem.permission_status}
							</option>
						)
					})}
				</select>
			</td>
		</tr>
	)
};

export default Permissions;
