import * as React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { Icon } from '@components';
import { useOutsideClick } from '@src/utilities';
import navigationConfig from "../../../../../configs/navigationConfig";
import './index.scss';


const AdditionalMenu = ({ events }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const ref = React.useRef(null);
	useOutsideClick(ref, () => setIsOpen(false));

	const customizer = useSelector((state) => state.customizer);
	const direction = customizer.customizer.direction;

	const activeEventId = events.filter((event) => event.preview)[0] ? events.filter((event) => event.preview)[0].id : null;
	const additionalNavItems = navigationConfig(direction, activeEventId).filter(item => item.type === 'additionalMenu');

	return (
		<div ref={ref} className="additional-menu">
			{isOpen && (
				<div className="additional-menu__dropdown">
					{additionalNavItems.map(item => (
						<Link
							to={item.navLink}
							onClick={() => setIsOpen(!isOpen)}
							className="additional-menu__item"
						>
							<FormattedMessage id={item.title} />
						</Link>
					))}
				</div>
			)}
			<div
				className="additional-menu__icon"
				onClick={()=> setIsOpen(!isOpen)}
			>
				<Icon
					src={"../../../assets/icons/navbar/menu.svg"}
					style={{margin: '1.5rem auto 0.5rem',height: '3rem', width:'3rem'}}
				/>
			</div>
		</div>
	)
};

export default AdditionalMenu;
