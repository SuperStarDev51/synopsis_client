import * as React from 'react';
import SVG from 'react-inlinesvg';
import { DraggableProvided } from 'react-beautiful-dnd';
import { addSupplier } from '@containers/suppliers/initial-state';

import Popup from '../popup';
import { Cell } from '@components';
import { Income } from '@containers/budget/interfaces';

interface Props {
	readonly data: Income;
	readonly color: string;
	readonly onChange: (value: any, id: string, field: string) => void;
	readonly onDelete: (id: string) => void;
	readonly onAddToBudget: (name: string, cost: number) => void;
	readonly provided: DraggableProvided;
	readonly innerRef: any;
}

export const IncomeRow: React.FunctionComponent<Props> = (props: Props) => {
	const inputRef = React.useRef(null);

	const [isSupplierPopupOpen, setIsSupplierPopupOpen] = React.useState<boolean>(false);
	const suppliersRootStore:any[] = useSelector((state: RootStore) => state.suppliers ).map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);

	const [suppliersOptions, setSuppliersOptions] = React.useState([...suppliers, 'Add new']);
	const isReadonly = (field: string): boolean => ['total-income', 'supplier_name'].includes(field);

	return (
		<div
			ref={props.innerRef}
			className="c-row"
			{...props.provided.draggableProps}
			{...props.provided.dragHandleProps}
		>
			<span className="c-row__color" style={{ backgroundColor: props.color }} />

			{Object.keys(props.data).map((field: string, index: number) =>
				['id', 'color'].includes(field) ? null : (
					<Cell
						id={props.data.id}
						key={index}
						type={
							field === 'price' ||
							field === 'vat' ||
							field === 'fee' ||
							field === 'income' ||
							field === 'amount-sold'
								? 'number'
								: 'string'
						}
						field={field}
						value={(props.data as any)[field] === 0 ? '' : (props.data as any)[field]}
						prefix={['price', 'income', 'total', 'vat', 'total-income'].includes(field) ? '$' : ''}
						suffix={['fee'].includes(field) ? '%' : ''}
						onChange={props.onChange}
						inputRef={index === 0 ? inputRef : null}
						disabled={field === 'total-income'}
						isReadOnly={isReadonly(field)}
						placeholder={
							field === 'price' ||
							field === 'vat' ||
							field === 'fee' ||
							field === 'income' ||
							field === 'amount-sold'
								? '0'
								: field === 'supplier_name'
								? 'Supplier name'
								: field === 'income-type'
								? 'Enter description...'
								: ''
						}
					>
						{field === 'supplier_name' ? (
							<>
								<button
									type="button"
									onClick={(): void => {
										setIsSupplierPopupOpen(true);
									}}
									className={`c-btn-arrow-down${isSupplierPopupOpen ? ' popup-open' : ''}`}
								></button>

								<Popup
									isOpen={isSupplierPopupOpen}
									onClick={(): void => {
										return;
									}}
									options={suppliersOptions.map((option: string) => ({
										text: option,
										action: (): void => {
											option !== 'Add new' && setIsSupplierPopupOpen(false);
											props.onChange(option, props.data.id, field);
										}
									}))}
									onOutsideClick={(): void => {
										setIsSupplierPopupOpen(false);
									}}
									onAddField={(value: string): void => {
										if (!value || suppliersOptions.indexOf(value) > -1) {
											return;
										}

										const newSuppliersOptions = [...suppliersOptions];

										newSuppliersOptions.splice(newSuppliersOptions.length - 1, 0, value);

										setSuppliersOptions(newSuppliersOptions);
										addSupplier({'supplier_name': value})
										props.onChange(value, props.data.id, field);
										setIsSupplierPopupOpen(false);
									}}
								/>
							</>
						) : null}
					</Cell>
				)
			)}

			<button
				type="button"
				onClick={(): void => props.onDelete(props.data.id)}
				className="c-btn-add-more c-btn-close"
			>
				<SVG src="/assets/images/add_circle-gray.svg" />
			</button>
		</div>
	);
};

export default IncomeRow;
