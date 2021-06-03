import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default  DropDown = ()=> {
    const [showdeleteAlert, setShowdeleteAlert] =  React.useState<any>(false);
	const [showEditModal, setShowEditModal] =  React.useState<any>(false);

	// const dispatch = useDispatch();
	const options = [
		'EDIT PROJECT',
		// 'ARCHIVE PROJECT',
		'REMOVE PROJECT',
		
	  ];
	  
	  const ITEM_HEIGHT = 48;
	  const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
            setShowEditModal(true);
        };
  
  return (
      <>
    <div>
     	<IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
    </div>
    </>
  );
}
