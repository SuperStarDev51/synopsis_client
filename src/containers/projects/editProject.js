import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({showEditModal,projectName}) {
  const [open, setOpen] = React.useState(false);

  useEffect(()=>{
    if(showEditModal){
        setOpen(true);
    }else{
        setOpen(false);
    }
  },[showEditModal])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("showEditModal",showEditModal)
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose}  aria-labelledby="form-dialog-title">
        <DialogContent>
        <DialogContentText style={{display: "flex", justifyContent: "center"}} >

        <img src="assets/icons/navbar/Projects.svg" style={{width: "11%" }} /*marginTop: '45%', marginLeft: "25%"*/></img>
        </DialogContentText>

          <DialogContentText>
          <DialogTitle style={{display: "flex", justifyContent: "center",marginBottom:"-18px"}}  id="form-dialog-title">Edit Project</DialogTitle>

          </DialogContentText >
          <TextField
          style={{minWidth:"390px", marginTop: "0px"}}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={projectName}
            
          />
        </DialogContent>
        <DialogActions style={{display: "flex", justifyContent: "center"}}>
          <Button variant="contained" style={{margin: "5px"}} onClick={handleClose} color="primary">
            SAVE PROJECT
          </Button>
          
          {/* <Button onClick={handleClose} color="primary">
            Subscribe
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
