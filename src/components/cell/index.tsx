import * as React from 'react';

interface Props {
	readonly id: string;
	readonly type: 'string' | 'number' | 'dropdown' | 'action';
	readonly field: string;
	readonly value?: string | number;
	readonly prefix?: string;
	readonly suffix?: string;
	readonly onChange: (value: string, id: string, field: string) => void;
	readonly onKeyPress: (id: string) => void;
	readonly inputRef: any;
	readonly children?: any;
	readonly isPricePrimCellVisible?: boolean;
	readonly isReadOnly?: boolean;
	readonly placeholder?: string;
	readonly disabled?: boolean;
}

export const Cell: React.FunctionComponent<Props> = (props: Props) => {
	const {
		id,
		type,
		field,
		date,
		value,
		prefix,
		suffix,
		onChange,
		onKeyPress,
		inputRef,
		children,
		placeholder,
		isPricePrimCellVisible,
		isReadOnly,
		disabled
	} = props;

	return field === 'price-prim' && !isPricePrimCellVisible ? null : field === 'percentage' &&
	  !isPricePrimCellVisible ? null : (
		<div className={`c-table__cell c-table__cell--${field.toLocaleLowerCase()}`}>
			{prefix}

			{type === 'string' || type === 'number' ? (
				<input
					ref={inputRef}
					type={type === 'string' ? 'text' : 'number'}
					value={value}
					onKeyPress={event => {
						if (event.key === 'Enter') {
							onKeyPress(id, date)
						}
					}}
					onChange={({ target }: React.ChangeEvent<HTMLInputElement>): void =>
						onChange(target.value, id, field)
					}
					placeholder={placeholder}
					readOnly={isReadOnly}
					disabled={disabled}
				/>
			) : null}

			{children}

			{suffix}
		</div>
	);
};

Cell.defaultProps = {
	placeholder: '',
	disabled: false
} as Partial<Props>;

export default Cell;
