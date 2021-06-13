import React, {useEffect} from 'react';
import { RootStore } from '@src/store';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Chip from "@vuexy/chips/ChipComponent"
import classnames from 'classnames';

export default function FormDialog({showDialog ,CharacterList , associatedNumList , anchorACEl , setShowDialog, setAnchorACEl}) {
 
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("")
  const id = open ? 'simple-popover' : undefined;

  console.log("CharacterList", CharacterList)
  console.log("associatedNumList", associatedNumList)

  useEffect(()=>{
    if(showDialog){
        setOpen(true);
    }else{
        setOpen(false);
    }
  },[showDialog])
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowDialog(false);
    setAnchorACEl(null);
  };

  const onChangeInput = event => {
    setInputValue(event.target.value);
  }



  const searchBarStyle = {width: '270px', padding:"0.5rem", margin: '20px'}
  return (
    <Popover
        id={id}
        open={open}
        anchorEl={anchorACEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        
        disableScrollLock ={true}
      >
        <div>
            <div>
              <input
                value = {keyword}
                style = {searchBarStyle}
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Search Existing characters by name.."></input>
            </div>
            <div >
              <h5 style={{margin: '20px'}}>ASSIGN CHARACTERS</h5>
              <div style = {{width: "270px" , height: '300px', overflowY: 'auto' , margin: '20px'}}>
                  {
                    CharacterList.sort((a, b) => a.id > b.id? a: b)
                    .map((character, index) => (
                        <div> 
                          <input type="checkbox" style={{margin:'0 20px'}} checked = {associatedNumList.includes(index + 1)?"checked":""}/>
                          <Chip
                            key={index}
                            className={classnames("mr-05 bg-light-gray text-bold-600")}
                            avatarColor="danger"
                            text={index + 1}
                            
                          />
                          {character.character_name}
                        </div>
                    )
                  )}
              </div>
              <div className = {classnames('inline-flex')}>
                 
              </div> 
            </div>

        </div>
          
           
      </Popover>
  );
}
