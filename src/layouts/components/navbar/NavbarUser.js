import React from "react"
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media
} from "reactstrap"
import axios from "axios"
import ReactCountryFlag from "react-country-flag"
import { IntlContext } from "../../../utility/context/Internationalization"
import { ContextLayout } from "../../../utility/context/Layout"
import { connect } from "react-redux"
import { changeDirection } from "../../../redux/actions/customizer/index"

import './index.scss'



class NavbarUser extends React.PureComponent {
  state = {
    navbarSearch: false,
    langDropdown: false,
    suggestions: []
  }

  componentDidMount() {
    axios.get("/api/main-search/data").then(({ data }) => {
      this.setState({ suggestions: data.searchResult })
    })
  }

  handleNavbarSearch = () => {
    this.setState({
      navbarSearch: !this.state.navbarSearch
    })
  }

  removeItem = id => {
    const cart = this.state.shoppingCart

    const updatedCart = cart.filter(i => i.id !== id)

    this.setState({
      shoppingCart: updatedCart
    })
  }

  handleLangDropdown = () =>
    this.setState({ langDropdown: !this.state.langDropdown })

   switchDir = (dir) => {
      if (dir === "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl")
      else document.getElementsByTagName("html")[0].setAttribute("dir", "ltr")
    }


  render() {
    return (
    <ContextLayout.Consumer>
        {Layoutcontext => {
          return (
        <IntlContext.Consumer>
          {context => {
            const langArr = {
              "heb" : "Hebrew",
              "en" : "English",
              "de" : "German",
              "fr" : "French",
              "pt" : "Portuguese"
            }
            return (
              <Dropdown
                tag="li"
                className="dropdown-language nav-item"
                isOpen={this.state.langDropdown}
                toggle={this.handleLangDropdown}
                data-tour="language"
              >
                <DropdownToggle
                  tag="a"
                  className="nav-link"
                >
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
                </DropdownToggle>
                <DropdownMenu className="absolutePosition">
                <DropdownItem
                    tag="a"
                    onClick={e => {context.switchLanguage("heb"); this.props.changeDirection("rtl"); Layoutcontext.switchDir('rtl')}}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="il" svg />
                    <span className="ml-1">Hebrew</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={e => {context.switchLanguage("en"); this.props.changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="us" svg />
                    <span className="ml-1">English</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={e => {context.switchLanguage("fr"); this.props.changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="fr" svg />
                    <span className="ml-1">French</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={e => {context.switchLanguage("de"); this.props.changeDirection("ltr"); Layoutcontext.switchDir('ltr')}}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="de" svg />
                    <span className="ml-1">German</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={e => {context.switchLanguage("pt"); this.props.changeDirection("ltr");  Layoutcontext.switchDir('ltr')}}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="pt" svg />
                    <span className="ml-1">Portuguese</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )
          }}
        </IntlContext.Consumer>
        )
        }}
      </ContextLayout.Consumer>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, {
  changeDirection
})(NavbarUser)


