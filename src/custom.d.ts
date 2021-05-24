declare module '*.svg' {
	const content: string;
	export default content;
}


declare module '*.jpg' {
	const content: string;
	export default content;
}

declare module '*.png' {
	const content: string;
	export default content;
}

declare module '*.json' {
	const content: object;
	export default content;
}

// eslint-disable-next-line no-var
declare var module: any;

declare module 'react-date-range';
