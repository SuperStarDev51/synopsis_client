import * as React from 'react';
import { RootStore } from '@src/store';
import Popover from '@material-ui/core/Popover';
import Chip from "@vuexy/chips/ChipComponent"
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { addCharacter , getAllProjectCharacters , getProjectScript } from "@root/src/containers/scripts/initial-state";
import { useDispatch } from 'react-redux';
import { CharactersActionTypes  } from '@containers/tasks/ListsReducer';
import { ScriptsActionTypes } from '@containers/scripts/enums';
import { Link } from 'react-router-dom';
export const  AssignCharacter: React.FunctionComponent = ({showDialog , associatedNumList , anchorACEl , setShowDialog, setAnchorACEl , project_id,  project_scene_id }) => {
  const dispatch = useDispatch();
  const characterState = useSelector((state: RootStore) => state.characters)
	const CharacterList = [...characterState]

  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("")
  const [showAddCharacterform, setShowAddCharacterform] = React.useState(false);
  const [newCharacterName, setNewCharacterName] = React.useState('')

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

  const AddCharacterFunction = async () => {

    const newCharacter = {
			character_type: 0,
			project_id: project_id,
			character_name: newCharacterName,
			project_scene_id: project_scene_id,
      associated_num : CharacterList.length + 1 ,
		};

		const addedCharacter = await addCharacter(newCharacter);


    
      let characterIds: any[] = []
      characterIds = [...characterIds, addedCharacter.character_id]


      getProjectScript(project_id, 0)
			.then((scripts: any) =>{
				dispatch({
					type: ScriptsActionTypes.SET_SCRIPTS,
					payload: scripts
				});
			})




    getAllProjectCharacters(project_id)
    .then((characters: any) =>{

      dispatch({
        type: CharactersActionTypes.SET_CHARACTERS,
        payload: characters
      });
    })


    setNewCharacterName("")

  }



  const searchBarStyle = {width: '270px', padding:"0.5rem", margin: '20px'}
  const AddCharacterspanstyle = { color: 'blue' , margin : '20px 0 0 40px' , cursor: 'pointer'}
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
                    .filter((character: { character_name: string | string[] }) => character.character_name.includes(keyword))
                    .map((character: { character_name: string  }, index: number) => (
                        <div>
                          <input type="checkbox" style={{margin:'0 20px'}} checked = {associatedNumList.includes(index + 1)? "checked" : ""} readOnly/>
                          <Chip
                            key={index}
                            className={classnames("mr-05 bg-light-gray text-bold-600")}
                            avatarColor="danger"
                            text={character.associated_num}
                            
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
                  <div className = {classnames("inline-flex")}>

                 <span style = {AddCharacterspanstyle} onClick = {() => setShowAddCharacterform('true')} >
                    +Add character
                 </span>
                 <span >
                    <Link to='/cast_member' style = {AddCharacterspanstyle}>Manage character</Link>
                </span>
                </div>
                )
                }
                {
                  showAddCharacterform && (
                    <div>
                      <div className = {classnames('inline-flex')}>
                        <input placeholder = "CHARACTER NAME..." value = {newCharacterName} onChange= {(e) => setNewCharacterName(e.target.value)} style = {{margin: "0 40px" , width:'150px', border:'none', borderBottom:'1px solid' , padding:"0.5rem"}}></input>
                        <input value = {CharacterList.length + 1} readOnly style = {{ border:'none', width: '30px',  borderBottom:'1px solid'}}></input>
                      </div>
                      <div className = {classnames('inline-flex')} style = {{margin: '0 40px'}}>
                        <input type='checkbox' style = {{margin : '20px 10px 0 0'}} readOnly></input>
                        <span>Tag all mentions in script</span>
                      </div>
                      <div className = {classnames('inline-flex')} style = {{margin: '20px 40px'}}>
                        <button className = {classnames('btn btn-info')} style= {{margin: '0 20px'}} onClick = { () => AddCharacterFunction()}>Create</button>
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
