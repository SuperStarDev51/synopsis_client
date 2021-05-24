import React from "react"
import themeConfig from "../configs/themeConfig"
import classnames from "classnames"

const FullPageLayout = ({ children, ...rest }) => {
  return (
    <div
      className={classnames(
        "full-layout wrapper blank-page bg-full-screen-image",
        {
          "layout-dark": themeConfig.layoutDark
        }
      )}
    >
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            <div className="flexbox-container">
              <main className="main w-100 h-100 overflow-auto d-flex justify-content-center">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullPageLayout
