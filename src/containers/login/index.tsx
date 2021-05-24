import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import {Routes} from "@root/src/utilities";
import { UserActionTypes } from '@containers/user/enums';
import { LoginUser } from './initial-state'
import { Link, useHistory } from 'react-router-dom';
import { UserInterface } from '../tasks/interfaces';

export const Login: React.FunctionComponent = () => {
	// eslint-disable-next-line
	const dispatch = useDispatch();

	const [submitted, setSubmitted] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');

	const [loader, SetLoader] = React.useState<boolean>(false);
	const history = useHistory();

	const setUser = (user: UserInterface) => {
		dispatch({
			type: UserActionTypes.SET_USER,
			payload: user
		});
	}

	return (
		<div className="col-md-6 align-self-center bg-white px-3" style={{borderRadius: '5px'}}>
			<h2 className="mt-3">Login</h2>
			<div>
				<div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
					<label htmlFor="username">Username</label>
					<input type="text" className="form-control" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
					{submitted && !username &&
					<div className="help-block">Username is required</div>
					}
				</div>
				<div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
					<label htmlFor="password">Password</label>
					<input type="password" className="form-control" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
					{submitted && !password &&
					<div className="help-block">Password is required</div>
					}
				</div>
				<div className="form-group text-center">
					<button
						className="btn btn-primary"
						onClick={ async () => {
							let User:any = await LoginUser(username, password)
							if( User ) setUser(User); history.push('/');
						}}
					>
						Login
					</button>
					{loader &&
					<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
					}
					<div className="d-inline-block mx-2">or</div>
					<Link
						to={Routes.REGISTER}
						className=""
						style={{display: 'inline-block', margin: '3vh 0'}}
					>
						Register
					</Link>
				</div>
			</div>
		</div>
	)
};

export default Login;
