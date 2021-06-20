import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
const useStyles = makeStyles(()=>({
	content:{
		display: 'grid',
		width: 600,
		placeContent: 'center',
		fontSize: '8rem',
		placeItems: 'center',
		color: 'rgba(0,0,0,0.4)',
		paddingBlock: '60px'
	},
	removeButton:{
		width: '100%',
		backgroundColor: '#ccdffc',
		marginTop: '0px !important',
		padding: '20px'
	},
	closeButton: {
		position: 'absolute',
	}
}))


interface RemoveCastDialogProps{
	Character_id: number,
	castname: string;
	castID: number;
	open: boolean;
	setOpen(data: boolean): void;
}
const RemoveCastDialog: React.FC<RemoveCastDialogProps> = (props: RemoveCastDialogProps) => {
	const { Character_id , castname, castID, open, setOpen} = props;
	const classes = useStyles();
	return(
	<Dialog  onClose={()=>setOpen(false)} open={open}>
		<IconButton className={classes.closeButton} onClick={()=>setOpen(false)}>
			<CloseIcon/>
		</IconButton>
		<MuiDialogContent className={classes.content}>
			<DeleteOutlineIcon fontSize={"inherit"} style={{color:'rgba(0,0,0,0.4)'}}/>
			<Typography variant="h4">
				Remove Cast Member
			</Typography>
			<Typography variant="body1">
				Are you sure you want to remove &quot;{castname}&quot; from element?
			</Typography>
			<Typography variant="body1">
				The element will be also removed from all the scenes it has been tagged in.
			</Typography>
			<Button className={classes.removeButton} onClick={()=>setOpen(false)} >
				Remove Cast Member
			</Button>
		</MuiDialogContent>
	</Dialog>);

}

export default RemoveCastDialog;
