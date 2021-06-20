import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import CastDataTable from './castTable';
import { useSelector } from 'react-redux';
import { RootStore } from '@src/store';

const useStyles = makeStyles(()=> ({
	root:{
		width: '100%',
		minHeight:'calc(100vh - 16rem) ',
		display:'flex',
		flexDirection: 'column',
		position:'relative',
		maxHeight:'calc(100vh - 16rem) ',
		overflow: 'auto'

	},
	header:{
		width: '100%',
		marginTop:'100px',
		minHeight:'62px',
		display:'flex',
		border: '1px solid rgba(0,0,0,0.2)',
		backgroundColor: '#fff',
		alignItems:'center',
		paddingInline: '30px'
	},
	table:{
		paddingInline: '60px',
		paddingTop: '20px',
		backgroundColor: 'rgba(0,0,0,0.1)',
		minHeight: '100% !important',
		flex: 1,
		display:'flex',
		flexDirection: 'column',

	}
}))

// interface ManageCastProps {
// 	// title: string;
// }

const ManageCastContainer: React.FC =  () => {
	const classes = useStyles();
	const characterState = useSelector((state: RootStore) => state.characters)
	const CharacterList = [...characterState]

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				{CharacterList.length + 1} Cast Members
			</div>
			<div className={classes.table}>
			<CastDataTable/>
			</div>
		</div>
	);
}
export default ManageCastContainer;
