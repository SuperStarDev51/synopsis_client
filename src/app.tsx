import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { useSelector, useDispatch } from 'react-redux';
import { ScriptsActionTypes } from '@containers/scripts/enums';
import {getProjectScript, getAllProjectCharacters, getLimitations} from '@containers/scripts/initial-state'

import { UsersActionTypes } from '@containers/user/enums';
import { UserActionTypes } from '@containers/user/enums';
import { getAllProjectsCompany } from '@containers/projects/initial-state';
import { getSuppliersList } from '@containers/suppliers/initial-state';
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { getExpenseList } from '@containers/budget/initial-state'
import * as ExpensesActions from "./redux/actions/budget/expenses"
import * as scenesBreakdownActions from "./redux/actions/scenes-breakdown"
import { EventActionTypes } from '@containers/planning/enum';
import {
	TaskTypesActionTypes,
	PermissionTypeActionTypes,
	PermissionStatusActionTypes,
	CharactersActionTypes,
	TaskStatusActionTypes,
	SupplierStatusActionTypes,
	SupplierJobTitlesActionTypes,
	SupplierTypesActionTypes,
	BudgetStatusActionTypes,
	BudgetTypesActionTypes,
	SupplierUnitTypesActionTypes,
	SceneTimeActionTypes,
	ScenePlaceActionTypes,
	SceneLocationActionTypes, LimitationsActionTypes, CompaniesActionTypes,
} from '@containers/tasks/ListsReducer';
import {addProject, getLists} from '@containers/planning/initial-state';
import { getProjectTasks } from '@containers/tasks/initial-state';
import { getProjectShootingDays } from '@containers/shooting_days/initial-state';
import { RootStore } from '@src/store';
import { Event } from '@containers/planning/interfaces';
import { isAuth } from '@containers/user/initial-state';
import { getAllCompanyUsers, getAllCompanies } from '@containers/user/initial-state';
import { useHistory } from "react-router-dom";
import { Route, Router } from 'react-router-dom';
import { Switch, Redirect } from 'react-router';
import { ContextLayout } from "./utility/context/Layout"

import 'app.scss';
import "flatpickr/dist/themes/light.css";
import "assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import { Routes } from './utilities';
import * as Loadables from './loadables';
import { ShootingDaysActionTypes } from '@containers/shooting_days/enums';
//test comment1
export const PrivateRoute = ({ component: Component, ...rest }: any): JSX.Element => {
	console.log('test')
	return (
	<Route
		{...rest}
		render={(props: any): React.ReactNode =>
			// TODO: Add real check for auth import {  } from "module";
			// eslint-disable-next-line
			isAuth() ?  <Component {...props} {...rest} /> : <Redirect to={Routes.LOGIN} />
		}
	/>
)};

export const AppRoute = ({ component: Component, fullLayout, ...rest }:any) => {
	const user = useSelector((state: RootStore) => state.user)
	return (
	  <Route
		{...rest}
		render={props => {
		  return (
			<ContextLayout.Consumer>
			  {context => {
				if( context && context.state ) {
					let LayoutTag =
					fullLayout === true
						? context.fullLayout
						: context.state.activeLayout === "horizontal"
						? context.horizontalLayout
						: context.VerticalLayout
					return (
					<LayoutTag {...props} permission={user}>
						<Component {...props} />
					</LayoutTag>
					)
				}
			  }}

			</ContextLayout.Consumer>
		  )
		}}
	  />
	)
}

export const App = hot(() => {
	const dispatch = useDispatch();
	const state = useSelector((state: RootStore) => state)
	const history = useHistory();
	const events = state.events
	let URL = window.location.pathname
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const user = state.user;

	React.useEffect(() => {
		if( activeEvent && activeEvent.id ) {

			addProject({user_id: user.id, company_id: user.company_id, project_id: activeEvent.id })
				.then((res:any) => {
					if (res?.scene_time) {
						dispatch(scenesBreakdownActions.setScenetime(res.scene_time));
					}
					if (res?.scene_location) {
						dispatch(scenesBreakdownActions.setSceneLocation(res.scene_location));
					}
				});

			getSuppliersList(activeEvent.id)
				.then((res:any) => {
					dispatch({
						type: SuppliersActionTypes.SET_SUPPLIERS_GROUP,
						payload: res
					});
			});
			getProjectScript(activeEvent.id, 0)
			.then(scripts =>{
				dispatch({
					type: ScriptsActionTypes.SET_SCRIPTS,
					payload: scripts
				});
			})
			getAllProjectCharacters(activeEvent.id)
			.then(characters =>{
				dispatch({
					type: CharactersActionTypes.SET_CHARACTERS,
					payload: characters
				});
			})
			getLimitations(activeEvent.id)
				.then(res => {
					dispatch({
						type: LimitationsActionTypes.SET_LIMITATIONS,
						payload: res.limitations
					});
				})
		}
	},[activeEvent && activeEvent.id]);




	React.useEffect(() => {
		if( user && user.company_id && URL !== Routes.NOT_FOUND ){
			getAllProjectsCompany(user.company_id, user.id)
			.then((res:any) => {
				let EventID = Number(URL.split('/')[1])
					dispatch({
						type: EventActionTypes.SET_EVENTS,
						payload: EventID > 0 ? res.map((event: Event, i: number)=>{
							if( event.id !== EventID ) return event
							else return {
								...event,
								preview: true
							}
						}) : res
					});
			});
		}
	},[user]);

	React.useEffect(() => {
		if( user && user.company_id && URL !== Routes.NOT_FOUND ){
			getAllCompanyUsers(user.company_id)
				.then((res:any) => {
					dispatch({
						type: UserActionTypes.SET_ALL_COMPANY_USERS,
						payload: res
					});

				});
		}
	},[user]);

React.useEffect(() => {
	if( activeEvent && activeEvent.id ) {
		getProjectTasks(activeEvent.id, 1)
		.then(users =>{
			dispatch({
				type: UsersActionTypes.SET_USERS,
				payload: users
			});
		})

		getProjectShootingDays(activeEvent.id)
		.then(shootingDays =>{
			dispatch({
				type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
				payload: shootingDays
			});
		})

		getExpenseList(activeEvent.id)
		 .then(expenses =>{dispatch(ExpensesActions.setExpenseTable(expenses))})
	}
},[activeEvent && activeEvent.id]);


React.useEffect(() => {
	if( isAuth() ) {
		dispatch({
			type: UserActionTypes.SET_USER,
			payload: JSON.parse(isAuth())
		});
	}
},[]);



React.useEffect(() => {
	if ( isAuth() ) {
		let EventID = Number(URL.split('/')[1])
		let Route = URL.split('/')[2]
		if ( EventID ) {
			if( Route ) {
					const setEvent = (event_id: number): void => {
						dispatch({
							type: EventActionTypes.SET_EVENTS,
							payload: events.map((event: Event, i: number)=>{
									if( event.id !== event_id ) return {...event, preview: false}
									else return {...event,preview: true}
								})
						});
					}
					setEvent(EventID)

		} else history.push(Routes.SCRIPT.replace(':id', String(EventID)))
		}
	} else history.push(Routes.LOGIN)
},[]);


React.useEffect(() => {
	getLists().then((data: any) => {
		if (data) {

			const {permission_status, permission_type, supplier_job_title, companies} = data

			if (permission_status) { // task status
				dispatch({
					type: PermissionStatusActionTypes.SET_PERMISSION_STATUS,
					payload: permission_status
				});
			}

			if (permission_type) { // task status

				dispatch({
					type: PermissionTypeActionTypes.SET_PERMISSION_TYPES,
					payload: permission_type
				});
			}

			if(supplier_job_title) { // supplier job title
				dispatch({
					type: SupplierJobTitlesActionTypes.SET_SUPPLIER_JOB_TITLES,
					payload: supplier_job_title
				})
			}

			if (companies) { // list of all companies
				dispatch({
					type: CompaniesActionTypes.SET_COMPANIES_LIST,
					payload: companies
				});
			}
		}
	});

	if( isAuth() &&  URL !== Routes.NOT_FOUND) {
		getLists().then((data: any) => {
			if (data) {
				const { task_type, task_status, supplier_type, supplier_unit_type, supplier_status, supplier_job_title, budget_type, budget_status, scene_time, scene_place, scene_location} = data


				if (task_type) { // task type
					dispatch({
						type: TaskTypesActionTypes.SET_TASK_TYPES,
						payload: task_type
					});
				}
				if (task_status) { // task status
					dispatch({
						type: TaskStatusActionTypes.SET_TASK_STATUS,
						payload: task_status
					});
				}
				if (supplier_type) { // supplier type
					dispatch({
						type: SupplierTypesActionTypes.SET_SUPPLIER_TYPES,
						payload: supplier_type
					});
				}
				if (supplier_status) { // supplier status
					dispatch({
						type: SupplierStatusActionTypes.SET_SUPPLIER_STATUS,
						payload: supplier_status
					});
				}
				if (supplier_unit_type) { // supplier unit type
					dispatch({
						type: SupplierUnitTypesActionTypes.SET_SUPPLIER_UNIT_TYPES,
						payload: supplier_unit_type
					});
				}
				if (budget_type) { // budget type
					dispatch({
						type: BudgetTypesActionTypes.SET_BUDGET_TYPES,
						payload: budget_type
					});
				}
				if (budget_status) { // budget status
					dispatch({
						type: BudgetStatusActionTypes.SET_BUDGET_STATUS,
						payload: budget_status
					});
				}
				if (scene_place) { // scene place
					dispatch({
						type: ScenePlaceActionTypes.SET_SCENE_PLACE,
						payload: scene_place
					});
				}
			}
		})
	}
	},[]);

	return(
	<Switch>
		<AppRoute path={Routes.ACTORS} exact={true} component={Loadables.Actors}  />
		<AppRoute path={Routes.PROJECTS} exact={true} component={Loadables.Projects} fullLayout />
		{/* <AppRoute path={Routes.SCRIPT} exact={true} component={Loadables.Script} /> */}
		<AppRoute path={Routes.BREAKDOWN} exact={true} component={Loadables.Breakdown} />
		<AppRoute path={Routes.SHOOTING_DAYS} exact={true} component={Loadables.ShootingDays} />
		<AppRoute path={Routes.TASKS} exact={true} component={Loadables.Tasks} />
		<AppRoute path={Routes.SUPPLIERS} exact={true} component={Loadables.Suppliers} />
		<AppRoute path={Routes.PERMISSIONS} exact={true} component={Loadables.Permissions} />
		<AppRoute path={Routes.FILES} exact={true} component={Loadables.Files} />
		{/* <AppRoute path={Routes.PLANNING} exact={true} component={Loadables.Planning} /> */}
		<AppRoute path={Routes.OVERVIEW} exact={true} component={Loadables.Overview} />
		<AppRoute path={Routes.NOT_FOUND} component={Loadables.NotFound} />
		<AppRoute path={Routes.REGISTER} component={Loadables.Register} fullLayout/>
		<AppRoute path={Routes.LOGIN} component={Loadables.Login} fullLayout/>

		<AppRoute path={Routes.SCRIPT} exact={true} component={Loadables.Script} />
		<AppRoute path={Routes.BUDGET} exact={true} component={Loadables.Budget} />
		{/* <AppRoute path={Routes.BUDGETS} exact={true} component={Loadables.Budget} /> */}
	</Switch>
)});
