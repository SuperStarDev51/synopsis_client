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
	
	const { character_id , castname, castID, open, setOpen } = props;
	const classes = useStyles();

	const validationSchema = yup.object({
		Name: yup.string().min(2, 'Full should be of minimum 2 characters length'),
		ID: yup.string().min(2, 'Full should be of minimum 2 characters length')
	});

	// Init Formik
	const formik = useFormik({
		initialValues: {
			Name: castname,
			ID: castID
		},
		validationSchema: validationSchema,
		onSubmit: values => {
			setOpen(false)
			console.log(values);
		}
	});
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
						id="Name"
						name="Name"
						value={castname}
						onChange={formik.handleChange}
						error={formik.touched.Name && Boolean(formik.errors.Name)}
						helperText={formik.touched.Name && formik.errors.Name}
						className={classes.textField}
						required
						fullWidth
					/>
					<TextField
						id="ID"
						name="ID"
						value={castID}
						onChange={formik.handleChange}
						error={formik.touched.ID && Boolean(formik.errors.ID)}
						helperText={formik.touched.ID && formik.errors.ID}
						className={classes.textField}
						required
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
