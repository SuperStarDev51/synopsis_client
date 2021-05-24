import * as React from 'react';
import SVG from 'react-inlinesvg';
import './index.scss';
interface Props {
	readonly src: string;
	readonly className?: string;
	readonly style?: string;
}

export const Icon: React.FunctionComponent<Props> = ({ src, className, style }: Props) => {
	const classes = ['c-svg-icon'];
	if (className) {
		classes.push(className);
	}
	return <SVG src={src} className={classes.join(' ')} style={style} />;
};

export default Icon;
