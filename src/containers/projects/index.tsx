import * as React from 'react';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
// import {Button} from '@components';
import { EventActionTypes } from '@containers/planning/enum';
import { Event } from '@containers/planning/interfaces';
import { Route, useHistory } from "react-router-dom";
import { Routes } from '../../utilities';
import {addProject, deleteProject, getLists} from '@containers/planning/initial-state';
import { SweetAlertCallback } from '@extensions'
import avatarImg from "assets/img/portrait/small/avatar-s-20.jpg"
import Avatar from "@vuexy/avatar/AvatarComponent"

import './index.scss';
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
import { Icon } from '@components';
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
	const dispatch = useDispatch();
	return (
		<div className=" mr-3 mb-2 Mask pointer">
			<div className = "project_profile" >
				<img src="assets/icons/navbar/Projects.svg" style={{width: "50%" ,marginTop: '45%', marginLeft: "25%"}}></img>
			</div>
			<div style = {{width: '75%'}} onClick={() => {
						setEventActive(event.id);

					}}>
				<Button
					className="delete-project-button no-edge-right"
					onClick={() => {
						setShowdeleteAlert(true)
					}}
				>
				<Icon src={config.iconsPath+"options/x.svg"} style={{height: '1rem', width: '1rem'}} className=""/>
				</Button>
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
					
					lg="2" md="3" sm="4" xs="6"
				>
					<div className="font-medium-5" style={{minWidth: "300px"}}>{event.project_name}</div>
					{/* <div className="width-100-per d-flex justify-content-between mt-1 px-1 font-medium-4">
						<small className=" mb-25">
							Updated 15m
						</small>
						<small className="mb-25">
							Series Pod
						</small>
					</div>
					<div className="d-flex">
						<Avatar className="mr-1" size='md' img={avatarImg} />
						<Avatar className="mr-1" size='md' img={avatarImg} />
						<Avatar className="mr-1" size='md' img={avatarImg} />
						<Avatar className="mr-1" size='md' img={avatarImg} />
						<Avatar className="mr-1" size='md' img={avatarImg} />
					</div> */}
				</Col>
			</div>
			
		</div>
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
			  	className={`height-50 width-auto c-btn c-btn--rounded c-btn--rounded-centered`}>
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
		<div className="text-white" style={{padding: '1.8rem 2.2rem 0'}}>
			<div className="d-flex  my-5 align-items-center justify-content-between">
				<div className="h1 text-bold-800 text-white"><FormattedMessage id='active_projects' /></div>
				<Input
					value={search}
					onChange={(e)=> setSearch(e.target.value)}
					placeholder="Search"
					className="width-300"
				/>
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
