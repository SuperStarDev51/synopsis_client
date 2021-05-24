import * as React from 'react';
import './index.scss';
import { useOutsideClick } from '@src/utilities';

interface Props {
	readonly isOpen: boolean;
	readonly onOutsideClick: () => void;
}

export const SearchBar: React.FC<Props> = (props: Props) => {
	const ref: React.MutableRefObject<any> = React.useRef(null);
	const { isOpen, onOutsideClick } = props;
	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	useOutsideClick(ref, onOutsideClick!);

	return isOpen ? (
		<div ref={ref} className="c-popup">
			<div className="c-popup__items">
				<div className="c-popup__item"></div>
				<div className="c-popup__item"></div>
				<div className="c-popup__item"></div>
			</div>
		</div>
	) : null
};

export default SearchBar;
