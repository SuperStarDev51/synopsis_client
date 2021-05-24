import * as React from 'react';
import { Input } from 'reactstrap';
import { useIntl } from 'react-intl';

interface Props {
	readonly id: any;
	readonly type: 'string' | 'number' | 'time' | 'dropdown' | 'action';
	readonly field: string;
	readonly value?: string | number;
	readonly prefix?: string;
	readonly suffix?: string;
	readonly onChange: (value: any) => void;
	readonly onClick?: () => void;
	readonly onBlur: ( (value: any) => void ) |  null ;
	readonly onKeyPress?: (id: string) => void;
	readonly inputRef: any;
	readonly children?: any;
	readonly isPricePrimCellVisible?: boolean;
	readonly isReadOnly?: boolean;
	readonly placeholder?: any;
	readonly disabled?: boolean;
	readonly classnames? :any[]
	readonly invalid?: undefined | Boolean
	readonly styleColor? : string;
}

export const NewCell: React.FunctionComponent<Props> = (props: Props) => {
	const {
		id,
		type,
		field,
		value,
		prefix,
		suffix,
		onChange,
		onClick,
		onBlur,
		onKeyPress,
		inputRef,
		children,
		placeholder,
		isPricePrimCellVisible,
		isReadOnly,
		classnames,
		styleColor,
		invalid,
		disabled,
	} = props;
    const { formatMessage } = useIntl();
	const titlesExtraColumns = ['number1','number2', 'number3','text1', 'text2','text3', 'percentage1', 'percentage2', 'percentage3']

	return field === 'price-prim' && !isPricePrimCellVisible ? null : field === 'percentage' &&
	  !isPricePrimCellVisible ? null : (
		<div onClick={onClick ? ()=>onClick() : ()=>{}}>
			{/* {prefix} */}

			{type === 'string' || type === 'number'  ||  type === 'time' ?(
				<Input
					ref={inputRef}
					className={`sqaure form-control border-top-0 border-bottom-0 border-left pr-0 ${classnames ? classnames.toString().replace(',',' ')	: null}
								${ type === 'time' ? 'text-center p-05' : null}
								${ styleColor === 'gray' ? 'bg-white border-color-light-gray' : 'bg-gray-important border-color-white'}
								`}
					style={{borderRadius:0,
							}}
					// invalid={invalid}
					type={type === 'string' ? 'text' : type === 'time' ? 'time' :  'number'}
					value={value}
					onKeyPress={event => {
						if (event.key === 'Enter') {
							if( onKeyPress ) onKeyPress(id)
						}
					}}
					onBlur={({ target }: React.ChangeEvent<HTMLInputElement>): void =>{
						if( onBlur ) onBlur(target.value)
					}}
					onChange={({ target }: React.ChangeEvent<HTMLInputElement>): void => {
						onChange(target.value)
					}}
					placeholder={placeholder ? !titlesExtraColumns.includes(placeholder) ? String(formatMessage({id: field})) ? String(formatMessage({id: field})) : String(formatMessage({id: placeholder == 'def' ? 'description' : placeholder})) : undefined : undefined}
					readOnly={isReadOnly}
					disabled={disabled}
				/>
			) : null}



			{children}

			{suffix}
		</div>
	);
};

NewCell.defaultProps = {
	placeholder: '',
	disabled: false
} as Partial<Props>;

export default NewCell;
