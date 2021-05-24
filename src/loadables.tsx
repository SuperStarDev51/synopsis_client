import * as React from 'react';
import * as Loadable from 'react-loadable';

import Spinner from "@vuexy/spinner/Loading-spinner"


export const Actors: any = Loadable({
	loader: () => import('@containers/actors').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const ShootingDays: any = Loadable({
	loader: () => import('@containers/shooting_days').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Tasks: any = Loadable({
	loader: () => import('@containers/tasks').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Budget: any = Loadable({
	loader: () => import('@containers/budget').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Suppliers: any = Loadable({
	loader: () => import('@containers/suppliers').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Script: any = Loadable({
	loader: () => import('@containers/scripts').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Breakdown: any = Loadable({
	loader: () => import('@containers/breakdown').then((comp: any) => comp),
	loading: () => <Spinner />
});


export const Files: any = Loadable({
	loader: () => import('@containers/files').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Planning: any = Loadable({
	loader: () => import('@containers/planning').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Projects: any = Loadable({
	loader: () => import('@containers/projects').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Overview: any = Loadable({
	loader: () => import('@containers/overview').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Permissions: any = Loadable({
	loader: () => import('@containers/permissions').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const NotFound: any = Loadable({
	loader: () => import('@containers/not-found').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Login: any = Loadable({
	loader: () => import('@containers/login').then((comp: any) => comp),
	loading: () => <Spinner />
});

export const Register: any = Loadable({
	loader: () => import('@containers/register').then((comp: any) => comp),
	loading: () => <Spinner />
});
