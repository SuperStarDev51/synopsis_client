import React, { Component } from "react"
import classnames from "classnames"
import { Icon } from '@components';
import { ContextLayout } from "../../../../utility/context/Layout"
import { connect } from "react-redux"
import SidebarHeader from "./SidebarHeader"
import Hammer from "react-hammerjs"
import SideMenuContent from "./sidemenu/SideMenuContent"
import AdditionalMenu from "./additional-menu";
import PerfectScrollbar from "react-perfect-scrollbar"
import NavbarUser from "../../navbar/NavbarUser"

class Sidebar extends Component {
  static getDerivedStateFromProps(props, state) {
    // let EventID = Number(window.location.pathname.split('/')[1])
    const activeEventId = props.events.filter((event) => event.preview)[0] ? props.events.filter((event) => event.preview)[0].id : null
    // if (activeEventId && (props.activePath.replace(':id', String(activeEventId)) !== state.activeItem.replace(':id', String(activeEventId)) )) {
      return {
        activeItem: props.activePath.replace(':id', String(activeEventId))
      }
    // }
    // Return null if the state hasn't changed
    // return null
  }
  state = {
    width: window.innerWidth,
    activeIndex: null,
    hoveredMenuItem: null,
    activeItem: this.props.activePath,
    menuShadow: false,
    ScrollbarTag: PerfectScrollbar
  }

  mounted = false

  updateWidth = () => {
    if (this.mounted) {
      this.setState(prevState => ({
        width: window.innerWidth
      }))
      this.checkDevice()
    }
  }

  componentDidMount() {
    this.mounted = true
    if (this.mounted) {
      if (window !== "undefined") {
        window.addEventListener("resize", this.updateWidth, false)
      }
      this.checkDevice()
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  checkDevice = () => {
    const prefixes = " -webkit- -moz- -o- -ms- ".split(" ")
    const mq = function(query) {
      return window.matchMedia(query).matches
    }

    if ("ontouchstart" in window || window.DocumentTouch) {
      this.setState({
        ScrollbarTag: "div"
      })
    } else {
      this.setState({
        ScrollbarTag: PerfectScrollbar
      })
    }
    const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("")
    return mq(query)
  }

  changeActiveIndex = id => {
    if (id !== this.state.activeIndex) {
      this.setState({
        activeIndex: id
      })
    } else {
      this.setState({
        activeIndex: null
      })
    }
  }

  handleSidebarMouseEnter = id => {
    if (id !== this.state.hoveredMenuItem) {
      this.setState({
        hoveredMenuItem: id
      })
    } else {
      this.setState({
        hoveredMenuItem: null
      })
    }
  }

  handleActiveItem = url => {
    this.setState({
      activeItem: url
    })
  }

  render() {
    const {
      visibilityState,
      toggleSidebarMenu,
      sidebarHover,
      toggle,
      color,
      sidebarVisibility,
      activeTheme,
      collapsed,
      activePath,
      sidebarState,
      currentLang,
      permission,
      currentUser,
      collapsedMenuPaths,
	  changeCurrentLang,
    } = this.props

    const {
      menuShadow,
      activeIndex,
      hoveredMenuItem,
      activeItem,
      ScrollbarTag
    } = this.state
    const scrollShadow = (container, dir) => {
      if (container && dir === "up" && container.scrollTop >= 100) {
        this.setState({ menuShadow: true })
      } else if (container && dir === "down" && container.scrollTop < 100) {
        this.setState({ menuShadow: false })
      } else {
        return
      }
    }

    const iconStyle = {height: '4rem', width:'5rem'}
    const logo_li_style = {backgroundColor: '#ffffff', padding:'2px 5px' }
    return (
      <ContextLayout.Consumer>
        {context => {
          const dir = context.state.direction
          return (
            <React.Fragment>
              <Hammer
                onSwipe={e => {
                  sidebarVisibility()
                }}
                direction={
                  dir === "rtl" ? "DIRECTION_LEFT" : "DIRECTION_RIGHT"
                }>
                <div className="menu-swipe-area d-xl-none d-block vh-100"></div>
              </Hammer>

              <div
				style= {{overflow:'visible !important'}}
                className={classnames(
                  `main-menu menu-fixed notHidden menu-light menu-accordion menu-shadow theme-${activeTheme}`,
                  {
                    collapsed: sidebarState === true,
                    "hide-sidebar":
                      this.state.width < 1200 && visibilityState === false
                  }
                )}
                // onMouseEnter={() => sidebarHover(false)}
                // onMouseLeave={() => sidebarHover(true)}
                >
                {/* <SidebarHeader
                  toggleSidebarMenu={toggleSidebarMenu}
                  toggle={toggle}
                  sidebarBgColor={color}
                  sidebarVisibility={sidebarVisibility}
                  activeTheme={activeTheme}
                  collapsed={collapsed}
                  menuShadow={menuShadow}
                  activePath={activePath}
                  sidebarState={sidebarState}
                /> */}
                <ScrollbarTag
                  className={classnames("main-menu-content", {
                    "overflow-hidden": ScrollbarTag !== "div",
                    "overflow-scroll": ScrollbarTag === "div"
                  })}
                  {...(ScrollbarTag !== "div" && {
                    options: { wheelPropagation: false },
                    onScrollDown: container => scrollShadow(container, "down"),
                    onScrollUp: container => scrollShadow(container, "up"),
                    onYReachStart: () =>
                      menuShadow === true &&
                      this.setState({ menuShadow: false })
                  })}>
                  <Hammer
                    onSwipe={() => {
                      sidebarVisibility()
                    }}
                    direction={
                      dir === "rtl" ? "DIRECTION_RIGHT" : "DIRECTION_LEFT"
                    }>
                    <ul className="navigation navigation-main ">
                      <li className={classnames("R")} style = {logo_li_style}>
                        <Icon src="../../../assets/icons/navbar/synopsis_logo.svg"  style={iconStyle}/>
                      </li>
                      <SideMenuContent
                        setActiveIndex={this.changeActiveIndex}
                        activeIndex={activeIndex}
                        hoverIndex={hoveredMenuItem}
                        handleSidebarMouseEnter={this.handleSidebarMouseEnter}
                        activeItemState={activeItem}
                        handleActiveItem={this.handleActiveItem}
                        activePath={activePath}
                        lang={currentLang}
                        permission={permission}
                        currentUser={currentUser}
                        collapsedMenuPaths={collapsedMenuPaths}
                        toggleMenu={sidebarVisibility}
                        deviceWidth={this.props.deviceWidth}
                      />
                    </ul>
                  </Hammer>

                </ScrollbarTag>
						<div style={{ zIndex: 99999, display:'flex', justifyContent:'center', alignItems:'center', marginBottom: '30px'}}>
						<NavbarUser
						changeCurrentLang={changeCurrentLang}
						currentLang={currentLang}
						/>
						</div>
				        <AdditionalMenu events={this.props.events} />
			          </div>
            </React.Fragment>
          )
        }}
      </ContextLayout.Consumer>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user,
    events: state.events
  }
}

export default connect(mapStateToProps)(Sidebar)
