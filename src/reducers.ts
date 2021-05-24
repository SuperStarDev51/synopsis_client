import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { Reducer, combineReducers } from 'redux';

import { overviewReducer } from '@containers/overview/reducer';
import { default as usersReducer } from '@containers/tasks/reducer';
import { companiesReducer, permissionTypeReducer, permissionStatusReducer, taskTypesReducer, taskStatusReducer, supplierTypesReducer, supplierStatusReducer,supplierJobTitlesReducer, budgetTypesReducer, charactersReducer, limitationsReducer, SupplierUnitTypesReducer,  budgetStatusReducer, sceneTimeReducer, scenePlaceReducer, sceneLocationReducer  } from '@src/containers/tasks/ListsReducer';
import { allCompanyUsersReducer } from '@containers/user/reducer'
import { default as permissionsReducer } from '@containers/permissions/reducer';
import { default as suppliersReducer } from '@containers/suppliers/reducer';
import { planningReducer, eventsReducer } from '@containers/planning/reducer';
import { expensesReducer, incomeReducer } from '@containers/budget/reducer';
import { scriptsReducer } from '@containers/scripts/reducer';
import { shootingDaysReducer } from '@containers/shooting_days/reducer';

import { default as usereducer } from '@containers/user/reducer';

import calenderReducer from "./redux/reducers/calendar/"
import emailReducer from "./redux/reducers/email/"
import chatReducer from "./redux/reducers/chat/"
import todoReducer from "./redux/reducers/todo/"
import customizer from "./redux/reducers/customizer/"
import navbar from "./redux/reducers/navbar/"
import dataList from "./redux/reducers/data-list/"

export default (history: History<any>): Reducer<any, any> =>
	combineReducers({
		router: connectRouter(history),
		user: usereducer,
		allCompanyUsers: allCompanyUsersReducer,
		scripts: scriptsReducer,
		shootingDays: shootingDaysReducer,
		income: incomeReducer,
		expenses: expensesReducer,
		suppliers: suppliersReducer,
		users: usersReducer,
		planning: planningReducer,
		events: eventsReducer,
		overview: overviewReducer,
		taskTypes: taskTypesReducer,
		permissions: permissionsReducer,
		permissionTypes: permissionTypeReducer,
		permissionStatus: permissionStatusReducer,
		taskStatus: taskStatusReducer,
		supplierTypes: supplierTypesReducer,
		supplierStatus: supplierStatusReducer,
		supplierJobTitles: supplierJobTitlesReducer,
		companies: companiesReducer,
		budgetTypes: budgetTypesReducer,
		characters: charactersReducer,
		limitations: limitationsReducer,
		supplierUnitTypes: SupplierUnitTypesReducer,
		budgetStatus: budgetStatusReducer,
		sceneTime: sceneTimeReducer,
		scenePlace: scenePlaceReducer,
		sceneLocation: sceneLocationReducer,
		calendar: calenderReducer,
		emailApp: emailReducer,
		todoApp: todoReducer,
		chatApp: chatReducer,
		customizer: customizer,
		navbar: navbar,
		dataList: dataList
	});
