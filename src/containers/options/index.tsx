import * as React from 'react';
import { Popup } from '@components';
import { Icon } from '@components';
import { FormattedMessage, useIntl } from "react-intl"
import { config } from '../../config';

const titlesExtraColumns = ['number1','number2', 'number3','text1', 'text2','text3', 'percentage1', 'percentage2', 'percentage3']

interface Props {
	readonly fields: any[];
	readonly disableSort?: boolean;
	readonly category_id?: number;
	readonly setFields: (value: any[]) => void;
	readonly addColumnDispatch: (key: string, value: any, category_id: number) => void;
	readonly sortBy: (field: string) => void;

}

export const Options: React.FC<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const {fields, category_id, disableSort} = props
	const [isOptionsPopupOpen, setIsOptionsPopupOpen] = React.useState(false);
	const [isSortingPopupOpen, setIsSortingPopupOpen] = React.useState(false);


	const maxIndexColumn = (fields: any, type: string) => {
		let columnItems:any = fields.map((field:any, index:number)=> {
			if(type == 'number' && field.includes('number')) {
				return Number(field.split('number')[1])
			}
			if(type == 'text' &&  field.includes('text') ) {
				return Number(field.split('text')[1])
			}
			else return
		})
		return columnItems.filter((c:any)=>c).length ?  Math.max(...columnItems.filter((c:any)=>c)) : 0

	}


		return (
			<div className="c-table__options">
				{!disableSort ? (
					<div
						onClick={(): void => {
							setIsSortingPopupOpen(!isSortingPopupOpen);
						}}
						className={`position-relative ml-1 ${
							isSortingPopupOpen ? ' popup-open' : ''
						}`}
						>
						{/* <h3 className="c-table__options-title"><FormattedMessage id='sort_by'/></h3> */}
						<Icon src={config.iconsPath+"options/sort-by.svg"} style={{height: '1.2rem', width: '1.2rem'}}/>
						<Popup
							isOpen={isSortingPopupOpen}
							onClick={(): void => {
								return;
							}}
							onOutsideClick={(): void => setIsSortingPopupOpen(false)}
							options={fields.filter((f:string) => !titlesExtraColumns.includes(f)).map((field: string, index: number) => {
								return {
									disabled: false,
									text: formatMessage({id: field}),
									action: (): void => {
										props.sortBy(field)
										setIsSortingPopupOpen(!isSortingPopupOpen);
									}
								}
							})}

							className="c-popup--tasks-list-view"
						/>
					</div>
				) : null}
			<div
				onClick={(): void => {
					setIsOptionsPopupOpen(!isOptionsPopupOpen);
				}}
				className={`position-relative ml-1 ${
					isOptionsPopupOpen ? ' popup-open' : ''
				}`}
			>
				{/* <h3 className="c-table__options-title "><FormattedMessage id='new_column'/></h3> */}
				<Icon src={config.iconsPath+"options/add-column.svg"} style={{height: '1.2rem', width: '1.2rem'}}/>

				<Popup
					isOpen={isOptionsPopupOpen}
					onClick={(): void => {
						return;
					}}
					onOutsideClick={(): void => setIsOptionsPopupOpen(false)}
					options={[
						{
							disabled: false,
							text: formatMessage({id: 'text'}),
							action: (): void => {
								let type = 'text'
								let i = maxIndexColumn(fields,type)+1
								if( i <= 3) {
									let key = type+i
									props.setFields([...fields, key])
									props.addColumnDispatch(key, '', category_id)
									setIsOptionsPopupOpen(!isOptionsPopupOpen);
								} else {alert(`Maximum 3 ${type} columns`)}
							}
						},
						{
							disabled: false,
							text: formatMessage({id: 'number'}),
							action: (): void => {
								let type = 'number'
								let i = maxIndexColumn(fields,type)+1
								if( i <= 3) {
									let key = type+i
									props.setFields([...fields, key])
									props.addColumnDispatch(key, 0, category_id)
								} else {alert(`Maximum 3 ${type} columns`)}
								setIsOptionsPopupOpen(!isOptionsPopupOpen);
							}
						}
					]}
					className="c-popup--tasks-list-view"
				/>
			</div>
		</div>
		);

};
