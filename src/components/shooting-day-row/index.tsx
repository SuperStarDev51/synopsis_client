import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { filteredOptions } from '../../helpers/helpers'
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { addSupplier } from '@containers/suppliers/initial-state';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { XCircle, ArrowDownCircle} from "react-feather"
import { useIntl } from "react-intl";
import { Event } from '@containers/planning/interfaces';

import './index.scss';

interface Props {
	readonly data: any;
	readonly type: string;
	readonly type_index: number;
	readonly color: string;
	readonly fields: any;
	readonly sdi: number;
	readonly onChange: (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number) => void;
	readonly onBlur: (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number) => void;
	readonly onDelete: (index: any, type:string, shooting_day_index:number)  => void;
	// readonly onKeyPress: (id: string) => void;
	// readonly provided: DraggableProvided;
	// readonly innerRef: any;
}

export const ShootingDayRow: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const inputRef = React.useRef(null);
	const dispatch = useDispatch();
	const { data, type, type_index,  fields, sdi,  onBlur, onChange, onDelete } = props
	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const [isCharactersPopupOpen, setIsCharactersPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, {supplier_name: formatMessage({id: 'add_new'})}]);
	const activeEvent:any = useSelector((state: RootStore) => state.events.filter((event: Event) => {return event.preview})[0])
	const isReadonly = (field: string): boolean => [''].includes(field);
	const isOptions = (field: string): boolean => [''].includes(field);

	
	return (
		<div className="n-row position-relative d-flex bg-white">
			{/* <span className="n-row__color" style={{ backgroundColor: props.color }} /> */}
			{fields.map((field: string, index: number) => {
				return (<>	
						{field === 'date' && (
							<div className="text-primary">
								<div>22:22 - 22:22</div>
								<div>50</div>
							</div>
						)}
					</>
				
			)})}
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
					<XCircle 
					className="n-btn-delete mr-1 mb-1" 
					size={20} 
					onClick={(): void => onDelete(type_index, type, sdi)}/>
					</div>
				</div>
				
				
		</div>	
	);
	
}


export default ShootingDayRow;
