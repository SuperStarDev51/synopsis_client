import { SuppliersActionTypes } from './enums';
import { Attachment } from '@src/components/attachments/interfaces';

export interface SuppliersAction {
	type: SuppliersActionTypes;
	payload: any;
}

export interface SupplierGroup {
	id: any;
	supplier_category: string;
	supplier_title: any;
	suppliers: {
		canban: any[];
		default: Supplier[];
	};
	color:string;
	createdAt: string;
	deletedAt: string;
	updatedAt: string;
	project_id: number
}

export interface Supplier {
	readonly pos: number;
	readonly id: number;
	readonly characters: any[];
	readonly company_id: string;
	readonly supplier_name: string,
	readonly color: string;
	readonly type: string;
	readonly contact_name: string;
	readonly supplier_job_title: string;
	readonly supplier_job_title_id: number;
	readonly supplier_unit_type: string;
	readonly supplier_unit_type_id: number;
	readonly supplier_unit_cost: number;
	readonly character: Boolean;
	readonly 'percentage1': number;
	readonly 'percentage2': number;
	readonly 'percentage3': number;
	readonly start_date: string | Date;
	readonly end_date: string | Date;
	readonly phone: string;
	readonly email: string;
	readonly status: string;
	readonly comments: string,
	readonly attachments: Attachment[]
}
