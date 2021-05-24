import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import Popup from '../popup';
import { useIntl } from 'react-intl';
import { NewCell } from '@components';
import { InputGroup, InputGroupText, InputGroupAddon, Button } from 'reactstrap';
import { Icon } from '@components';
import { config } from '../../config';
import {XCircle} from "react-feather";

interface Props {
	readonly data: any;
	readonly color: string;
	readonly index: number;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: number |string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly fields: any;
}

export const PostLocationRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, index, fields, onChange, onBlur, onKeyPress } = props
	const sceneTime = useSelector((state: RootStore) => state.sceneTime)
	const [isTimePopupOpen, setIsTimePopupOpen] = React.useState<boolean>(false);
	const [TimeOptions, setTimeOptions] = React.useState(sceneTime.map((st:any, sti:number)=> { return {index: sti, value: st.scene_time}}));
	const sceneLocation = useSelector((state: RootStore) => state.sceneLocation)
	const [isLocationPopupOpen, setIsLocationPopupOpen] = React.useState<boolean>(false);
	const [LocationOptions, setLocationOptions] = React.useState(sceneLocation.map((sl:any, sli:number)=> { return {index: sli, value: sl.scene_location}}));
	const isReadonly = (field: string): boolean => ['time', 'location'].includes(field);
	const isOptions = (field: string): boolean => ['time', 'location'].includes(field);
	const isNumber = (field: string): boolean => [''].includes(field);
	const isTime = (field: string): boolean => [''].includes(field);

	return (
		<div
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(index)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />

			{fields.map((field: string, field_index: number) =>
				<InputGroup key={field_index} style={{flexWrap: 'unset'}}>
				<>
				<NewCell
					id={index}
					key={field_index}
					type={isTime(field) ? 'time' : isNumber(field) ? 'number' :  'string' }
					field={field}
					value={(data as any)[field]}
					field={field}
					prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
					suffix={['fee'].includes(field) ? '%' : ''}
					onChange={!isOptions(field) ?
						(value:any)=> onChange(value, index,field)
					:
					(value:any)=>{
						onChange(value, index, field);
						// if( field == 'early_call_suppliers' ) setIsEarlySupplierPopupOpen(true)
					}}
					onBlur={!isOptions(field) || !isReadonly(field) ? (value:any)=> onBlur(value, index, field) : ()=>{}}

					inputRef={index === 0 ? inputRef : null}
					isReadOnly={isReadonly(field)}
					classnames={['width-10-rem']}
					invalid={isOptions(field) ? false: false}
				>
					{field === 'time' ? (
							<InputGroupAddon addonType="append">
							<InputGroupText className="options">
							<div onClick={() => {setIsTimePopupOpen(!isTimePopupOpen)}}
								 className={`${isTimePopupOpen ? ' popup-open' : ''}`}>
								<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
							</div>
							<Popup
								isOpen={isTimePopupOpen}
								onClick={(): void => {
									return;
								}}
								options={TimeOptions.length ? TimeOptions.map((option: any) => ({
									disabled: false,
									text: option.value,
									action: (): void => {
										setIsTimePopupOpen(false);
										onChange(option.value,index, field);
										onBlur(option.value, index, field)
									}
								})): []}
								onOutsideClick={(): void => setIsTimePopupOpen(false)}
							/>
						 </InputGroupText>
					 </InputGroupAddon>
					) : null}

					{field === 'location' ? (
							<InputGroupAddon addonType="append">
							<InputGroupText className="options">
							<div onClick={() => {setIsLocationPopupOpen(!isLocationPopupOpen)}}
								className={`${isLocationPopupOpen ? ' popup-open' : ''}`}>
								<Icon src={config.iconsPath+"options/dropdown-down.svg"}/>
							</div>
							<Popup
								isOpen={isLocationPopupOpen}
								onClick={(): void => {
									return;
								}}
								options={LocationOptions.length ? LocationOptions.map((option: any) => ({
									disabled: false,
									text: option.value,
									action: (): void => {
										setIsLocationPopupOpen(false);
										onChange(option.value,index, field);
										onBlur(option.value, index, field)
									}
								})): []}
								onOutsideClick={(): void => setIsLocationPopupOpen(false)}
							/>
						 </InputGroupText>
					 </InputGroupAddon>
					) : null}
				</NewCell>
				</>
				</InputGroup>
			)}
			{!props.disableDelete ? (
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
						<XCircle
							className="n-btn-delete mr-1 mb-1"
							size={20}
							onClick={
								(): void => props.onDelete(props.index)
							}/>
					</div>
				</div>
			): null}
		</div>
	);
};

export default PostLocationRow;
