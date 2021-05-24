import React from "react"
import { Card,CardBody } from "reactstrap"
import SweetAlert from 'react-bootstrap-sweetalert';

class BasicSweetCallback extends React.Component {

  state = {
   basicAlert: true,
   confirmAlert : false, 
   cancelAlert : false, 
  }

  handleAlert = (state, value) => {
    this.setState({ [state] : value })
  }

  render(){
    const { showAlert, onConfirm, onCancel, toogle } = this.props
    return (
       <>
        <SweetAlert title="Are you sure?" 
          warning
          show={showAlert && this.state.basicAlert}
          showCancel
          reverseButtons
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          onConfirm={() => {
            this.handleAlert("basicAlert", false)
            this.handleAlert("confirmAlert", true)
            if(onConfirm)  onConfirm()
          }}
          onCancel={() => {
            this.handleAlert("basicAlert", false)
            this.handleAlert("cancelAlert", true)
            if( onCancel ) onCancel()
          }}
        >
          You won't be able to revert this!
        </SweetAlert>

        <SweetAlert success title="Deleted!" 
          confirmBtnBsStyle="success"
          show={this.state.confirmAlert} 
          onConfirm={() => {
            this.handleAlert("confirmAlert", false)
            toogle(false)
          }}
        >
            <p className="sweet-alert-text">Your file has been deleted.</p>
        </SweetAlert>

        <SweetAlert error title="Cancelled" 
          confirmBtnBsStyle="success"
          show={this.state.cancelAlert} 
          onConfirm={() =>{
            this.handleAlert("cancelAlert", false)
            toogle(false)
          }}
        >
            <p className="sweet-alert-text">
              Your imaginary file is safe :)
            </p>
        </SweetAlert>
</>

    )
  }
}

export default BasicSweetCallback