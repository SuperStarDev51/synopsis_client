import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { History, createBrowserHistory } from 'history';
import createSagaMiddleware, { Saga, SagaMiddleware } from 'redux-saga';
import { Store, Middleware, createStore, applyMiddleware, compose } from 'redux';

import sagas from './sagas';
import rootReducer from './reducers';

import { SupplierGroup } from '@containers/suppliers/interfaces';
import { suppliersInitialState } from '@containers/suppliers/initial-state';
import { userInitialState } from '@containers/user/initial-state';
import { IncomeGroup, ExpenseGroup } from '@containers/budget/interfaces';
import { incomeInitialState, expensesInitialState } from '@containers/budget/initial-state';
import { UserInterface } from '@containers/tasks/interfaces';
import { Script } from '@containers/scripts/interfaces';

import { usersInitialState } from '@containers/tasks/initial-state';
import { Event, PlanningState } from '@containers/planning/interfaces';
import { planningInitialState, eventsInitialState } from '@containers/planning/initial-state';
import { overviewInitialState } from '@containers/overview/initial-state';

import { navbarInitialState } from "./redux/reducers/navbar/initial-state"

import thunk from "redux-thunk"
import createDebounce from "redux-debounced"
import { scriptsInitialState } from './containers/scripts/initial-state';
import { ShootingDay } from './containers/shooting_days/interfaces';
import { shootingDaysInitialState } from './containers/shooting_days/initial-state';


export const history: History = createBrowserHistory();
export const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

export interface RootStore {
	readonly user: UserInterface;
	readonly scripts: Script[];
	readonly shootingDays: ShootingDay[];
	readonly expenses: ExpenseGroup[];
	readonly income: IncomeGroup[];
	readonly suppliers: SupplierGroup[];
	readonly users: UserInterface[];
	readonly planning: PlanningState;
	readonly events: Event[];
	readonly overview: any[];
	readonly taskTypes: any[];
	readonly taskStatus: any[];
	readonly supplierTypes: any[];
	readonly supplierStatus: any[];
	readonly supplierJobTitles: any[];
	readonly budgetTypes: any[];
	readonly characters: any[];
	readonly supplierUnitTypes: any[];
	readonly budgetStatus: any[];
	readonly sceneTime: any[];
	readonly scenePlace: any[];
	readonly sceneLocation: any[];
	readonly calendar: any;
	readonly emailApp: any;
	readonly todoApp: any;
	readonly chatApp: any;
	readonly customizer: any;
	readonly navbar: any;
	readonly dataList: any;
}

export function configureStore(): Store<RootStore> {
	const historyMiddleware: Middleware = routerMiddleware(history);
	const middleware = [
		// sagaMiddleware,
		historyMiddleware,
		createDebounce(),
		thunk,
	];
	
	const store: Store<RootStore> = createStore(
		rootReducer(history),
		{
			user: userInitialState,
			scripts: scriptsInitialState,
			shootingDays: shootingDaysInitialState,
			income: incomeInitialState,
			expenses: expensesInitialState,
			suppliers: suppliersInitialState,
			users: usersInitialState,
			planning: planningInitialState,
			events: eventsInitialState,
			overview: overviewInitialState,
			taskTypes: [],
			taskStatus: [],
			supplierTypes: [],
			supplierStatus: [],
			supplierJobTitles: [],
			budgetTypes: [],
			characters: [],
			supplierUnitTypes: [],
			budgetStatus: [],
			sceneTime: [],
			scenePlace: [],
			sceneLocation: [],
			calendar: {},
			emailApp: {},
			todoApp: {},
			chatApp:{},
			customizer:{},
			navbar: navbarInitialState,
			dataList: {},
		},
		// composeWithDevTools(applyMiddleware(...middlewares,sagaMiddleware, historyMiddleware))
		// composeWithDevTools(
		// 	applyMiddleware(...middleware),
		// 	// other store enhancers if any
		//   )
		composeWithDevTools(applyMiddleware(thunk,createDebounce(),historyMiddleware))
	);

	if (module.hot) {
		module.hot.accept();

		store.replaceReducer(require('./reducers').default(history));
	}

	sagas.forEach((saga: Saga) => {
		sagaMiddleware.run(saga);
	});

	return store;
}
