import * as React from 'react';
import { RootStore } from '@src/store';
import Popover from '@material-ui/core/Popover';
import Chip from "@vuexy/chips/ChipComponent"
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { addCharacter, getAllProjectCharacters, getProjectScript } from "@root/src/containers/scripts/initial-state";
import { useDispatch } from 'react-redux';
import { CharactersActionTypes } from '@containers/tasks/ListsReducer';
import { ScriptsActionTypes } from '@containers/scripts/enums';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '@src/config';

export const AssignCharacter: React.FunctionComponent = ({ showDialog, associatedNumList, anchorACEl, setShowDialog, setAnchorACEl, project_id, scene, project_scene_id }) => {
	const dispatch = useDispatch();
	const characterState = useSelector((state: RootStore) => state.characters)
	const CharacterList = [...characterState]
	const [max_associated_num, setMaxAssociated_num] = React.useState(CharacterList.length + 1)
	
	CharacterList.map(item =>{
		if (item.associated_num >= max_associated_num)
			 setMaxAssociated_num(item.associated_num + 1)
	})
	

	const [open, setOpen] = React.useState(false);
	const [keyword, setKeyword] = React.useState("")
	const [showAddCharacterform, setShowAddCharacterform] = React.useState(false);
	const [newCharacterName, setNewCharacterName] = React.useState('')

	const id = open ? 'simple-popover' : undefined;

	console.log("CharacterList", CharacterList)
	console.log("associatedNumList", associatedNumList)
	console.log("project secen id", project_scene_id)



	React.useEffect(() => {
		if (showDialog) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [showDialog])

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
			associated_num: CharacterList.length + 1,
		};

		const addedCharacter = await addCharacter(newCharacter);



		let characterIds: any[] = []
		characterIds = [...characterIds, addedCharacter.character_id]


		getProjectScript(project_id, 0)
			.then((scripts: any) => {
				dispatch({
					type: ScriptsActionTypes.SET_SCRIPTS,
					payload: scripts
				});
			})




		getAllProjectCharacters(project_id)
			.then((characters: any) => {

				dispatch({
					type: CharactersActionTypes.SET_CHARACTERS,
					payload: characters
				});
			})


		setNewCharacterName("")

	}

	const handleChangeInput = async (event: React.ChangeEvent<HTMLInputElement> , character_id: number) => {
		console.log("character_id", character_id)
		let scene_string = localStorage.getItem('scene') 
		let scene;
		if(scene_string)
			scene = JSON.parse(scene_string)

		let project_id = localStorage.getItem('project_id')
		console.log("scene" , scene)
		const scene_characters = scene.characters
		let  selectedCharacter = []
		selectedCharacter = CharacterList.filter(item => item.id === character_id)

		if (event.target.checked){
			const newCharacter = {
				
				project_id: project_id,
				project_scene_id: project_scene_id,
				character_id : character_id, 
				character_name : selectedCharacter.character_name,
				character_type : selectedCharacter.character_type,

			};
	
			const addedCharacter = await addCharacter(newCharacter);
	
			let characterIds: any[] = []
			characterIds = [...characterIds, addedCharacter.character_id]
	
	
			getProjectScript(project_id, 0)
				.then((scripts: any) => {
					dispatch({
						type: ScriptsActionTypes.SET_SCRIPTS,
						payload: scripts
					});
				})	
	
		
		}else{
			const scene_id = scene.scene_id
			const chapter_number = scene.chapter_number
			axios.delete(config.ipServer+'/imgn/api/v1/project/scriptSceneCharacter/delete', {data: {
				character_id,
				project_id,
				scene_id, 
				chapter_number
			}})
			.then(function (res: any) {
				console.log(res.data)
				console.log("Script character deleted")
				
				getProjectScript(project_id, 0)
				.then((scripts: any) =>{
					dispatch({
						type: ScriptsActionTypes.SET_SCRIPTS,
						payload: scripts
					});
				})

			
				
			})		
		}

	}

	const searchBarStyle = { width: '270px', padding: "0.5rem", margin: '20px' }
	const AddCharacterspanstyle = { color: 'blue', margin: '20px 0 0 40px', cursor: 'pointer' }
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

			disableScrollLock={true}
		>
			<div>
				<div>
					<input
						value={keyword}
						style={searchBarStyle}
						onChange={(e) => setKeyword(e.target.value)}
						placeholder="Search Existing characters by name.."></input>
				</div>
				<div >
					<h5 style={{ margin: '20px' }}>ASSIGN CHARACTERS</h5>
					<div style={{ width: "270px", height: '185px', overflowY: 'auto', margin: '20px', borderBottom: '1px solid' }}>
						{
							CharacterList.sort((a, b) => a.id - b.id)
								.filter((character: { character_name: string | string[] }) => character.character_name.includes(keyword))
								.map((character: { character_name: string , id: number, associated_num: number }, index: number) => (
									<div>
										<input
											type="checkbox"
											style={{ margin: '0 20px' }}
											checked={associatedNumList.includes(character.associated_num) ? true : false} 
											onChange = { (e) => handleChangeInput(e, character.id)}
										/>
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
					<div style={{ marginBottom: '20px' }}>
						{
							!showAddCharacterform && (
								<div className={classnames("inline-flex")}>

									<span style={AddCharacterspanstyle} onClick={() => setShowAddCharacterform('true')} >
										+Add character
									</span>
									<span >
										<Link to='/cast_member' style={AddCharacterspanstyle}>Manage character</Link>
									</span>
								</div>
							)
						}
						{
							showAddCharacterform && (
								<div>
									<div className={classnames('inline-flex')}>
										<input placeholder="CHARACTER NAME..." value={newCharacterName} onChange={(e) => setNewCharacterName(e.target.value)} style={{ margin: "0 40px", width: '150px', border: 'none', borderBottom: '1px solid', padding: "0.5rem" }}></input>
										<input value={max_associated_num} onChange = {(e) => setMaxAssociated_num(parseInt(e.target.value))} style={{ border: 'none', width: '30px', borderBottom: '1px solid' }}></input>
									</div>
									<div className={classnames('inline-flex')} style={{ margin: '0 40px' }}>
										<input type='checkbox' style={{ margin: '20px 10px 0 0' }} readOnly></input>
										<span>Tag all mentions in script</span>
									</div>
									<div className={classnames('inline-flex')} style={{ margin: '20px 40px' }}>
										<button className={classnames('btn btn-info')} style={{ margin: '0 20px' }} onClick={() => AddCharacterFunction()}>Create</button>
										<button className={classnames('btn btn-info')} onClick={() => setShowAddCharacterform(false)}>Cancel</button>
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
