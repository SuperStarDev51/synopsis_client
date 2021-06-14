import * as React from 'react';
import { makeStyles, TextField, Grid, Button, Typography, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ImageSelector from './imageSelector';
import { compose } from 'redux';
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ReactFlagsSelect from 'react-flags-select';
import 'yup-phone';
import 'react-phone-input-2/lib/style.css';
import { UserActionTypes } from '../user/enums';
import { UserInterface } from '../user/interfaces';
import NoProfileUserImage from './assets/noProfileUserImage.png';
import { updateMyProfile } from './action';
import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-number-input';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import clsx from 'clsx';

// const mystyles = {
// 	position: 'absolute !important',
//  } as React.CSSProperties;

const styles = makeStyles(() => ({
	root: {
		width: '100%',
		padding: '1rem'
	},
	container: {
		width: '90%',
		height: '95%',
		padding: '20px 40px',
		backgroundColor: '#fff',
		display: 'flex'
	},
	form: {
		width: '100% !important',
		display: 'flex',
		justifyContent: 'center'
	},
	formLayout: {
		display: 'flex',
		width: '30% !important',
		flexDirection: 'column'
	},
	formTitle: {
		textAlign: 'center',
		color: 'rgba(0,0,0,0.6)',
		paddingTop: '20px'
	},
	textField: {
		marginTop: '20px'
	},
	phoneContainer:{
		paddingBottom: '5px',
	},
	phoneInput: {
		border: '0 !important',
		width: '100% !important',
		boxShadow: 'none !important'
	},
	countryInput: {
		padding: '5px',
		left: 0,
		zIndex: 99,
	},
	submitBtn: {
		marginTop: '20px !important',
		backgroundColor: '#0ff',
		padding: '10px'
	},
	svgIcon: {
		paddingRight: '5px'
	}
}));

function Alert (props: any) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface MyProfileFormProps {
	userInfo: UserInterface;
	onFormSubmit(data: UserInterface): void;
}

const MyProfileForm: React.FC<MyProfileFormProps> = (props: MyProfileFormProps) => {
	const classes = styles();
	const { userInfo, onFormSubmit } = props;
	const [selected, setSelected] = React.useState('');
	const [selectedCountry, setSelectedCountry] = React.useState('US');
	const [open, setOpen] = React.useState(false);
	const [phone, setPhone] = React.useState('');

	// Form Validation Schema
	const validationSchema = yup.object({
		fullName: yup
			.string()
			.min(2, 'Full should be of minimum 2 characters length')
			.required('Full Name is required'),
		// validate phone number strictly in the given region with custom error message
		phoneNumber: yup
			.string()
			.phone(`${selectedCountry}`, true, 'Phone Number is Invalid')
			.required(),

		email: yup
			.string()
			.email()
			.required('Email is required')
	});

	React.useEffect(() => {
		if (userInfo.photoURL === undefined || userInfo.photoURL === '') {
			setSelected(NoProfileUserImage);
		} else {
			setSelected(userInfo.photoURL);
		}
	}, [userInfo]);

	// Init Formik
	const formik = useFormik({
		initialValues: {
			fullName: '',
			phoneNumber: '+1',
			email: ''
		},
		validationSchema: validationSchema,
		onSubmit: values => {
			userInfo.fullName = values.fullName;
			userInfo.email = values.email;
			userInfo.phoneNumber = values.phoneNumber;
			userInfo.photoURL = selected;
			updateMyProfile(userInfo);
			onFormSubmit(userInfo);
			setTimeout(() => {
				setOpen(true);
			}, 1000);
		}
	});

	return (
		<Grid item container direction="column" md={12} justify="center" alignContent="center" className={classes.root}>
			<Grid item className={classes.container}>
				<form className={classes.form} onSubmit={formik.handleSubmit}>
					<div className={classes.formLayout}>
						<ImageSelector selected={selected} setSelected={setSelected} />
						<Typography variant="h4" className={classes.formTitle}>
							My Profile
						</Typography>
						<TextField
							required
							id="fullName"
							name="fullName"
							placeholder={userInfo.first_name}
							className={classes.textField}
							onChange={formik.handleChange}
							error={formik.touched.fullName && Boolean(formik.errors.fullName)}
							helperText={formik.touched.fullName && formik.errors.fullName}
							InputProps={{
								startAdornment: <AccountCircleIcon className={classes.svgIcon} />
							}}
							fullWidth
						/>

						<TextField
							required
							id="email"
							name="email"
							placeholder={userInfo.email}
							onChange={formik.handleChange}
							className={classes.textField}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
							InputProps={{
								startAdornment: <MailOutlineIcon className={classes.svgIcon} />
							}}
							fullWidth
						/>
						<ReactPhoneInput
							buttonClass={classes.countryInput}
							containerClass ={clsx( 'MuiInput-underline', classes.textField, classes.phoneContainer)}
							inputClass={clsx(classes.phoneInput)}
							inputStyle={{
								width: '100% !important'
							}}
							inputProps={{
								name: 'phone',
								required: true,
								autoFocus: true,

							}}
							country={'us'}
							value={phone}
							onChange={setPhone}
						/>

						<Button type="submit" className={classes.submitBtn}>
							Save
						</Button>
					</div>
				</form>
			</Grid>
			<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={6000}>
				<Alert severity="success">Profile Updated</Alert>
			</Snackbar>
		</Grid>
	);
};
const mapStateToProps = (state: { user: UserInterface }) => {
	return {
		userInfo: state.user
	};
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
	return {
		onFormSubmit: (userData: any) =>
			dispatch({
				type: UserActionTypes.SET_USER,
				payload: userData
			})
	};
};
export default compose(connect(mapStateToProps, mapDispatchToProps)(MyProfileForm));
