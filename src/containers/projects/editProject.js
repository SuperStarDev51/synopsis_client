import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { updateProjectName } from '@containers/projects/initial-state';

export default function FormDialog({showEditModal,projectObject, onChange , setShowEditModal}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(projectObject.project_name);
  

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
    setShowEditModal(false)
    updateProjectName(inputValue, projectObject.id)
    .then((res) => {
      console.log("response", res)
      onChange(res.project.id, 'project_name', res.project.project_name)
    });
  };

  const onChangeInput = event => {
    setInputValue(event.target.value);
  }

  
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
            value={inputValue}
            onChange={onChangeInput}
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
