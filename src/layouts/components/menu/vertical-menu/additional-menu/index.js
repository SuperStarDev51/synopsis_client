import * as React from 'react';
import { Link } from "react-router-dom";
import { connect, useSelector } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { Icon } from '@components';
import { useOutsideClick } from '@src/utilities';
import navigationConfig from "../../../../../configs/navigationConfig";
import './index.scss';
import classnames from "classnames"
import UserAvatar from '@src/components/user-profile/userAvatar';
import { ContextLayout } from "@src/utility/context/Layout"
import { IntlContext } from "@src/utility/context/Internationalization"
import {
	NavItem,
	NavLink,
	UncontrolledDropdown,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Media
  } from "reactstrap"
import { Routes } from '@src/utilities';
import ReactCountryFlag from "react-country-flag"
import { changeDirection } from "@src/redux/actions/customizer/index"
import { isAuth, logOut } from '@containers/user/initial-state';
import { useHistory } from "react-router-dom";

const AdditionalMenu = ({ events }) => {
	const history = useHistory();
	const [isOpen, setIsOpen] = React.useState(false);
	const [languageIsOpen, setLanguageIsOpen] = React.useState(false)
	
    const [langDropdown , setLangDropDown] = React.useState(false)

	const handleLangDropdown = () =>
		setLangDropDown(!langDropdown)

	const ref = React.useRef(null);
	useOutsideClick(ref, () => setIsOpen(false));

	const customizer = useSelector((state) => state.customizer);
	const direction = customizer.customizer.direction;

	const activeEventId = events.filter((event) => event.preview)[0] ? events.filter((event) => event.preview)[0].id : null;
	const additionalNavItems = navigationConfig(direction, activeEventId).filter(item => item.type === 'additionalMenu');

	const avatar_style = {width: "3rem", height:"3rem" , postion:'absolute',borderRadius: "50%", margin:"0 20px" }

	const loggedInWith=null
	const logoutWithJWT=()=>{}
	const logoutWithFirebase=()=>{}

	return (

		<div ref={ref} className="additional-menu" >
			{
				isOpen && (
					<div className="additional-menu__dropdown" onMouseEnter={()=> setIsOpen(true)} onMouseLeave={()=> setIsOpen(false)}>
					<div className="wraper"></div>
						<ul className="navigation-main arrow-right">
							{additionalNavItems.map(item => { 
								if (item.title === 'Profile')
									return (
										<li
											className={classnames("nav-item R")}>
											<Link
												to={'/profile'}
												onClick={() => setIsOpen(!isOpen)}
												className="additional-menu__item"
												data-tip = {item.tooltip}
											>

													{item.icon}

													<span >{item.title}</span>



											</Link>
										</li>
									)
								if (item.title === "Sign out")
									return (
										<li className={classnames("nav-item R")}>
											<Link
												to={'/pages/login'}
												onClick={e => {
													e.preventDefault()
													if (isAuth()) {
													  return logOut(()=>history.push(Routes.LOGIN))
													} else {
													  const provider = loggedInWith
													  if (provider !== null) {
														if (provider === "jwt") {
														  return logoutWithJWT()
														}
														if (provider === "firebase") {
														  return logoutWithFirebase()
														}
													  } else {
														history.push("/pages/login")
													  }
													}
										  
												  }}
												className="additional-menu__item"
												data-tip = {item.tooltip}
											>
													{item.icon}
													<span >{item.title}</span>
											</Link>
										</li>
									)
							}
							)}
						</ul>
					</div>
				)


			}

			{
				languageIsOpen && (
					<div className="additional-menu__dropdown" onMouseEnter={()=> setLanguageIsOpen(true)} >
						<div className="wraper"></div>
						<ul className="navigation-main arrow-right-language">
							
								
										<ContextLayout.Consumer>
										{Layoutcontext => {
										return (
										<IntlContext.Consumer>
										{context => {
											
											return (
											    <>
												<li
													className={classnames("nav-item R")}
													onClick={e => {context.switchLanguage("heb"); changeDirection("rtl"); Layoutcontext.switchDir('rtl')}}
												>
														<ReactCountryFlag className="country-flag" countryCode="il" svg />
														<span className="ml-1">Hebrew</span>
													
												</li>
												
												<li
													className={classnames("nav-item R")}
													tag="a"
													onClick={e => {context.switchLanguage("en"); changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
												>
													<ReactCountryFlag className="country-flag" countryCode="us" svg />
													<span className="ml-1">English</span>
												</li>
												<li
													className={classnames("nav-item R")}
													tag="a"
													onClick={e => {context.switchLanguage("fr"); changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
												>
													<ReactCountryFlag className="country-flag" countryCode="fr" svg />
													<span className="ml-1">French</span>
												</li>
												<li
													className={classnames("nav-item R")}
													tag="a"
													onClick={e => {context.switchLanguage("de"); changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
												>
													<ReactCountryFlag className="country-flag" countryCode="de" svg />
													<span className="ml-1">German</span>
												</li>
												<li
													className={classnames("nav-item R")}
													tag="a"
													onClick={e => {context.switchLanguage("pt"); changeDirection("ltr");  Layoutcontext.switchDir('ltr')}}
												>
													<ReactCountryFlag className="country-flag" countryCode="pt" svg />
													<span className="ml-1">Portuguese</span>
												</li>
												</>
											)
										}}
										</IntlContext.Consumer>
										)
										}}
									</ContextLayout.Consumer>

									

									
								
							
						</ul>
					</div>
				)
			}
			<div
				className="additional-menu__icon"
				style={{height:"3rem" , postion:'absolute', margin: '0 30px'}}
				onClick={()=> setLanguageIsOpen(!languageIsOpen)}
				// onMouseEnter={()=> setLanguageIsOpen(true)}
				// onMouseLeave={()=> setLanguageIsOpen(false)}

			>
				 <ContextLayout.Consumer>
						{Layoutcontext => {
						return (
						<IntlContext.Consumer>
						{context => {
							return (
							
								<ReactCountryFlag
									className="country-flag"
									countryCode={
									context.state.locale === "en"
										? "us" :
									context.state.locale === "heb" 
										? "il" :
									context.state.locale
									}
									svg
								/>
							)
						}}
						</IntlContext.Consumer>
						)
						}}
					</ContextLayout.Consumer>
				

			</div>


			<div
				className="additional-menu__icon"
				style={avatar_style}
				onClick={()=> setIsOpen(!isOpen)}
				onMouseEnter={()=> setIsOpen(true)}
				onMouseLeave={()=> setIsOpen(false)}

			>

				<UserAvatar/>

			</div>
		</div>
	)
};

export default AdditionalMenu;
