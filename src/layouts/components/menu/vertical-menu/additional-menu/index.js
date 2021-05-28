import * as React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { Icon } from '@components';
import { useOutsideClick } from '@src/utilities';
import navigationConfig from "../../../../../configs/navigationConfig";
import './index.scss';
import classnames from "classnames"

const AdditionalMenu = ({ events }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const ref = React.useRef(null);
	useOutsideClick(ref, () => setIsOpen(false));

	const customizer = useSelector((state) => state.customizer);
	const direction = customizer.customizer.direction;

	const activeEventId = events.filter((event) => event.preview)[0] ? events.filter((event) => event.preview)[0].id : null;
	const additionalNavItems = navigationConfig(direction, activeEventId).filter(item => item.type === 'additionalMenu');

	const avatar_style = {width: "3rem", height:"3rem" , postion:'absolute',borderRadius: "50%", margin:"0 20px" }
	return (
		<div ref={ref} className="additional-menu" >
			{isOpen && (
				<div className="additional-menu__dropdown">
					<ul className="navigation-main">
						{additionalNavItems.map(item => (
							<li
								className={classnames("nav-item R")}>
								<Link
									to={item.navLink}
									onClick={() => setIsOpen(!isOpen)}
									className="additional-menu__item"
									data-tip = {item.tooltip}
								>
									<FormattedMessage id={item.title} />
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
			<div
				className="additional-menu__icon"
				onClick={()=> setIsOpen(!isOpen)}
			>
				<img src="../../../assets/img/Eliran.jpeg" style={avatar_style}></img>
			</div>
		</div>
	)
};

export default AdditionalMenu;
