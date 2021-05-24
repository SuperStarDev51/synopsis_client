import * as React from 'react';

import { Nav } from '@components';

import './index.scss';

interface Props {
	readonly className?: string;
}

export const Sidebar: React.FunctionComponent<Props> = ({ className }: Props) => {
	const classes = ['c-sidebar'];

	if (className) {
		classes.push(className);
	}

	return (
		<div className={classes.join(' ')}>
			<Nav />
		</div>
	);
};

export default Sidebar;
