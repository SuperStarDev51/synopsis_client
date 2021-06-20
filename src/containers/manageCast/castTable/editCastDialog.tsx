import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField } from '@material-ui/core';
import { addCharacter , getAllProjectCharacters } from "@root/src/containers/scripts/initial-state";
import { useSelector, useDispatch } from 'react-redux';
const useStyles = makeStyles(() => ({
	content: {
		display: 'flex',
		flexDirection: 'column',
		width: 600,
		placeContent: 'center',
		fontSize: '8rem',
		placeItems: 'center',
		color: 'rgba(0,0,0,0.4)',
		paddingBlock: '60px'
	},
	form: {
		width: '100% !important',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		paddingBlock: '20px',
	},
	textField: {
		marginTop: '20px'
	},
	saveButton: {
		width: '100%',
		backgroundColor: '#ccdffc',
		marginTop: '40px !important',
		padding: '20px'
	},
	closeButton: {
		position: 'absolute'
	}
}));

interface EditCastDialogProps {
	character_id: number,
	castname: string;
	castID: number;
	open: boolean;
	setOpen(data: boolean): void;
}
const EditCastDialog: React.FC<EditCastDialogProps> = (props: EditCastDialogProps) => {
	
	let { character_id , castname, castID, open, setOpen } = props;
	const classes = useStyles();

	const validationSchema = yup.object({
		Name: yup.string().min(2, 'Full should be of minimum 2 characters length'),
		ID: yup.string().min(1, 'Full should be of minimum 2 characters length')
	});

	// Init Formik
	const formik = useFormik({
		initialValues: {
			Character_name: castname,
			Character_id : character_id, 
			Associated_num : castID
		},
		validationSchema: validationSchema,
		onSubmit: values => {
			handleFormSubmit(values)
			setOpen(false)
			console.log(values);

		}
	});

	const handleFormSubmit = (values: any) => {
		const dispatch = useDispatch();
		let character = {
			character_id	:  values.Character_id, 
			character_name	:  values.Character_name, 
			associated_num	:  values.Associated_num ,
		}
		const state = useSelector((state: RootStore) => state)
		const events = state.events
		const activeEvent = events.filter()[0];
		addCharacter(character)
		getAllProjectCharacters(activeEvent.id)
			.then(characters =>{
				dispatch({
					type: CharactersActionTypes.SET_CHARACTERS,
					payload: characters
				});
			})
		
		
}
	return (
		<Dialog onClose={() => setOpen(false)} open={open}>
			<IconButton className={classes.closeButton} onClick={() => setOpen(false)}>
				<CloseIcon />
			</IconButton>
			<MuiDialogContent className={classes.content}>
				<FaceIcon fontSize={'inherit'} style={{ color: 'rgba(0,0,0,0.4)' }} />
				<Typography variant="h4">Rename Cast Member</Typography>
				<form onSubmit={formik.handleSubmit} className={classes.form}>
					<TextField
						id="Character_name"
						name="Character_name"
						defaultValue={castname}
						onChange={formik.handleChange}
						error={formik.touched.Name && Boolean(formik.errors.Name)}
						helperText={formik.touched.Name && formik.errors.Name}
						className={classes.textField}
						required
						fullWidth
					/>
					<TextField
						id="Associated_num"
						name="Associated_num"
						defaultValue={castID}
						onChange={formik.handleChange}
						error={formik.touched.ID && Boolean(formik.errors.ID)}
						helperText={formik.touched.ID && formik.errors.ID}
						className={classes.textField}
						required
						fullWidth
					/>
					<TextField
						id="Character_id"
						name="Character_id"
						value={character_id}
						onChange={formik.handleChange}
						error={formik.touched.ID && Boolean(formik.errors.ID)}
						helperText={formik.touched.ID && formik.errors.ID}
						className={"hidden"}
						fullWidth
					/>
					<Button type='submit' className={classes.saveButton} >
						Save & Close
					</Button>
				</form>
			</MuiDialogContent>
		</Dialog>
	);
};

export default EditCastDialog;
