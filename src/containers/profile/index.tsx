import { makeStyles } from '@material-ui/core';
import * as React from 'react';

import MyProfileAppBar from './myProfileAppBar';
import MyProfileForm from './myProfileForm';

const useStyles = makeStyles(()=>({
	root:{
		width: '100%',
		minHeight:'calc(100vh - 16rem) ',
		display:'flex',
		flexDirection: 'column',
		flex:'none'
	},
	container:{
		minHeight:'calc(100vh - 326px) ',
		display:'flex',
		flex:'none',
		backgroundColor:'rgba(204,204,204,0.2)'
	}
}))

const UserProfile: React.FC = () => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<MyProfileAppBar/>
			<div className={classes.container}>
				<MyProfileForm/>
			</div>
		</div>
	);
};

export default UserProfile;
