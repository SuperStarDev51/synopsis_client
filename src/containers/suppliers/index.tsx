import * as React from 'react';
import SVG from 'react-inlinesvg';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector, useDispatch } from 'react-redux';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { RootStore } from '@src/store';
import { TableType, Table , ListView} from '@components';
import { Options } from '@containers/options'
import { addSupplierTitle, addSupplierCategory, deleteSupplierCategory } from './initial-state'
import { sortRows } from '@utilities'
import { Event } from '@containers/planning/interfaces';
import { SupplierGroup } from './interfaces';
import { InviteUser } from "./InviteUser";

export const Suppliers: React.FunctionComponent = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const suppliers = useSelector((state: RootStore) => state.suppliers);
	const characters = useSelector((state: RootStore) => state.characters).map(c=> { return {
		...c,
		character:true,
		characters: [c.character_name]
	}})

	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [actorsFields, setActorsFields] = React.useState<any>(['supplier_name', 'characters', 'supplier_job_title', 'phone', 'email', 'status']);
	const [fields, setFields] = React.useState<any>(['supplier_name', 'supplier_job_title', 'phone', 'email', 'status']);

	const addNewCategory = async () => {
		let category: SupplierGroup = {
			id: uuidv4(),
			supplier_category: formatMessage({id: 'new_list'}),
			suppliers: {
				canban: [],
				default: []
			}
		};
		let newSupplierCategory:any = await addSupplierCategory(category.supplier_category, category.color, category.id, null)
		if ( newSupplierCategory && newSupplierCategory.supplier_category) {
			newSupplierCategory.supplier_category.suppliers = {
				canban: [],
				default: []
			};
			dispatch({
				type: SuppliersActionTypes.ADD_SUPPLIER_LIST,
				payload: newSupplierCategory.supplier_category
			});
		}
	};

	const handleSidebarTitleChange = async (event: React.ChangeEvent<HTMLInputElement>, id: number, color: string): void => {
		let newSupplierCategory:any = await addSupplierCategory(event.target.value, color, id);

		if ( newSupplierCategory && newSupplierCategory.supplier_category) {
			dispatch({
				type: SuppliersActionTypes.UPDATE_SUPPLIER_NAME,
				payload: {
					id,
					supplier_category: event.target.value,
				}
			});
		}
	};

	const [isInviteUserPopupVisible, setInviteUserPopupVisible] = React.useState(false);

	return (
		<div className="overflow-auto p-2">
			<div className="mb-2">
				<InviteUser
					isOpen={isInviteUserPopupVisible}
					toogle={setInviteUserPopupVisible}
				/>
				<button
					className="btn btn-primary"
					onClick={() => setInviteUserPopupVisible(true)}
				>
					Invite user
				</button>
			</div>
			<div>
			{suppliers.length ?
			suppliers.map((data: any, index: number) =>  {//SupplierGroup
			let charactersRows = characters.filter(c=>  c.supplier_id === 0).map(c=> { return {
				...c,
				category_id: data.id,
				company_id: activeEvent.company_id,
				character:true,
				characters: [c.character_name]
			}});

			return (
				<ListView
				   key={index}
				   options
				   fields={index == 0 ? actorsFields : fields}
				   setFields={index == 0 ? setActorsFields : setFields}
				   id={data.id}
				   handleSidebarTitleChange={() => handleSidebarTitleChange(event, data.id, data.color)}
				   type={TableType.SUPPLIERS}
				   index={index}
				   addNewCategory={addNewCategory}
				   deleteCategory={(listId: number) => {
					   deleteSupplierCategory(listId);
					   dispatch({
						   type: SuppliersActionTypes.DELETE_SUPPLIER_LIST,
						   payload: {category_id: listId}
					   });
				   }}
				   list={data}
				   category={data.supplier_category}
				   rows={data.suppliers.default}
				   updateColumnTitleDispatch={(key: string, value: any, category_id: number) => {
					addSupplierTitle({company_id: activeEvent.company_id,project_id: activeEvent.id, category_id,  key, value})
					dispatch({
						type: SuppliersActionTypes.SET_SUPPLIER_TITLE,
						payload: {category_id, key, value}
					})
					}}
				   deleteColumnDispatch={(key: string, category_id: number) => {
					addSupplierTitle({company_id: activeEvent.company_id, project_id: activeEvent.id, category_id, key, value: null})
					let current_fields = index == 0 ? actorsFields : fields
					   console.log('current_fields: ', current_fields)
					let filtered_fields = current_fields.map((field: string, index: number) => {if(field == key) { return };return field}).filter(e=>e)
					if( index == 0) setActorsFields(filtered_fields); else setFields(filtered_fields)
					dispatch({
						type: SuppliersActionTypes.DELETE_CATEGORY_COLUMN,
						payload: {category_id, key}
					});

					dispatch({
						type: SuppliersActionTypes.SET_SUPPLIER_TITLE,
						payload: {category_id, key, value:undefined}
					})
					}}
				   addColumnDispatch={(key: string, value: any, category_id: number) => {
						let titleName = `New ${key.replace(/[0-9]/g, '')} column`
						addSupplierTitle({company_id: activeEvent.company_id, project_id: activeEvent.id, category_id,key, value: titleName})
						dispatch({
							type: SuppliersActionTypes.SET_SUPPLIER_TITLE,
							payload: {category_id, key, value: titleName}
						})

						dispatch({
							type: SuppliersActionTypes.ADD_SUPPLIER_COLUMNS,
							payload: {
								category_id,
								key,
								value
							}
						});
					}}
				   titles={data.supplier_title}
				   // provided={provided}
				   // innerRef={provided.innerRef}

				 />
				)}
				):null}
			</div>
		</div>
	);
};

export default Suppliers;
