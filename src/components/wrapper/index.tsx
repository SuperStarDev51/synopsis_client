import * as React from 'react';
// import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { RootStore } from '@src/store';
import { Event } from '@containers/planning/interfaces';
import { Header, Sidebar } from '@components';

// import './index.scss';

interface Props {
	readonly children?: React.ReactNode | React.ReactNode[];
	readonly className?: string;
}

export const Wrapper: React.FunctionComponent<Props> = ({ children, className }: Props) => {
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: Event) => event.preview)[0]);

	const classes = ['o-wrapper'];

	let isFilesPage = false;

	if (className) {
		classes.push(className);
	}

	if (className === 'o-wrapper--files') {
		isFilesPage = true;
	}

	return (
		<div className={classes.join(' ')}>
			{/* {activeEvent && ( <Header 
			   /> )} */}
			<main className="o-main">
			{false && (
				<Sidebar className={isFilesPage ? 'c-sidebar--with-shadow' : ''} />
			)}	

				{children}
			</main>
		</div>
	);
};

export default Wrapper;
