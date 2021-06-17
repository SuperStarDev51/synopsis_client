import * as React from 'react';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { EventActionTypes } from '@containers/planning/enum';
import { Event } from '@containers/planning/interfaces';
import { Route, useHistory } from "react-router-dom";
import { Routes } from '../../utilities';
import {addProject, deleteProject, getLists} from '@containers/planning/initial-state';
import { SweetAlertCallback } from '@extensions'
import avatarImg from "assets/img/portrait/small/avatar-s-20.jpg"
import UserAvatar from '@src/components/user-profile/userAvatar';
import { Icon, InlineIcon } from '@iconify/react';
// import dotsVertical from '@iconify-icons/mdi/dots-vertical';
import './index.scss';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditProject from './editProject';
import { config } from '../../config';

// import Dropdown from './dropDown';

import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	FormGroup,
	Input,
	Card,
	CardBody,
	Row,
	Col,
	Progress
  } from "reactstrap"
import { suppliersInitialState } from '../suppliers/initial-state';
import { FormattedMessage } from "react-intl"
// import { Icon } from '@components';
import { config } from '../../config';
import {
	BudgetStatusActionTypes,
	BudgetTypesActionTypes, SceneLocationActionTypes, ScenePlaceActionTypes, SceneTimeActionTypes,
	SupplierStatusActionTypes,
	SupplierTypesActionTypes, SupplierUnitTypesActionTypes, TaskStatusActionTypes,
	TaskTypesActionTypes
} from "@root/src/containers/tasks/ListsReducer";

export const EventItem: React.FC = ({ event, setEventActive, user }) => {
	const [showdeleteAlert, setShowdeleteAlert] =  React.useState<any>(false);
	const [showEditModal, setShowEditModal] =  React.useState<any>(false);

	const dispatch = useDispatch();
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

  const setEventUpdate = (project_id: any, field: string, data: any): void => {
	dispatch({
		type: EventActionTypes.SET_EVENT_PARAMETER,
		payload: {
			project_id,
			field,
			data,
		}
	});
}

  const handleClose = (type) => {
    setAnchorEl(null);
	if(type === 'edit'){
		setShowEditModal(true);
	}
	if(type === 'remove'){
		setShowdeleteAlert(true);
	}
  };

  const uploadHandler = (e) =>{
	
		const data = new FormData();
    	data.append('file', e.target.files[0]);

		data.append('project_id', event.id);

		axios.post(config.ipServer + '/imgn/api/v1/project/imgfile/upload', data)
      	.then((res) => {
			console.log("res" ,  res.data.img_path)

        	setEventUpdate(event.id, "img_path", res.data.img_path)
      	});
		
  }

  var nonImageStyle = {width: '50%'}
  var uploadedImageStyle = {maxWidth: '100%', maxHeight: '100%', width: 'auto'}
  
	return (
	<>
	<div>
	<EditProject showEditModal={showEditModal} projectObject = {event} onChange = {setEventUpdate} setShowEditModal = {setShowEditModal}/>
	<input type="file" hidden />
			
	
		<div className=" mr-3 mb-2 Mask pointer"> 
		<label className="label mt-0">    			
			<input type="file" name="file" hidden onChange={uploadHandler}/>
      
			<div className = "project_profile" >
			<span className="overLay">
				<img className="cener" height="50px" width="50px" src="\assets\img\pages/upload-img.png"></img>
			</span>
				<img src={event.img_path == "" || event.img_path == null ? "assets/icons/navbar/Projects.svg": `http://localhost:3000/${event.img_path}`} 
				style={event.img_path == "" || event.img_path == null ? nonImageStyle: uploadedImageStyle} >

				</img>
			</div>
			</label>

	         {/*After testing uncomment the onclick event handler*/}
			<div style = {{width: '66%'}} >
				
				{ 
					showdeleteAlert ? (<SweetAlertCallback
					showAlert={true}
					toogle={() => setShowdeleteAlert(!showdeleteAlert) }
					onConfirm={() => {
						deleteProject(event.id, user.id);
						dispatch({
							type: EventActionTypes.DELETE_EVENT,
							payload: event.id
						});
						setShowdeleteAlert(false)
						}}
					/>) : null
				}
				<Col
					className=""
					
				>

					<div className="font-medium-5">
					<div className="mt-1">{event.project_name}</div>
					
						<div>
							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								onClick={handleClick} 
							>
								<MoreVertIcon />
							</IconButton>
							<Menu
							id="long-menu"
							anchorEl={anchorEl}
							keepMounted
							open={open}
							onClose={handleClose}
							PaperProps={{
							style: {
								maxHeight: ITEM_HEIGHT * 4.5,
								width: '20ch',
							},
							}}
						>
							{/* {options.map((option) => ( */}
							<MenuItem   onClick={()=>handleClose('edit')}>
							
								{"EDIT PROJECT"}

								
							</MenuItem>
							<MenuItem   onClick={()=>handleClose('remove')} >
							
							{"REMOVE PROJECT"}

							</MenuItem>
							{/* ))} */}
						</Menu>
						</div>

					</div>
					<div style={{height :"156px", width:"100%"}} onClick={() => {
						setEventActive(event.id);
					}}>

					</div>
					
					<div  className="d-flex" >
						<UserAvatar />
					    <span style={{marginTop: "10px"}}>{user.fullName}</span>
						{/* <span style={{marginTop: "10px"}}>{user.last_name}</span> */}
					</div> 
				</Col>
			</div>
			
		</div>
		</div>
	</>
	)
};

export const Projects: React.FC = () => {
	const dispatch = useDispatch();
	const state = useSelector((state: RootStore) => state);
	const events = state.events
	const user = state.user
	const history = useHistory();
	const [showAddAlert, setShowAddAlert] =  React.useState<boolean>(false);
	const [eventName, setEventName] = React.useState<string>('');
	const [eventBudget, setEventBudget] = React.useState<number>(0);
	const [search, setSearch] = React.useState<string>('');
	const isEventDataFilled: boolean = eventName ? true : false;
	let filteredEvents = search && search.length ? events.filter((event:Event)=> event.project_name.toLowerCase().trim().includes(search.toLowerCase().trim())) : events

	React.useEffect(()=>{
		// setEventActive(null)
	},[]);

	const setEventActive = (event_id: any): void => {
		dispatch({
			type: EventActionTypes.SET_EVENTS,
			payload: events.map((event: Event, i: number)=>{
					if( event.id !== event_id ) return {...event, preview: false}
					else return {...event,preview: event_id ? true : false}
				})
		});
		if(event_id) history.push(Routes.SCRIPT.replace(':id',String(event_id)))
	}

	

	const addNewProject = (<>
			  <button onClick={()=> setShowAddAlert(true)}
			  	className={` btn btn-primary`}>
			 	 <FormattedMessage id='create_new_project' />
			  </button>
			  <Modal
                  isOpen={showAddAlert}
                  toggle={()=>setShowAddAlert(false)}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={()=>setShowAddAlert(false)}>
				  create new project
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="name">Name:</Label>
                      <Input
					  	onChange={(e: any): void => {
							setEventName(e.target.value);
						}}
                        type="text"
						name="name"
						id="name"
						placeholder="Event name"
						value={eventName}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="budget">Budget:</Label>
                      <Input
					  onChange={(e: any): void => {
						setEventBudget(e.target.value);
						}}
                        type="number"
						name="budget"
						id="budget"
						placeholder="Planned Budget"
						value={eventBudget === 0 ? '' : eventBudget}
                      />
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
					<Button color="primary"
						onClick={async ()=>{
							if( isEventDataFilled ) {
								let newProject:any = await addProject({user_id: user.id, company_id: user.company_id,project_name: eventName, budget: eventBudget})
								if( newProject && newProject.project) {
									dispatch({
										type: EventActionTypes.SET_EVENTS,
										payload: [...events,newProject.project]
									});
									// setEventActive(newProject.project.id)
									setShowAddAlert(false)
									setEventName('');
									setEventBudget('');
								}

							}
						}}>
						create
                    </Button>{" "}
                  </ModalFooter>
             </Modal>

		 </>
	);

	return (
		<div className="text-white" style={{padding: '2.8rem 2.2rem 0'}}>
			<div className="d-flex  my-5  justify-content-between" style = {{color: 'black'}}>
				<div>
					<img src = "../../assets/icons/top_project_nav.svg" style = {{width: '2rem', height: "2rem"}}/>
					<span> &nbsp;Projects </span>
				</div>
				{/* <div className="h1 text-bold-800 text-white"><FormattedMessage id='active_projects' /></div> */}
				{/* <Input
					value={search}
					onChange={(e)=> setSearch(e.target.value)}
					placeholder="Search"
					className="width-300"
				/> */}
				{addNewProject}
			</div>

			<Row>
				{filteredEvents.map((event:Event, i:number) => (
					<EventItem
						key={i}
						event={event}
						setEventActive={setEventActive}
						user={user}
					/>
				))}
			</Row>
			<div className="h1 my-3 text-bold-800 text-white">
				<FormattedMessage id='finished_projects' />
			</div>
		</div>

		);
};

export default Projects;
