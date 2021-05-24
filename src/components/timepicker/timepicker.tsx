import * as React from 'react';

import './index.scss';

export class Timepicker extends React.Component {
	constructor(props) {
		super(props);

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.state = {
			hours: this.props.value ? this.props.value.split(':')[0] : '',
			minutes: this.props.value ? this.props.value.split(':')[1] : '',
			isHoursOpen: true,
			isMinutesOpen: false,
		};
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);

		setTimeout(() => {
			this.setState({hours: this.props.value ? this.props.value.split(':')[0] : ''});
			this.setState({minutes: this.props.value ? this.props.value.split(':')[1] : ''});
		})
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.props.onOutsideClick();
		}
	}

	render() {
		const buttonsNumbers = [7,8,9,4,5,6,1,2,3,0];
		const { isOpen, changeValue } = this.props;

		return isOpen ? (
			<div
				ref={this.setWrapperRef}
				className="wombat-timepicker box-shadow-6 bg-white width-300"
			>
				<div className="p-2">
				<div className="wombat-timepicker__inputs position-relative mb-1">
					<span style={{width: '4px', position: 'absolute', top: '.5rem', left: '50%', marginLeft: '-2px', fontSize: '1.6rem'}}>:</span>
					<div className="row">
						<div className="col-6">
							<input
								value={this.state.hours}
								className="form-control"
								placeholder="00"
								type="number"
								maxLength="2"
								onFocus={() => this.setState({isHoursOpen: true, isMinutesOpen: false})}
							/>
						</div>
						<div className="col-6">
							<input
								value={this.state.minutes}
								className="form-control"
								placeholder="00"
								type="number"
								maxLength="2"
								onFocus={() => {
									this.setState({isMinutesOpen: true, isHoursOpen: false})
								}}
							/>
						</div>
					</div>
				</div>
				{this.state.isHoursOpen || this.state.isMinutesOpen
					?
					<div className="wombat-timepicker__dropdown">
						<div className="row">
							{buttonsNumbers.map((number, index) => (
								<div key={number} className="col-4 p-02">
									<input
										type="button"
										className="btn btn-primary w-100"
										placeholder="00"
										value={number}
										onClick={() => {
											if (this.state.isHoursOpen) {
												if (this.state.hours.length < 2) {
													this.setState((prevState) => {
														return {hours: prevState.hours + number};
													});
												} else {
													this.setState({hours: ''});
													this.setState((prevState) => {
														return {hours: prevState.hours + number};
													});
												}
											}
											if (this.state.isMinutesOpen) {
												if (this.state.minutes.length < 2) {
													this.setState((state) => {
														return {minutes: state.minutes + number};
													});
												} else {
													this.setState({minutes: ''});
													this.setState((prevState) => {
														return {minutes: prevState.minutes + number};
													});
												}
											}
											setTimeout(() => changeValue(this.state.hours + ':' + this.state.minutes))
										}}
									/>
								</div>
							))}
							<div className="col-8 p-02">
								<input
									type="button"
									className="btn btn-secondary w-100"
									value="Clear"
									onClick={() => {
										if (this.state.isHoursOpen) {
											this.setState({hours: ''})
										}
										if (this.state.isMinutesOpen) {
											this.setState({minutes: ''})
										}
									}}
								/>
							</div>
						</div>
					</div>
					: null
				}
			</div>
		</div>
		) : null;
	}
}

export default Timepicker;
