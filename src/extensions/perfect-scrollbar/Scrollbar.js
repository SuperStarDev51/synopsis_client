import React from "react"
import PerfectScrollbar from "react-perfect-scrollbar"

class ScrollBar extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    const { className, ref, children } = this.props
    return (
          <PerfectScrollbar
              className={className ? className :''}
              option={{
                wheelPropagation: false
              }}
              ref={ref ? ref : null} 
              >
              {children ? children : null}
          </PerfectScrollbar>
            
           )
  }
}

export default ScrollBar
