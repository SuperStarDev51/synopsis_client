import * as React from "react"
import { Store } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { install, applyUpdate } from 'offline-plugin/runtime';
import { IntlProviderWrapper } from "./utility/context/Internationalization"
import { App } from './app';
import { RootStore, configureStore, history } from './store';
// import { vuexyStore } from "./redux/storeConfig/store"
import { Layout } from "./utility/context/Layout"
// import * as serviceWorker from "./serviceWorker"

import './@fake-db'
import "./index.scss"
import "prismjs/themes/prism-tomorrow.css"
import "@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"

export const store: Store<RootStore> = configureStore();

const node: HTMLElement | null = document.getElementById('app') || document.createElement('div');
const renderRoot = (app: JSX.Element): void => render(app, node);
const router = (Application: any): JSX.Element => (
		<Provider store={store}>
		<ConnectedRouter history={history}>
			<Layout>
				<IntlProviderWrapper>
						<Application />
				</IntlProviderWrapper>
		 	</Layout>
		</ConnectedRouter>
	</Provider>

);

renderRoot(router(App));

if (module.hot) {
	module.hot.accept();

	renderRoot(router(require('./app').App));
}

if (process.env.NODE_ENV === 'production') {
	install({
		onUpdateReady: () => applyUpdate(),
		onUpdated: () => window.location.reload()
	});
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
