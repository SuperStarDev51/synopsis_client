import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { addCharacter ,getProjectScript ,  getAllProjectCharacters } from "@root/src/containers/scripts/initial-state";
import { useSelector, useDispatch } from 'react-redux';
import { CharactersActionTypes} from '@containers/tasks/ListsReducer';
import { RootStore } from '@src/store';
import axios from 'axios';
import { config } from '../../../config';
import { ScriptsActionTypes } from '@containers/scripts/enums';

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
	setOpenAlert(data: boolean) : void;
}
const RemoveCastDialog: React.FC<RemoveCastDialogProps> = (props: RemoveCastDialogProps) => {
	const { Character_id , castname, castID, open, setOpen , setOpenAlert} = props;
	
	const classes = useStyles();
	const dispatch = useDispatch();
	const state = useSelector((state: RootStore) => state)

	

	const clickRemoveBtn = () => {
		console.log("deleted character id", Character_id)
		const events = state.events
		// const activeEvent = events.filter((event: Event) => event.preview)[0];

		setOpen(false)
		let character_id = Character_id
		let project_id  = localStorage.getItem('project_id')
		let scene_string = localStorage.getItem('scene') 
		
		let scene;
		if(scene_string)
			scene = JSON.parse(scene_string)

		let scene_id = scene.scene_id
		let chapter_number = scene.chapter_number


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

			getAllProjectCharacters(project_id)
			.then((characters: any) =>{

				dispatch({
					type: CharactersActionTypes.SET_CHARACTERS,
					payload: characters
				});
			})
			setTimeout(() => {
				setOpenAlert(true);

			}, 1000);
			
		})			
			
		

	}

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
			<Button className={classes.removeButton} onClick={()=> clickRemoveBtn()} >
				Remove Cast Member
			</Button>
		</MuiDialogContent>
	</Dialog>);

}

export default RemoveCastDialog;
