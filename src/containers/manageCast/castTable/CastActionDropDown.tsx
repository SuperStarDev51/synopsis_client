import * as React from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveCastDialog from './RemoveCastDialog';
import EditCastDialog from './editCastDialog';

interface CastActionDropDownProps{
	 ID: any;
	 Character_name: string;
	 Character_id: number;
	 setOpenAlert(data: boolean) : void;
}

const CastActionDropDown: React.FC<CastActionDropDownProps> = ( props: CastActionDropDownProps ) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { ID , Character_name , Character_id , setOpenAlert } = props;
	const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false);
	const [openRenameDialog, setOpenRenameDialog] = React.useState(false);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (value: number) => {
		setAnchorEl(null);
		if(value == 0){
			setOpenRenameDialog(true)
		} else if(value == 1) {
			setOpenRemoveDialog(true)
		}
	};

	return (
		<>
			<IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu id="simple-menu"
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			keepMounted
			open={Boolean(anchorEl)}
			onClose={handleClose}>
				<MenuItem onClick={()=>handleClose(0)}>Rename Cast Member</MenuItem>
				<MenuItem onClick={()=>handleClose(1)}>Remove Cast Member</MenuItem>
			</Menu>
			<RemoveCastDialog
			Character_id = {Character_id}
			castname={Character_name}
			castID= {ID}
			open={openRemoveDialog}
			setOpen={setOpenRemoveDialog}
			setOpenAlert = {setOpenAlert}
			/>
			<EditCastDialog
			Character_id = {Character_id}
			castname= {Character_name}
			castID= {ID}
			open={openRenameDialog}
			setOpen={setOpenRenameDialog}
			/>
		</>
	);
};
export default CastActionDropDown;
