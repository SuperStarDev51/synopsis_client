import * as React from 'react';
import classnames from 'classnames';
import './index.scss';
import { useOutsideClick } from '@src/utilities';
import { useIntl } from 'react-intl';
import { Check } from 'react-feather';
import { Icon } from '@components';
import { config } from '../../config';

interface Option {
	readonly text: string;
	readonly disabled?: boolean;
	readonly list?: any;
	readonly action: () => void;
	readonly removeSelect?: () => void;
}

interface Props {
	readonly isOpen: boolean;
	readonly options?: Option[];
	readonly multiple?: boolean;
	readonly selected?: any[];
	readonly onClick: (e: Event) => void;
	readonly onOutsideClick: () => void;
	readonly className?: string;
	readonly children?: any;
	readonly onAddField?: (fieldValue: string) => void;
}

export const Popup: React.FC<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const ref: React.MutableRefObject<any> = React.useRef(null);
	const { options, multiple,selected, isOpen, onOutsideClick, className, children, onAddField } = props;
	const [newFieldValue, setNewFieldValue] = React.useState('');
	const [isListOpen, setIsListOpen] = React.useState<any>(false);
	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	useOutsideClick(ref, ()=>{ setIsListOpen(false); onOutsideClick()!;});

	return isOpen ? (
		<div className={classnames(`select__control c-popup  ${className === undefined ? '' : className}`,{
			'position-initial': typeof(isListOpen) === 'number'
		})} ref={ref}>
			<ul className="c-popup__items max-height-150 overflow-auto">
				{children
					? children
					: options!.map((option: Option, key: number) => {
							const isNew = option.text === formatMessage({id: 'add_new'});
							const isSelected = selected ? selected.includes(option.text)  : false
							if(option.disabled) {return}
							return (
								<>
								<li
									key={key}
									onClick={option.list ? typeof(isListOpen) === 'number' &&  isListOpen == key ?  ()=>setIsListOpen(false) : ()=>setIsListOpen(key) :  isNew ? (): void => void 0 : isSelected ? option.removeSelect :  option.action}
									className={classnames(`c-popup__item ${isNew ? 'c-popup__item--with-input' : ''}`, {
										'bg-blue4': multiple && isSelected || typeof(isListOpen) === 'number' &&  isListOpen == key,
									})}
								>
								{multiple && isSelected ? <Check /> : null}
									{!isNew ?
									<>
									 { !option.list ? option.text : <>
										<div className="d-flex justify-content-between align-items-center svg-stroke-black">
											{option.text}
											<Icon src={config.iconsPath+"options/dropdown-up.svg"} className="rotate-90" style={{height: '0.7rem', width: '0.7rem'}}/>
										</div>

										<Popup
										className="position-absolute position-top-1 position-left-95-per min-height-150"
										isOpen={typeof(isListOpen) === 'number' &&  isListOpen == key}
										onClick={(): void => {
											setIsListOpen(false);
											return;
										}}
										options={option.list.length ? option.list.map((option: any) => ({
											text: option.text,
											action: (): void => {
												option !== formatMessage({id: 'add_new'}) && setIsListOpen(false);
												option.action(option.text);
											}
										})): []}
										onOutsideClick={(): void => setIsListOpen(false)}
										/>
										</>}
									</>: null}
									{isNew && typeof onAddField === 'function' && (
										<>
											<input
												onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
													setNewFieldValue(event.target.value);
												}}
												type="text"
												value={newFieldValue}
												placeholder={formatMessage({id: 'add_new'})+'...'}
											/>
											<button
												onClick={(): void => {
													onAddField(newFieldValue!), setNewFieldValue('');
												}}
											></button>
										</>
									)}
								</li>

								</>
							);
					  })}
			</ul>
		</div>
	) : null;
};

export default Popup;
