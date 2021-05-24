import * as React from 'react';
import SVG from 'react-inlinesvg';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell, CalendarComponent } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"

interface Props {
	readonly data: any;
	readonly color: string;
	readonly index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: number |string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly fields: any;
}

export const PaymentRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, index, fields, onChange, onBlur, onKeyPress } = props
	const [dates, setDates] = React.useState(data.date ? [new Date(data.date)] : []);
	const isReadonly = (field: string): boolean => [''].includes(field);
	const isOptions = (field: string): boolean => ['date'].includes(field);
	const isNumber = (field: string): boolean => ['accounting_id', 'tax_id', 'amount'].includes(field);

	return (
		<div
			ref={props.innerRef}
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(index)
				}
			}}
			{...props.provided.draggableProps}
			{...props.provided.dragHandleProps}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, field_index: number) => 
					<InputGroup style={{flexWrap: 'unset'}}>
				{field === 'date' ?
					<CalendarComponent
					flatpickr
					className='sqaure form-control pr-0 width-10-rem border-color-white border-left'
					onChange={(dates: any): void => {
						setDates(dates)
						let date = dates[0]
						if( date ) {
							onChange(date, index, field);
							onBlur(date, data.id, field)
						}
					}}
					date={dates}
					/>
					: 
					<>
					<NewCell
						id={data.id}
						key={field_index}
						type={isNumber(field) ? 'number' : 'string'}
						field={field}
						value={(data as any)[field]}
						field={field}
						value={(props.data as any)[field]}
						prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={!isOptions(field) ? 
							(value:any)=> onChange(value, index,field)
						:
						(value:any)=>{
							onChange(value, index, field);
							// if( field == 'supplier_unit_type' ) setIsTypePopupOpen(true)
						}}
						onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, data.id, field) : ()=>{}}

						inputRef={index === 0 ? inputRef : null}
						isReadOnly={isReadonly(field)}
						classnames={['width-10-rem']}
					>
					</NewCell>
					<div className="fonticon-container">
						<div className="fonticon-wrap width-0 height-auto">
						<XCircle 
						className="n-btn-delete mr-1 mb-1"
						size={20} 
						onClick={(): void => props.onDelete(data.id)}/>
						</div>
	     		    </div>
					 </>
					}
					</InputGroup>
					
			)}
		
		</div>
	);
};

export default PaymentRow;
