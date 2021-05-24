import React from "react"
import {  Input, Label } from "reactstrap"

class TextareaCounter extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      value: ""
    }

  }

  // componentDidMount(){
  //   this.setState({value: defaultValue})

  // }

  render() {
    const {isListPreview, placeholder, rows, value, scene_time,script_index, scene_index,scene_number, chapter_number, onChange, onBlur, sceneId} = this.props
    return (
      <div>
        <div className="p-0">
          <div className="form-label-group mb-0">
            <Input
              type="textarea"
              name="text"
              style={{ resize: 'none', padding: isListPreview ? null : '0.1rem .4rem' }}
              rows={rows? rows :3 }
              //defaultValue={defaultValue}
              value={value}
              placeholder={placeholder}
              onBlur={e => onBlur(e.target.value, 'text', scene_number, chapter_number)}
              onChange={e => onChange(e.target.value, 'text', sceneId)}
            />
            <Label>{placeholder}</Label>
          </div>
          {/* <small
            className={`counter-value float-right ${
              this.state.value.length > 50 ? "bg-danger" : ""
            }`}
          >
            {`${this.state.value.length}/50`}
          </small> */}
        </div>
      </div>
    )
  }
}
export default TextareaCounter
