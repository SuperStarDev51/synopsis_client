import React from "react"
import { Navbar } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { addProject } from '@containers/planning/initial-state';
import './index.scss'
import { FormattedMessage } from "react-intl"
import { EventActionTypes } from '@containers/planning/enum';
import { RootStore } from '@src/store';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	FormGroup,
	Input,
} from "reactstrap"
import { useSelector, useDispatch } from 'react-redux';

const UserName = props => {
	let username = props.user.first_name + ' ' + props.user.last_name
	return username
}
const ThemeNavbar = props => {
	const [showAddAlert, setShowAddAlert] = React.useState(false);
	const [eventName, setEventName] = React.useState('');
	const [eventBudget, setEventBudget] = React.useState(0);
	const state = useSelector((state) => state);
	const events = state.events
	// const [showAddProject, setShowAddProject] = React.useState(true)
	const dispatch = useDispatch();
	const { user, activeEvent } = props
	const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"]
	const navbarTypes = ["floating", "static", "sticky", "hidden"]
	const md = isWidthUp('md', props.width)
	const isEventDataFilled = eventName ? true : false;
	const addNewProject = (<>
		<button onClick={() => setShowAddAlert(true)}
			className={` btn btn-primary`}>
			<FormattedMessage id='create_new_project' />
		</button>
		<Modal
			isOpen={showAddAlert}
			toggle={() => setShowAddAlert(false)}
			className="modal-dialog-centered"
		>
			<ModalHeader toggle={() => setShowAddAlert(false)}>
				create new project
			</ModalHeader>
			<ModalBody>
				<FormGroup>
					<Label for="name">Name:</Label>
					<Input
						onChange={(e) => {
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
						onChange={(e) => {
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
					onClick={async () => {
						if (isEventDataFilled) {
							let newProject = await addProject({ user_id: user.id, company_id: user.company_id, project_name: eventName, budget: eventBudget })
							if (newProject && newProject.project) {
								dispatch({
									type: EventActionTypes.SET_EVENTS,
									payload: [...events, newProject.project]
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
		<React.Fragment>
			<div className="content-overlay" />
			<div className="header-navbar-shadow" />
			<Navbar
				className={classnames(
					"header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
					{
						"navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
						"navbar-dark": colorsArr.includes(props.navbarColor),
						"bg-primary":
							props.navbarColor === "primary" && props.navbarType !== "static",
						"bg-danger":
							props.navbarColor === "danger" && props.navbarType !== "static",
						"bg-success":
							props.navbarColor === "success" && props.navbarType !== "static",
						"bg-info":
							props.navbarColor === "info" && props.navbarType !== "static",
						"bg-warning":
							props.navbarColor === "warning" && props.navbarType !== "static",
						"bg-dark":
							props.navbarColor === "dark" && props.navbarType !== "static",
						"d-none": props.navbarType === "hidden" && !props.horizontal,
						"floating-nav":
							activeEvent && ((props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal)),
						"navbar-static-top":
							props.navbarType === "static" && !props.horizontal,
						"fixed-top": props.navbarType === "sticky" || props.horizontal,
						"scrolling": props.horizontal && props.scrolling

					}
				)}
				style= {{height: '60px'}}
			>
				<div className="navbar-wrapper" >
					<div className={classnames("bg-light-gray navbar-container content pr-3")} style = {{height: '60px'}}>
						<div
							className="navbar-collapse d-flex justify-content-between align-items-center"
							id="navbar-mobile"
						>

							{/* <div className="bookmark-wrapper">
								{activeEvent && (
									<NavbarBookmarks
									sidebarVisibility={props.sidebarVisibility}
									handleAppOverlay={props.handleAppOverlay}
									/>
									)}
								</div> */}


							<div className=" h2 ml-5 mr-3 text-bold height-4-rem line-height-4-rem overflow-hidden">
								<div>
									<img src="../../assets/icons/top_project_nav.svg" style={{ width: '2rem', height: "2rem" }} />
									&nbsp; Projects {activeEvent && (<> &gt; {activeEvent.project_name} </>)}
								</div>

							</div>
							{addNewProject}
							{/* {activeEvent && md &&  ( <NavbarProjectDetails /> )} */}

							{/* <NavbarUser
								handleAppOverlay={props.handleAppOverlay}
								changeCurrentLang={props.changeCurrentLang}
								userName={<UserName userdata={user} {...props} />}
								userImg={userImg}
								loggedInWith={null}
								logoutWithJWT={()=>{}}
								logoutWithFirebase={()=>{}}
							/> */}
						</div>
					</div>
				</div>
			</Navbar>
		</React.Fragment>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		activeEvent: state.events.filter((event) => event.preview)[0]
	}
}

export default withWidth()(connect(mapStateToProps, {})(ThemeNavbar))
