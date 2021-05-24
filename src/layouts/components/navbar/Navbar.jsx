import React from "react"
import { Navbar } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
// import {
//   logoutWithJWT,
//   logoutWithFirebase
// } from "../../../redux/actions/auth/loginActions"
import NavbarBookmarks from "./NavbarBookmarks"
import NavbarUser from "./NavbarUser"
import userImg from "assets/img/portrait/small/avatar-s-11.jpg"
import './index.scss'
import { NavbarProjectDetails } from '@components'
const UserName = props => {
  let username = props.user.first_name +' '+ props.user.last_name
  return username
}
const ThemeNavbar = props => {
  const { user, activeEvent } = props
  const colorsArr = [ "primary", "danger", "success", "info", "warning", "dark"]
  const navbarTypes = ["floating" , "static" , "sticky" , "hidden"]  
  const md = isWidthUp('md', props.width)

  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
             activeEvent && ( (props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal) ),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            "scrolling": props.horizontal && props.scrolling

          }
        )}
      >
        <div className="navbar-wrapper">
          <div className={classnames("bg-light-gray navbar-container content pr-3",{
            "pt-1":md
          })}>
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
             
                  <div className="bookmark-wrapper">
                  {activeEvent && (
                    <NavbarBookmarks
                      sidebarVisibility={props.sidebarVisibility}
                      handleAppOverlay={props.handleAppOverlay}
                    />
                    )}
                  </div>
                
                  {activeEvent && md &&  (  <div className="h2 ml-5 mr-3 max-width-220 text-bold height-4-rem line-height-4-rem overflow-hidden">{activeEvent.project_name}</div> )}
                  {activeEvent && md &&  ( <NavbarProjectDetails /> )}

              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={<UserName userdata={user} {...props} />}
                userImg={userImg}
                loggedInWith={null}
                logoutWithJWT={()=>{}}
                logoutWithFirebase={()=>{}}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user,
    activeEvent: state.events.filter((event) => event.preview)[0]
  }
}

export default withWidth()(connect(mapStateToProps, { })(ThemeNavbar))
