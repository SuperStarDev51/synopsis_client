import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Button } from 'reactstrap';
import AddNewProject from './AddNewProject';

const useStyles = makeStyles(()=>({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		height: '62px',
		backgroundColor: 'rgba(33,33,33,0.1)',
		boxShadow: '5px rgba(33,33,33,0.1)'
	},
	leftSection: {
		flex: 0.5,
		alignItems: 'center',
		justifyContent: 'start',
		display: 'flex',
		paddingLeft: '30px',
	},
	rightSection: {
		display: 'flex',
		flex: 0.5,
		paddingRight: '30px',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	projectLogo: {
		height:'28px',
		width: '28px',
		color: '#000',
		border: '1px solid #000'
	},
	newProjectBTN: {
		backgroundColor:'blue',
	}
}))

interface Headerprops{
	activeEvent: string;
}




const Header: React.FC<Headerprops> = (props: Headerprops) => {
	const classes = useStyles();
	const [hidden, setHidden] = React.useState(false);
	const [showAddAlert, setShowAddAlert] = React.useState(false);
	const {activeEvent} = props;
	React.useEffect(() => {
		if(activeEvent === '/')
		 	setHidden(true)
		else
			setHidden(false)
	},[activeEvent])




	return(
		<div className={classes.root}>
			<div className={classes.leftSection}>
				<img src='/assets/icons/top_project_nav.svg' alt='svg' className={classes.projectLogo}/>
				<span> &nbsp; Projects</span>
			</div>
			{hidden && (
				<div className={classes.rightSection}>
					<Button color='primary' onClick={()=>setShowAddAlert(true)}>
						+ New Project
					</Button>
					<AddNewProject
					setShowAddAlert={setShowAddAlert}
					showAddAlert={showAddAlert}
					/>
				</div>
			)}

		</div>)
}

export default Header;
