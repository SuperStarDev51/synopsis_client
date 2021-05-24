import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { useIntl } from 'react-intl';
import { NewCell } from '@components';
import { Supplier } from '@containers/suppliers/interfaces';
import { LocationMapPopover } from '@src/components/LocationMapPopover/index.tsx';
import { InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import { MapPin, XCircle } from "react-feather"
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";

interface Props {
	readonly sdId :any;
	readonly disableDelete? :boolean;
	readonly data: Supplier;
	readonly index: number;
	readonly color: string;
	readonly onChange: (value: any, id: string | number, field: string) => void;
	readonly onBlur: (value: any, id: string | number, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
	readonly fields: any;
}

export const LocationRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const { data, fields, onChange, onBlur, onKeyPress, permissionMod } = props
	const isReadonly = (field: string): boolean => ['name', 'location'].includes(field);
	const isOptionsList = permissionMod
		? ['characters', 'type', 'supplier_job_title', 'permissions', 'status']
		: ['characters', 'type', 'supplier_job_title'];
	const isOptions = (field: string): boolean => isOptionsList.includes(field);
	const [activeLocationPopoverId, setActiveLocationPopoverId] = React.useState();

	const handleLocationPopoverClose = () => {
		setActiveLocationPopoverId(null);
	};

	return (
		<div
			ref={props.innerRef}
			className="n-row position-relative d-flex mb-02"
			onKeyPress={event => {
				if (event.key === 'Enter') {
					if(onKeyPress) onKeyPress(data.id)
				}
			}}
		>
			<span className="n-row__color" style={{ backgroundColor: props.color }} />
			{fields.map((field: string, index: number) => {
				let value;
				if (field === 'geolocation') {
					value = data.geolocation ? `${data.geolocation.lat},${data.geolocation.lng}` : '';
				} else {
					value = (data as any)[field];
				}

				return (
					<InputGroup key={`${index}`}>
						<NewCell
							id={data.id}
							type={field === 'cost' ? 'number' : 'string'}
							field={field}
							value={value}
							prefix={['price', 'income', 'total'].includes(field) ? '$' : ''}
							suffix={['fee'].includes(field) ? '%' : ''}
							onChange={!isOptions(field) ?
								(value:any)=> {
									onChange(value, data.scene_id, field)
								}
								:
								(value:any)=>{
									onChange(value, data.scene_id, field);
								}}
							onBlur={
								!isOptions(field) || !isReadonly(field)
									? (value:any) => onBlur(value, {chapter_number: data.chapter_number, scene_number: data.scene_number}, field)
									: ()=>{}
							}
							classnames={field === 'name' ? ['width-18-rem'] : ['width-10-rem']}
							inputRef={index === 0 ? inputRef : null}
							isReadOnly={isReadonly(field)}
						>
							{field === 'geolocation' ? (
								<InputGroupAddon addonType="append">
									<InputGroupText className="options">
										<div
											id={`target-${data.scene_id}`}
											onClick={() => {
												setActiveLocationPopoverId(`target-${data.scene_id}`)
											}}
										>
											<MapPin size={15} />
										</div>

										<LocationMapPopover
											target={`target-${data.scene_id}`}
											isOpen={activeLocationPopoverId === `target-${data.scene_id}`}
											onChange={(coordinates) => {
												onChange(coordinates, data.scene_id, 'geolocation');
												const sceneData = {
													index: index,
													chapter_number: data.chapter_number,
													scene_number: data.scene_number
												};
												onBlur(coordinates, sceneData, 'geolocation');
											}}
											onClose={handleLocationPopoverClose}
											onBlur={(coordinates) => {

												// let scene = {
												// 	chapter_number: propItem.chapterNumber,
												// 	project_id: activeEvent.id,
												// 	props: propItem.props,
												// 	scene_number: propItem.sceneNumber,
												// };
                                                //
												// addScene(scene);
											}}
										/>
									</InputGroupText>
								</InputGroupAddon>
							): null}
						</NewCell>
					</InputGroup>
				)
			})}
			{!props.disableDelete ? (
				<div className="fonticon-container">
					<div className="fonticon-wrap width-0 height-auto">
						<XCircle
							className="n-btn-delete mr-1 mb-1"
							size={20}
							onClick={(): void => props.onDelete(props.data.id)}/>
					</div>
				</div>
			):null}
		</div>
	);
};

export default LocationRow;
