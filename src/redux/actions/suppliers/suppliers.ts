import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { SupplierGroup } from '@src/containers/suppliers/interfaces';


export const setSuppliersGroup = (suppliers:SupplierGroup[]) => {
  return (dispatch: any) => {
    dispatch({
      type: SuppliersActionTypes.SET_SUPPLIERS_GROUP,
      payload: suppliers,
    });
  }
}

export const setSuppliers = (rows: any, index: number, title?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: SuppliersActionTypes.SET_SUPPLIERS,
      payload: {
        rows,
        title,
        index
      }
    });
  }
}


