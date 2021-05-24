import * as React from 'react';
import SVG from 'react-inlinesvg';
import { DraggableProvided } from 'react-beautiful-dnd';
import { addSupplier } from '@containers/suppliers/initial-state';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { SupplierJobTitlesActionTypes } from '@src/containers/tasks/ListsReducer';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
import { Expense } from '@containers/budget/interfaces';
import {NewCell,  Cell,Table,TableType, ListView,Popup, Attachments } from '@components';
import { useIntl } from 'react-intl';
import { Event } from '@containers/planning/interfaces';
import { InputGroup, InputGroupText, InputGroupAddon, Button,Card,  CardBody } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"

interface Props {
	readonly data: Expense;
	readonly color: string;
	readonly index: number;
	readonly row_index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly fields: any[];
}

export const ExtraExpenseRow: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const { data, index, row_index, fields, onBlur, onChange } = props;
	const dispatch = useDispatch();
	const inputRef = React.useRef(null);
	const isReadonly = (field: string): boolean => ['supplier_name', 'total', 'payments'].includes(field);
	const isOptions = (field: string): boolean => ['type', 'status', 'supplier_job_title', 'payments'].includes(field);

	return (
		<div
			ref={props.innerRef}
			className="n-row position-relative d-flex mb-02"
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, index: number) => (
			<InputGroup>
				<NewCell
						id={index}
						key={index}
						type={
							field === 'account_id' || field === 'price' || field === 'quantity'
								? 'number'
								: 'string'
						}
						field={field}
						value={field == 'total' ? data.quantity > 0 ?  Number(data.price) * data.quantity : data.price :
							   (data as any)[field]}
						prefix={['price', 'income', 'total', 'vat', 'price-prim'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ?
							(value)=>onChange(value,props.index,field)
						:
						(value)=>{
							onChange(value, props.index, field);
							// if( field == 'type' ) setIsTypePopupOpen(true)
						}}
						classnames={['width-10-rem']}
						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value)=> onBlur(value, props.index, field) : ()=>{}}
						placeholder={field}
					>
				</NewCell>
			</InputGroup>
			))}
			{!props.disableDelete ? (
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
						<XCircle
						className="n-btn-delete mr-1 mb-1"
						size={20}
						onClick={(): void => props.onDelete(props.index)}/>
					</div>
				</div>
			):null}
		</div>
	);
};

export default ExtraExpenseRow;
