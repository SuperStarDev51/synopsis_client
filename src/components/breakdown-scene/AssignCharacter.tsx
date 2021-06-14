import * as React from 'react';
import { RootStore } from '@src/store';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Chip from "@vuexy/chips/ChipComponent"
import classnames from 'classnames';

export const  AssignCharacter: React.FunctionComponent = ({showDialog ,CharacterList , associatedNumList , anchorACEl , setShowDialog, setAnchorACEl}) => {
 
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("")
  const [showAddCharacterform, setShowAddCharacterform] = React.useState(false);

  const id = open ? 'simple-popover' : undefined;

  // console.log("CharacterList", CharacterList)
  // console.log("associatedNumList", associatedNumList)

  React.useEffect(()=>{
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

  const AddCharacterFunction = () => {
    setShowAddCharacterform('flase')

  }



  const searchBarStyle = {width: '270px', padding:"0.5rem", margin: '20px'}
  const AddCharacterspanstyle = { color: 'blue' , margin : '20px 40px' , cursor: 'pointer'}
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
              <div style = {{width: "270px" , height: '185px', overflowY: 'auto' , margin: '20px' , borderBottom: '1px solid' }}>
                  {
                    CharacterList.sort((a, b) => a.id - b.id)
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
                    )
                  }
              </div>
              <div style= {{marginBottom: '20px'}}>
                {
                !showAddCharacterform && (
                 <span style = {AddCharacterspanstyle} onClick = {() => setShowAddCharacterform('true')} >
                    +Add character
                 </span>
                )
                }
                {
                  showAddCharacterform && (
                    <div>
                      <div className = {classnames('inline-flex')}>
                        <input placeholder = "CHARACTER NAME..." style = {{margin: "0 40px" , width:'150px', border:'none', borderBottom:'1px solid'}}></input>
                        <input value = {CharacterList.length + 1} style = {{ border:'none', width: '30px',  borderBottom:'1px solid'}}></input>
                      </div>
                      <div className = {classnames('inline-flex')} style = {{margin: '0 40px'}}>
                        <input type='checkbox' style = {{margin : '20px 10px 0 0'}}></input>
                        <span>Tag all mentions in script</span>
                      </div>
                      <div className = {classnames('inline-flex')} style = {{margin: '20px 40px'}}>
                        <button className = {classnames('btn btn-info')} style= {{margin: '0 20px'}} onClick = { () => AddCharacterFunction}>Create</button>
                        <button className = {classnames('btn btn-info')} onClick = {() => setShowAddCharacterform(false)}>Cancel</button>
                      </div>
                    </div>
                  )
                }
              </div> 
            </div>

        </div>
          
           
      </Popover>
  );
}

export default AssignCharacter;
