import { useEffect, useCallback, MutableRefObject } from 'react';

export const capitalize = ([first, ...rest]: string): string =>
	first.toUpperCase() +
	Array.from(rest)
		.map((letter: string) => letter.toLowerCase())
		.join('');

export const useKeyPress = (keycode: number, callback: (e: KeyboardEvent) => void): void => {
	const fn = useCallback((event: KeyboardEvent) => {
		if (event.keyCode === keycode && typeof callback === 'function') {
			callback(event);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', fn, false);

		return (): void => {
			document.removeEventListener('keydown', fn, false);
		};
	}, []);
};


export const sortRows = (rows: any, field: any) => new Promise((resolve,reject) =>{
	let numbers: string[] = ['phone', 'price', 'price', 'vat','number1', 'number2', 'number2']
						if( numbers.includes(field) ) {
							rows = rows.sort(function(a:any, b:any) {return a[field] - b[field]});
						}
						else {
							// TODO HBEREW SUPPORT
							rows = rows.sort((a:any, b:any) => a[field].localeCompare(b[field], 'en', {ignorePunctuation: true}));
						}
		resolve(rows);
		
});

export const useOutsideClick = (ref: MutableRefObject<any>, callback: () => void): void => {
	useEffect(() => {
		const fn = (event: Event): void => {
			if (ref.current && !ref.current.contains(event.target) && typeof callback === 'function') {
				callback();
			}
		};

		document.addEventListener('mousedown', fn, false);

		return (): void => {
			document.removeEventListener('mousedown', fn, false);
		};
	}, []);
};
