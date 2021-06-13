import * as React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';


const useStyles = makeStyles(()=>({
	root:{
		width:'100%',
		backgroundColor: '#fff !important',
		padding: '10px 20px',
		boxShadow: '0px 3px 5px 0px rgb(0 0 0 / 11%) ',
		height: '70px !important',
		zIndex: 1,

	}
}))

const MyProfileAppBar: React.FC = () => {
const classes = useStyles();
return(
	<Grid container direction="row" className={classes.root}>
			<Grid item md={6}>
				<Typography variant='h4'>
					My Profile
				</Typography>
			</Grid>
			<Grid item md={6}>

			</Grid>

		</Grid>
);
}
export default MyProfileAppBar;
