import { SuppliersActionTypes } from './enums';
import { suppliersInitialState } from './initial-state';
import { Supplier, SuppliersAction, SupplierGroup } from './interfaces';

export default (state = suppliersInitialState, { type, payload }: SuppliersAction): SupplierGroup[] => {
	const copy = [...state];

	switch (type) {

		case SuppliersActionTypes.UPDATE_ACTOR_PARAMS:
			const { id, field, value } = payload;

			return state.map(supplierCategory => {
				if (supplierCategory.supplier_category !== 'Actors') {
					return supplierCategory;
				}
				return {
					...supplierCategory,
					suppliers: {
						...supplierCategory.suppliers,
						default: supplierCategory.suppliers.default.map(actor => {
							if (actor.id !== id) {
								return actor;
							}
							return {
								...actor,
								[field]: value
							}
						})
					}
				}
			});

		case SuppliersActionTypes.ADD_SUPPLIER_LIST:
			return [...state, payload];

		case SuppliersActionTypes.UPDATE_SUPPLIER_NAME:
			return copy.map(item =>
				item.id === payload.id
					? {...item, supplier_category: payload.supplier_category }
					: item);

		case SuppliersActionTypes.DELETE_SUPPLIER_LIST:
			return state.filter((list: any) => list.id !== payload.category_id);

		case SuppliersActionTypes.SET_SUPPLIERS:
			// eslint-disable-next-line
			const { index, title, rows } = payload;

			copy[index] = {
				...copy[index],
				supplier_category: title ? title : copy[index].supplier_category,
				suppliers: {
					...copy[index].suppliers,
					default: rows
				}
			};
			return copy

		case SuppliersActionTypes.SET_SUPPLIERS_GROUP:
			return payload;

		case SuppliersActionTypes.CHANGE_SUPPLIER_PARAM:

			console.log('payload: ', payload)

			return state.map(item => {
				if (item.supplier_category !== payload.supplierCategory.category) {
					return item;
				}
				return {
					...item,
					suppliers: {
						...item.suppliers,
						default: item.suppliers.default.map(supplier => {
							if (supplier.supplier_id !== payload.supplierId) {
								return supplier;
							}
							return {
								...supplier,
								[payload.supplierCategory.field]: payload.value,
							}
						})
					}
				}
			});

		case SuppliersActionTypes.SET_SUPPLIER_TITLE:
				const newTitles = (titles: any, key: string, value: any) => {
					let newTitles:any = titles
					newTitles[key] = value
					return newTitles
				}
					return state.map((list: any) => {
						const { category_id, key, value } = payload
						if (list.id !== category_id) return list;
						else return {
							...list,
							//supplier_title: newTitles(list.supplier_title, key, value)
							supplier_title: {
								...list.supplier_title,
								[key]: value,
							}
						};
					});

		case SuppliersActionTypes.DELETE_CATEGORY_COLUMN:
			  return state.map((item: any) => {
					const { key, category_id } = payload
					const newItem = (item: any) => {
						var newItem:any = {}
						Object.keys(item).map((field: string, index: number) => {
							if( field == key )	return;
							newItem[field] = item[field]
						})
						return newItem
					}
					if (item.id !== category_id) return item;
					else return {
						...item,
						suppliers:{
							...item.suppliers,
							default: item.suppliers.default.map((supplier: any)=> {return newItem(supplier)})
						}
					};
			  });

		case SuppliersActionTypes.ADD_SUPPLIER_COLUMNS:
			return state.map((list: any) => {
				const { category_id, key, value } = payload
				if (list.id != category_id) return list
				else return  {
					...list,
					suppliers: console.log('ADD_SUPPLIER_COLUMNS updated list', list) || {
						...list.suppliers,
						default: list.suppliers.default.map((supplier: any) => {
							return {
								...supplier,
								[key]: value
							}
						})
					}
				}
			});

		default:
			return state;
	}
};
