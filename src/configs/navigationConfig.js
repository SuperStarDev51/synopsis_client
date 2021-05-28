import React from "react"
// import * as IconFeatherFeather from "react-feather"
import { Icon } from '@components';
import { Routes } from '@utilities';
import { Roles } from './roles';

const navigationConfig = (dir, id) => {
  let iconStyle = {height: '1.8rem', width:'2.1rem', padingTop:'2px'};
  let iconsPath = '../../../assets/icons/navbar/'
  return [
    
  {
    id: "projects",
    title: "Projects",
    type: "item",
    icon: <Icon src={iconsPath+"Projects.svg"}  style={iconStyle}   />,//dir == 'ltr' ? <IconFeatherFeather.ArrowLeft size={35} /> : <IconFeatherFeather.ArrowRight size={35} />,
    navLink: Routes.PROJECTS,
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },
  {
    id: "script",
    title: "Script",
    type: "item",
    icon: <Icon src={iconsPath+"Script.svg"}  style={iconStyle}/>,//<IconFeatherFeather.FileText size={35} />,
    navLink: Routes.SCRIPT.replace(':id', String(id)),
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },
  {
    id: "call_sheets",
    title: "Call sheets",
    type: "item",
    icon: <Icon src={iconsPath+"call_sheets.svg"}  style={iconStyle}/>,//<IconFeatherFeather.CheckSquare size={35} />,
    navLink: Routes.TASKS.replace(':id', String(id)),
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },
  // {
	// id: "dashboard",
	// title: "Dashboard",
	// type: "item",
	// icon: <Icon src={iconsPath+"dashboard.svg"}  style={iconStyle}/>,//<IconFeatherFeather.Activity size={35} />,
	// navLink: Routes.OVERVIEW.replace(':id', String(id)),
	//   permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  // },
  // {
  //   id: "budget",
  //   title: "insights",
  //   type: "item",
  //   icon: <Icon src={iconsPath+"budget.svg"}  style={iconStyle}/>,//<IconFeatherFeather.DollarSign size={35} />,
  //   navLink: Routes.BUDGET.replace(':id', String(id)),
	//   permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  // },
  {
    id: "team",
    title: "Team",
    type: "item",
    icon: <Icon src={iconsPath+"team.svg"}  style={iconStyle}/>,//<IconFeatherFeather.Users size={35} />,
    navLink: Routes.SUPPLIERS.replace(':id', String(id)),
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },
  {
    id: "all_contacts",
    title: "All Contacts",
    type: "item",
    icon: <Icon src={iconsPath+"all_contracts.svg"}  style={iconStyle}/>,//<IconFeatherFeather.Users size={35} />,
    navLink: Routes.PERMISSIONS.replace(':id', String(id)),
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },

  {
	id: "permissions",
	title: "Profile",
	type: "additionalMenu",
	icon: <Icon src={iconsPath+"all_contracts.svg"}  style={iconStyle}/>,
	navLink: "profile",
	  permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
  },
  {
    id: "sign_out",
    title: "Sign out",
    type: "additionalMenu",
    icon: <Icon src={iconsPath+"all_contracts.svg"}  style={iconStyle}/>,
    navLink: "sign out",
    permissions: [Roles.ADMIN, Roles.MANAGER, Roles.MEMBER],
    },
  // {
  //   id: "planning",
  //   title: "Planning",
  //   type: "item",
  //   icon: <IconFeatherFeather.Home size={35} />,
  //   navLink: Routes.PLANNING.replace(':id', String(id))
  // },
  // {
  //   id: "files",
  //   title: "Files",
  //   type: "item",
  //   icon: <Icon src={iconsPath+"files.svg"}  style={iconStyle}/>,//<IconFeatherFeather.File size={35} />,
  //   navLink: Routes.FILES.replace(':id', String(id))
  // },
  // {
  //   id: "projects",
  //   title: "Projects",
  //   type: "projects",
  //   icon: <IconFeatherFeather.Home size={35} />,
  //   navLink: "/login"
  // },
  // {
  //   id: "dashboard",
  //   title: "Dashboard",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.Home size={20} />,
  //   badge: "warning",
  //   badgeText: "2",
  //   children: [
  //     {
  //       id: "analyticsDash",
  //       title: "Analytics",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/"
  //     },
  //     {
  //       id: "eCommerceDash",
  //       title: "eCommerce",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin"],
  //       navLink: "/ecommerce-dashboard"
  //     }
  //   ]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "APPS"
  // },
  // {
  //   id: "email",
  //   title: "Email",
  //   type: "item",
  //   icon: <IconFeatherFeather.Mail size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/email/:filter",
  //   filterBase: "/email/inbox"
  // },
  // {
  //   id: "chat",
  //   title: "Chat",
  //   type: "item",
  //   icon: <IconFeatherFeather.MessageSquare size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/chat"
  // },
  // {
  //   id: "todo",
  //   title: "Todo",
  //   type: "item",
  //   icon: <IconFeatherFeather.CheckSquare size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/todo/:filter",
  //   filterBase: "/todo/all"
  // },
  // {
  //   id: "calendar",
  //   title: "Calendar",
  //   type: "item",
  //   icon: <IconFeatherFeather.Calendar size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/calendar"
  // },
  // {
  //   id: "eCommerce",
  //   title: "Ecommerce",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.ShoppingCart size={20} />,
  //   children: [
  //     {
  //       id: "shop",
  //       title: "Shop",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ecommerce/shop"
  //     },
  //     {
  //       id: "detail",
  //       title: "Product Detail",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ecommerce/product-detail"
  //     },
  //     {
  //       id: "wishList",
  //       title: "Wish List",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ecommerce/wishlist"
  //     },
  //     {
  //       id: "checkout",
  //       title: "Checkout",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ecommerce/checkout"
  //     }
  //   ]
  // },
  // {
  //   id: "users",
  //   title: "User",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.User size={20} />,
  //   children: [
  //     {
  //       id: "list",
  //       title: "List",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/app/user/list"
  //     },
  //     {
  //       id: "view",
  //       title: "View",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/app/user/view"
  //     },
  //     {
  //       id: "edit",
  //       title: "Edit",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/app/user/edit"
  //     }
  //   ]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "UI ELEMENTS"
  // },
  // {
  //   id: "dataList",
  //   title: "Data List",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.List size={20} />,
  //   badge: "primary",
  //   badgeText: "new",
  //   children: [
  //     {
  //       id: "listView",
  //       title: "List View",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/data-list/list-view"
  //     },
  //     {
  //       id: "thumbView",
  //       title: "Thumb View",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/data-list/thumb-view"
  //     }
  //   ]
  // },
  // {
  //   id: "content",
  //   title: "Content",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.Layout size={20} />,
  //   children: [
  //     {
  //       id: "gird",
  //       title: "Grid",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ui-element/grid"
  //     },
  //     {
  //       id: "typography",
  //       title: "Typography",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ui-element/typography"
  //     },
  //     {
  //       id: "textUitlities",
  //       title: "Text Utilities",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ui-element/textutilities"
  //     },
  //     {
  //       id: "syntaxHighlighter",
  //       title: "Syntax Highlighter",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/ui-element/syntaxhighlighter"
  //     }
  //   ]
  // },
  // {
  //   id: "colors",
  //   title: "Colors",
  //   type: "item",
  //   icon: <IconFeatherFeather.Droplet size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/colors/colors"
  // },
  // {
  //   id: "icons",
  //   title: "IconFeatherFeathers",
  //   type: "item",
  //   icon: <IconFeatherFeather.Eye size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/icons/reactfeather"
  // },
  // {
  //   id: "cards",
  //   title: "Cards",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.CreditCard size={20} />,
  //   children: [
  //     {
  //       id: "basic",
  //       title: "Basic",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/cards/basic"
  //     },
  //     {
  //       id: "statistics",
  //       title: "Statistics",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/cards/statistics"
  //     },
  //     {
  //       id: "analytics",
  //       title: "Analytics",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/cards/analytics"
  //     },
  //     {
  //       id: "cardActions",
  //       title: "Card Actions",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/cards/action"
  //     }
  //   ]
  // },
  // {
  //   id: "components",
  //   title: "Components",
  //   type: "collapse",
  //   icon: <IconFeatherFeather.Briefcase size={20} />,
  //   children: [
  //     {
  //       id: "alerts",
  //       title: "Alerts",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/alerts"
  //     },
  //     {
  //       id: "buttons",
  //       title: "Buttons",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/buttons"
  //     },
  //     {
  //       id: "breadCrumbs",
  //       title: "Breadcrumbs",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/breadcrumbs"
  //     },
  //     {
  //       id: "carousel",
  //       title: "Carousel",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/carousel"
  //     },
  //     {
  //       id: "collapse",
  //       title: "Collapse",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/collapse"
  //     },
  //     {
  //       id: "dropDowns",
  //       title: "Dropdowns",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/dropdowns"
  //     },
  //     {
  //       id: "listGroup",
  //       title: "List Group",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/list-group"
  //     },
  //     {
  //       id: "modals",
  //       title: "Modals",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/modals"
  //     },
  //     {
  //       id: "pagination",
  //       title: "Pagination",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/pagination"
  //     },
  //     {
  //       id: "navsComponent",
  //       title: "Navs Component",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/nav-component"
  //     },
  //     {
  //       id: "navbar",
  //       title: "Navbar",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/navbar"
  //     },
  //     {
  //       id: "tabsComponent",
  //       title: "Tabs Component",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/tabs-component"
  //     },
  //     {
  //       id: "pillsComponent",
  //       title: "Pills Component",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/pills-component"
  //     },
  //     {
  //       id: "tooltips",
  //       title: "Tooltips",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/tooltips"
  //     },
  //     {
  //       id: "popovers",
  //       title: "Popovers",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/popovers"
  //     },
  //     {
  //       id: "badges",
  //       title: "Badges",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/badges"
  //     },
  //     {
  //       id: "pillBadges",
  //       title: "Pill Badges",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/pill-badges"
  //     },
  //     {
  //       id: "progress",
  //       title: "Progress",
  //       type: "item",
  //       icon: <IconFeatherFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/progress"
  //     },
  //     {
  //       id: "mediaObjects",
  //       title: "Media Objects",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/media-objects"
  //     },
  //     {
  //       id: "spinners",
  //       title: "Spinners",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/spinners"
  //     },
  //     {
  //       id: "toasts",
  //       title: "Toasts",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/components/toasts"
  //     }
  //   ]
  // },
  // {
  //   id: "extraComponents",
  //   title: "Extra Components",
  //   type: "collapse",
  //   icon: <IconFeather.Box size={20} />,
  //   children: [
  //     {
  //       id: "autoComplete",
  //       title: "Auto Complete",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/extra-components/auto-complete"
  //     },
  //     {
  //       id: "avatar",
  //       title: "Avatar",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/extra-components/avatar"
  //     },
  //     {
  //       id: "chips",
  //       title: "Chips",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/extra-components/chips"
  //     },
  //     {
  //       id: "divider",
  //       title: "Divider",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/extra-components/divider"
  //     }
  //   ]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "FORMS & TABLES"
  // },
  // {
  //   id: "formElements",
  //   title: "Form Elements",
  //   type: "collapse",
  //   icon: <IconFeather.Copy size={20} />,
  //   children: [
  //     {
  //       id: "select",
  //       title: "Select",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/select"
  //     },
  //     {
  //       id: "switch",
  //       title: "Switch",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/switch"
  //     },
  //     {
  //       id: "checkbox",
  //       title: "Checkbox",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/checkbox"
  //     },
  //     {
  //       id: "radio",
  //       title: "Radio",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/radio"
  //     },
  //     {
  //       id: "input",
  //       title: "Input",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/input"
  //     },
  //     {
  //       id: "inputGroup",
  //       title: "Input Group",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/input-group"
  //     },
  //     {
  //       id: "numberInput",
  //       title: "Number Input",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/number-input"
  //     },
  //     {
  //       id: "textarea",
  //       title: "Textarea",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/textarea"
  //     },
  //     {
  //       id: "date_&_timePicker",
  //       title: "Date & Time Picker",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/pickers"
  //     },
  //     {
  //       id: "inputMask",
  //       title: "Input Mask",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/forms/elements/input-mask"
  //     }
  //   ]
  // },
  // {
  //   id: "formLayouts",
  //   title: "Form Layouts",
  //   type: "item",
  //   icon: <IconFeather.Box size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/forms/layout/form-layout"
  // },
  // {
  //   id: "wizard",
  //   title: "Form Wizard",
  //   type: "item",
  //   icon: <IconFeather.MoreHorizontal size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/forms/wizard"
  // },
  // {
  //   id: "formik",
  //   title: "Formik",
  //   type: "item",
  //   icon: <IconFeather.CheckCircle size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/forms/formik"
  // },
  // {
  //   id: "tables",
  //   title: "Tables",
  //   type: "collapse",
  //   icon: <IconFeather.Server size={20} />,
  //   children: [
  //     {
  //       id: "tablesReactstrap",
  //       title: "Reactstrap Tables",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/tables/reactstrap"
  //     },
  //     {
  //       id: "reactTables",
  //       title: "React Tables",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/tables/react-tables"
  //     },
  //     {
  //       id: "aggrid",
  //       title: "agGrid Table",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/tables/agGrid"
  //     },
  //     {
  //       id: "dataTable",
  //       title: "DataTables",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/tables/data-tables"
  //     }
  //   ]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "PAGES"
  // },
  // {
  //   id: "profile",
  //   title: "Profile",
  //   type: "item",
  //   icon: <IconFeather.User size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/profile",
  //   collapsed: true
  // },
  // {
  //   id: "accountSettings",
  //   title: "Account Settings",
  //   type: "item",
  //   icon: <IconFeather.Settings size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/account-settings"
  // },
  // {
  //   id: "faq",
  //   title: "FAQ",
  //   type: "item",
  //   icon: <IconFeather.HelpCircle size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/faq"
  // },

  // {
  //   id: "knowledgeBase",
  //   title: "Knowledge Base",
  //   type: "item",
  //   icon: <IconFeather.Info size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/knowledge-base",
  //   parentOf: [
  //     "/pages/knowledge-base/category/questions",
  //     "/pages/knowledge-base/category"
  //   ]
  // },
  // {
  //   id: "search",
  //   title: "Search",
  //   type: "item",
  //   icon: <IconFeather.Search size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/search"
  // },

  // {
  //   id: "invoice",
  //   title: "Invoice",
  //   type: "item",
  //   icon: <IconFeather.File size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/invoice"
  // },

  // {
  //   id: "authentication",
  //   title: "Authentication",
  //   type: "collapse",
  //   icon: <IconFeather.Unlock size={20} />,
  //   children: [
  //     {
  //       id: "login",
  //       title: "Login",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/pages/login",
  //       newTab: true
  //     },
  //     {
  //       id: "register",
  //       title: "Register",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/pages/register",
  //       newTab: true
  //     },
  //     {
  //       id: "forgotPassword",
  //       title: "Forgot Password",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/pages/forgot-password",
  //       newTab: true
  //     },
  //     {
  //       id: "resetPassword",
  //       title: "Reset Password",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/pages/reset-password",
  //       newTab: true
  //     },
  //     {
  //       id: "lockScreen",
  //       title: "Lock Screen",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/pages/lock-screen",
  //       newTab: true
  //     }
  //   ]
  // },
  // {
  //   id: "miscellaneous",
  //   title: "Miscellaneous",
  //   type: "collapse",
  //   icon: <IconFeather.FileText size={20} />,
  //   children: [
  //     {
  //       id: "comingSoon",
  //       title: "Coming Soon",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/misc/coming-soon",

  //       newTab: true
  //     },
  //     {
  //       id: "error",
  //       title: "Error",
  //       type: "collapse",
  //       icon: <IconFeather.Circle size={12} />,
  //       children: [
  //         {
  //           id: "404",
  //           title: "404",
  //           type: "item",

  //           icon: <IconFeather.Circle size={12} />,
  //           permissions: ["admin", "editor"],
  //           navLink: "/misc/error/404",

  //           newTab: true
  //         },
  //         {
  //           id: "500",
  //           title: "500",
  //           type: "item",

  //           icon: <IconFeather.Circle size={12} />,
  //           permissions: ["admin", "editor"],
  //           navLink: "/misc/error/500",

  //           newTab: true
  //         }
  //       ]
  //     },
  //     {
  //       id: "notAuthorized",
  //       title: "Not Authorized",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/misc/not-authorized",

  //       newTab: true
  //     },
  //     {
  //       id: "maintenance",
  //       title: "Maintenance",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/misc/maintenance",

  //       newTab: true
  //     }
  //   ]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "CHARTS & MAPS"
  // },
  // {
  //   id: "charts",
  //   title: "Charts",
  //   type: "collapse",
  //   badge: "success",
  //   badgeText: "3",
  //   icon: <IconFeather.PieChart size={20} />,
  //   children: [
  //     {
  //       id: "apex",
  //       title: "Apex",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/charts/apex"
  //     },
  //     {
  //       id: "chartJs",
  //       title: "ChartJS",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/charts/chartjs"
  //     },
  //     {
  //       id: "recharts",
  //       title: "Recharts",
  //       type: "item",
  //       icon: <IconFeather.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/charts/recharts"
  //     }
  //   ]
  // },
  // {
  //   id: "leafletMaps",
  //   title: "Leaflet Maps",
  //   icon: <IconFeather.Map size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/maps/leaflet"
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "EXTENSIONS"
  // },
  // {
  //   id: "sweetAlert",
  //   title: "Sweet Alerts",
  //   icon: <IconFeather.AlertCircle size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/sweet-alert"
  // },
  // {
  //   id: "toastr",
  //   title: "Toastr",
  //   icon: <IconFeather.Zap size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/toastr"
  // },
  // {
  //   id: "rcSlider",
  //   title: "Rc Slider",
  //   icon: <IconFeather.Sliders size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/slider"
  // },
  // {
  //   id: "fileUploader",
  //   title: "File Uploader",
  //   icon: <IconFeather.UploadCloud size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/file-uploader"
  // },
  // {
  //   id: "wysiwygEditor",
  //   title: "Wysiwyg Editor",
  //   icon: <IconFeather.Edit size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/wysiwyg-editor"
  // },
  // {
  //   id: "drag_&_drop",
  //   title: "Drag & Drop",
  //   icon: <IconFeather.Droplet size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/drag-and-drop"
  // },
  // {
  //   id: "tour",
  //   title: "Tour",
  //   icon: <IconFeather.Info size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/tour"
  // },
  // {
  //   id: "clipBoard",
  //   title: "Clipboard",
  //   icon: <IconFeather.Copy size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/clipboard"
  // },
  // {
  //   id: "contentMenu",
  //   title: "Context Menu",
  //   icon: <IconFeather.Menu size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/context-menu"
  // },
  // {
  //   id: "swiper",
  //   title: "Swiper",
  //   icon: <IconFeather.Smartphone size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/swiper"
  // },
  // {
  //   id: "access-control",
  //   title: "Access Control",
  //   icon: <IconFeather.Lock size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/access-control"
  // },
  // {
  //   id: "i18n",
  //   title: "I18n",
  //   icon: <IconFeather.Globe size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/i18n"
  // },
  // {
  //   id: "treeView",
  //   title: "Tree",
  //   icon: <IconFeather.GitPullRequest size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/tree"
  // },
  // {
  //   id: "extPagination",
  //   title: "Pagination",
  //   icon: <IconFeather.MoreHorizontal size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/pagination"
  // },
  // {
  //   id: "extImport",
  //   title: "Import",
  //   icon: <IconFeather.DownloadCloud size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/import"
  // },
  // {
  //   id: "extExport",
  //   title: "Export",
  //   icon: <IconFeather.UploadCloud size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "/extensions/export"
  // },
  // {
  //   id: "extExportSelected",
  //   title: "Export Selected",
  //   icon: <IconFeather.CheckSquare size={20} />,
  //   type: "item",
  //   navLink: "/extensions/export-selected",
  //   permissions: ["admin", "editor"]
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "OTHERS"
  // },
  // {
  //   id: "menuLevels",
  //   title: "Menu Levels",
  //   icon: <IconFeather.Menu size={20} />,
  //   type: "collapse",
  //   children: [
  //     {
  //       id: "secondLevel",
  //       title: "Second Level",
  //       icon: <IconFeather.Circle size={12} />,
  //       type: "item",
  //       permissions: ["admin", "editor"],
  //       navlink: ""
  //     },
  //     {
  //       id: "secondLevel1",
  //       title: "Second Level",
  //       icon: <IconFeather.Circle size={12} />,
  //       type: "collapse",

  //       children: [
  //         {
  //           id: "ThirdLevel",
  //           title: "Third Level",
  //           icon: <IconFeather.Circle size={12} />,
  //           type: "item",
  //           permissions: ["admin", "editor"],
  //           navLink: ""
  //         },
  //         {
  //           id: "ThirdLevel1",
  //           title: "Third Level",
  //           icon: <IconFeather.Circle size={12} />,
  //           type: "item",
  //           permissions: ["admin", "editor"],
  //           navLink: ""
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: "disabledMenu",
  //   title: "Disabled Menu",
  //   icon: <IconFeather.EyeOff size={20} />,
  //   type: "item",
  //   permissions: ["admin", "editor"],
  //   navLink: "#",
  //   disabled: true
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "SUPPORT"
  // },
  // {
  //   id: "documentation",
  //   title: "Documentation",
  //   icon: <IconFeather.Folder size={20} />,
  //   type: "external-link",
  //   permissions: ["admin", "editor"],
  //   navLink:
  //     "https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation"
  // },
  // {
  //   id: "raiseSupport",
  //   title: "Raise Support",
  //   icon: <IconFeather.LifeBuoy size={20} />,
  //   type: "external-link",
  //   newTab: true,
  //   permissions: ["admin", "editor"],
  //   navLink: "https://pixinvent.ticksy.com/"
  // }
]
}

export default navigationConfig
