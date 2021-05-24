import * as React from 'react';
import SVG from 'react-inlinesvg';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell, CalendarComponent } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import {  addSupplierUnitType } from '@containers/suppliers/initial-state';
import { SupplierJobTitlesActionTypes, SupplierTypesActionTypes, SupplierUnitTypesActionTypes } from '@src/containers/tasks/ListsReducer';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"

interface Props {
	readonly data: any;
	readonly row_index: number;
	readonly color: string;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress?: (id: string) => void;
	readonly fields: any;
}

export const UnplannedRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data,row_index, fields, onChange, onBlur, onKeyPress } = props
	const isReadonly = (field: string): boolean => ['description', 'price', 'quantity', 'total', 'comments'].includes(field);
	const isOptions = (field: string): boolean => [''].includes(field);
	

	return (
		<div
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(row_index)
				}
			}}
		>
			{/* <span className="n-row__color" style={{ backgroundColor: props.color }} /> */}

			{fields.map((field: string, index: number) =>
					<InputGroup>
					<NewCell
						id={row_index}
						key={index}
						type={field === 'quantity' || field === 'price' ||  field === 'total' ? 'number' : 'string'}
						field={field}
						value={field == 'total' ? data.quantity > 0 ?  data.price * data.quantity : data.price : 
								(data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ? 
							(value:any)=>onChange(value, row_index,field)
						:
						(value:any)=>{
							onChange(value, row_index, field);
							// if( field == 'supplier_unit_type' ) setIsTypePopupOpen(true)
						}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, row_index, field) : ()=>{}}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						classnames={['width-10-rem']}
					>
					
					</NewCell>
					</InputGroup>
			)}
			
			{/* <div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle 
					className="n-btn-delete mr-1 mb-1"
					size={20} 
					onClick={(): void => props.onDelete(props.data.id)}/>
					</div>
	       </div> */}
		</div>
	);
};

export default UnplannedRow;
