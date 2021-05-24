import * as React from 'react';
import classnames from 'classnames';
import { Calendar } from 'react-date-range';
import Flatpickr from "react-flatpickr";
import { FormattedMessage, useIntl } from 'react-intl';

import { useOutsideClick } from '@src/utilities';

import './index.scss';
import { min } from 'moment';
import Placeholder from 'react-select/src/components/Placeholder';

interface Props {
	onChange: (item: Date) => void;
	date: any;
	placeholder?: any;
	className?: string;
	onOutsideClick?: () => void;
	minDate?: any;
	readonly flatpickr?:boolean 
	readonly range?:boolean 
}

export const CalendarComponent: React.FC<Props> = (props: Props) => {
	const { onChange, onOutsideClick, date,flatpickr,range, placeholder, className, minDate } = props;
	const classes = [];
	const { formatMessage } = useIntl();
	const ref: React.MutableRefObject<any> = React.useRef(null);
	useOutsideClick(ref, onOutsideClick!);

	if (className) {
		classes.push(className);
	}

	return (
		<div ref={ref}>
		{ flatpickr ? <>
			{!date.length && placeholder &&( `${formatMessage({id: 'select'})} ${formatMessage({id: 'date'})}` )}
		 	<Flatpickr
			   placeholder={placeholder ? placeholder : ''}
			   className={classnames(className ?  className : '', {
					// 'position-absolute': !date.length,
					'position-left-0': !date.length
			   })}
			   value={date}
			   options={range ? { 
					locale: 'he', 
					mode: "range" ,
					minDate: "today",
					dateFormat: "d-m-Y",
			    } : {
					locale: 'he', 
				}}
			   onChange={(date: any): void => {onChange(date)}}
		   />
			</>
			   
			:
			  <Calendar
			  minDate={minDate}
			  onChange={(date: Date): void => {onChange(date)}}
			  date={date}
			  onOutsideClick={onOutsideClick}
			  />
			}
		</div>
	);
};

export default CalendarComponent;
