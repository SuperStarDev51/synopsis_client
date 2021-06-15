import * as React from 'react';
import { makeStyles, ButtonBase } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop';
import getCroppedImg from './action/imgCrop';

const useStyles = makeStyles(() => ({
	root: {
		height: '180px',
		width: '100%',
		display: 'flex',
		justifyContent: 'center'
	},
	avatar: {
		backgroundColor: '#000',
		height: '200px',
		width: '200px',
		borderRadius: '50%',
		border: '1px solid #000',
		overflow: 'hidden',
		position: 'relative'
	},
	model: {
		minHeight: '400px',
		width: '800px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	croper: {
		height: '300px !important',
		width: '300px !important',
		position: 'relative'
	},
	inputBtn: {
		position: 'absolute',
		bottom: '0',
		width: '100%',
		background: 'rgba(0,0,0,0.2)',
		height: '60px',
		color: 'white'
	},
	imgContainer: {
		position: 'relative',
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '200px',
		width: '200px',
		borderRadius: '50%'
	},
	img: {
		maxWidth: '100%',
		maxHeight: '100%'
	}
}));

interface ImageSelectorProps {
	selected: string;
	setSelected(data: any): void;
}

const ImageSelector: React.FC<ImageSelectorProps> = (props: ImageSelectorProps) => {
	const classes = useStyles();
	const { selected, setSelected } = props;
	const [open, setOpen] = React.useState(false);
	const [crop, setCrop] = React.useState({
		x: 0,
		y: 0
	});
	const [cropArea, setCropArea] = React.useState({
		x: 0,
		y: 0,
		width: '200px',
		height: '200px'
	});
	const [zoom, setZoom] = React.useState(1);
	const aspectRation = 1;
	const onCropChange = (cropValue: React.SetStateAction<{ x: number; y: number }>) => {
		setCrop(cropValue);
	};

	const onZoomChange = (zoomValue: any) => {
		setZoom(zoomValue);
	};

	const openToSelectImage = () => {
		const inputButton = document.getElementById('selectedFile');
		if (inputButton != null) {
			inputButton.click();
		}
	};

	const handleClickOpen = (data: any) => {
		setOpen(true);
		setSelected(data);
	};
	const fileReader = new FileReader();
	const selectImage = (e: React.ChangeEvent<HTMLInputElement>) => {

		if (e.target.files != null) {
			fileReader.readAsDataURL(e.target.files[0]);
			fileReader.addEventListener('load', function () {
				handleClickOpen(this.result);
			});
		}
	};

	const showCroppedImage = React.useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(selected, cropArea);
			setSelected(croppedImage);
		} catch (e) {
			console.error(e);
		}
	}, [cropArea]);

	const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
		setCropArea(croppedAreaPixels);
	};
	const handleClose = () => {
		showCroppedImage();
		setOpen(false)
	};

	return (
		<div className={classes.root}>
			<div className={classes.avatar}>
				<div className={classes.imgContainer}>
					<img src={`${selected}`} alt="Cropped" id="croppedImageHere" className={classes.img} />

					<input type="file" id="selectedFile" style={{ display: 'none' }} onChange={e => selectImage(e)} />
					<ButtonBase className={classes.inputBtn} onClick={openToSelectImage}>
						Upload Image
					</ButtonBase>
				</div>
			</div>
			<Dialog maxWidth={'md'} open={open} onClose={handleClose}>
				<DialogTitle>Crop Image</DialogTitle>
				<DialogContent className={classes.model}>
					<div className={classes.croper}>
						<Cropper
							image={selected}
							crop={crop}
							zoom={zoom}
							aspect={aspectRation}
							cropShape="round"
							showGrid={false}
							onCropChange={onCropChange}
							onCropComplete={onCropComplete}
							onZoomChange={onZoomChange}
						/>
					</div>

					<Slider
						value={zoom}
						min={1}
						max={3}
						step={0.1}
						aria-labelledby="Zoom"
						onChange={(e, zoom) => onZoomChange(zoom)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" fullWidth>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
export default ImageSelector;
