import * as React from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { UncontrolledPopover, PopoverBody, PopoverHeader, Button } from 'reactstrap';
import './index.scss';

export const Map = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ width: '300px', height: `300px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)(({ isMarkerShown, getCoordinates }) =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: 30.994003570859423, lng: 34.770025774659636 }}
		onClick={(e) => {
			let coordinates = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			};

			getCoordinates(coordinates);
		}}
	>
		{isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
	</GoogleMap>
);

export const LocationMapPopover: React.FunctionComponent = ({
	target,
	isOpen,
	onChange,
	onClose,
	onBlur,
}) => {
	return (
		<UncontrolledPopover
			target={target}
			placement="bottom-end"
			isOpen={isOpen}
			trigger="click"
			className="locations-map-popover"
		>
			<PopoverHeader className="locations-map-popover__header">
				<div>Item info</div>
				<Button
					close
					onClick={e => {
						e.stopPropagation();
						onClose();
					}}
				/>
			</PopoverHeader>
			<PopoverBody>
				<Map getCoordinates={coordinates => onChange(coordinates)}/>
			</PopoverBody>
		</UncontrolledPopover>
	)
};

export default LocationMapPopover;
