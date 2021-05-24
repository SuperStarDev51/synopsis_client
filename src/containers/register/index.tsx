import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { UserActionTypes } from '@containers/user/enums';
import {Routes} from "@root/src/utilities";
import { RegisterUser, sendInvitation } from './initial-state'
import { Link, useHistory } from 'react-router-dom';
import { UserInterface } from '../tasks/interfaces';


export const Register: React.FunctionComponent = () => {
	// eslint-disable-next-line
	const dispatch = useDispatch();

	const permissionStatus = useSelector((state: RootStore) => state.permissionStatus);
	const supplierJobTitles = useSelector((state: RootStore) => state.supplierJobTitles);
	const companies = useSelector((state: RootStore) => state.companies);

	const [submitted, setSubmitted] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [firstName, setFirstName] = React.useState<string>('');
	const [lastName, setLastName] = React.useState<string>('');
	const [jobTitleId, setJobTitleId] = React.useState<string>('');

	const [loader, SetLoader] = React.useState<boolean>(false);
	const history = useHistory();

	const setUser = (user: UserInterface) => {
		dispatch({
			type: UserActionTypes.SET_USER,
			payload: user
		});
	};

	const pathname = window.location.pathname.split('/');
	const getPathnameString = index => pathname && pathname[index] && pathname[index];

	const companyId = getPathnameString(2);
	const companyName = companies.find(company => company.id == companyId)?.company_name;
	const userEmail = getPathnameString(3);
	const code = getPathnameString(4);
	const adminUserId = getPathnameString(5); // admin_user_id

	React.useEffect(()=>{
		if (userEmail) setUsername(userEmail)
	},[userEmail]);

	const formIsValid = () => !!(username && password && firstName && lastName);

	const user = useSelector((state: RootStore) => state.user);

	return (
		<div className="col-md-6 align-self-center bg-white px-3" style={{borderRadius: '5px'}}>
			<h2 className="mt-3">Register</h2>
			<div>
				<div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
					<label htmlFor="username">Username</label>
					<input
						readOnly={userEmail}
						value={username}
						type="email"
						className="form-control"
						name="username"
						onChange={(e)=>setUsername(e.target.value)}
					/>
					{submitted && !username &&
					<div className="help-block">Email is required</div>
					}
				</div>
				<div className="form-group">
					<label htmlFor="companyName">Company name</label>
					<input
						readOnly
						type="text"
						className="form-control"
						name="companyId"
						value={companyName ? companyName : ''}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="companyName">Code</label>
					<input
						readOnly
						type="number"
						className="form-control"
						name="code"
						value={code ? code : ''}
					/>
				</div>
				<div className={'form-group' + (submitted && !firstName ? ' has-error' : '')}>
					<label htmlFor="firstName">First name</label>
					<input type="text" className="form-control" name="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
					{submitted && !firstName &&
					<div className="help-block">First name is required</div>
					}
				</div>
				<div className={'form-group' + (submitted && !lastName ? ' has-error' : '')}>
					<label htmlFor="lastName">Last name</label>
					<input type="text" className="form-control" name="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
					{submitted && !lastName &&
					<div className="help-block">Last name is required</div>
					}
				</div>
				<div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
					<label htmlFor="password">Password</label>
					<input type="password" className="form-control" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
					{submitted && !password &&
					<div className="help-block">Password is required</div>
					}
				</div>
				<div className="form-group">
					<label htmlFor="password">Your Job</label>
					<select
						className="form-control"
						value={jobTitleId}
						onChange={(e)=>setJobTitleId(e.target.value)}
					>
						<option value="Select your job">Select your job</option>
						{supplierJobTitles && supplierJobTitles.map(jobTitle => (
							<option
								key={jobTitle.id}
								value={jobTitle.id}
							>
								{jobTitle.supplier_job_title}
							</option>
						))}
					</select>
				</div>
				<div className="form-group text-center">
					<button
						className="btn btn-primary"
						onClick={ async () => {
							setSubmitted(true);

							if ( formIsValid() ) {
								let User:any = await RegisterUser({
									first_name: firstName,
									last_name: lastName,
									email: username,
									password: password,
									company_id: companyId,
									company_name: companyName,
									country_id: null,
									permission_status_id: 1,
									permission_type_id: 3,
									supplier_job_title_id: jobTitleId,
									code: code,
									admin_user_id: adminUserId
								});

								if( User ) setUser(User); history.push('/');
							}
						}}
					>
						Register
					</button>
					{loader &&
					<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
					}
					<div className="d-inline-block mx-2">or</div>
					<Link
						to={Routes.LOGIN}
						className=""
						style={{display: 'inline-block', margin: '3vh 0'}}
					>
						Login
					</Link>
				</div>
			</div>
		</div>
	)
};

export default Register;
