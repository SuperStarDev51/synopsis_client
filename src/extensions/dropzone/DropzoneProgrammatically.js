import React, { useState,  useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { XCircle } from "react-feather";
import { addCharacter, deleteCharacter, getProjectScript } from "@containers/scripts/initial-state";
import {
	Card,
	Button,
	Row,
	Col,
	Modal,
	ModalBody,
	ModalFooter,
} from "reactstrap"
import { CharactersActionTypes } from '@containers/tasks/ListsReducer';
import { useDropzone } from "react-dropzone"
import { addProject, deleteProject } from '@containers/planning/initial-state';
import { FormattedMessage } from "react-intl"
import { ScriptsActionTypes } from '@containers/scripts/enums';
import { ShootingDaysActionTypes } from '@containers/shooting_days/enums';
import * as scenesBreakdownActions from "../../redux/actions/scenes-breakdown"
import { config } from '../../config';
import {CircularProgress} from '@material-ui/core';
import { Icon } from '@components';
import {Modals} from "./Modals";

export const ProgrammaticallyDropzone = (props) => {
  const dispatch = useDispatch();
  const { option,  } = props
  const state = useSelector(state => state)
  const sceneTime = state.sceneTime
	const sceneLocation = state.sceneLocation
  const { user, events, scripts } = state;
  const { navigateToBreakDownScenes } = props
  const activeEvent = events.filter((event) => event.preview)[0];
  const [loading, setLoading] = useState(false)
  const [projectID, setProjectID] = useState(false)
  const [scriptsObject, setScriptsObject] = useState([])
  const [files, setFiles] = useState([])
  const { getRootProps, getInputProps, open  } = useDropzone({
    // accept: "image/*",
    accept: ".doc, .docx, .pdf, .fdr",
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: async acceptedFiles => {
        setLoading(true)
        let newProject = await addProject({user_id: user.id, company_id: user.company_id,project_id: activeEvent.id , attachments: acceptedFiles})


		if (newProject && newProject.shooting_days) {
			dispatch({
				type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
				payload: newProject.shooting_days
			});
		}

		if( newProject && newProject.script && newProject.script[0] && newProject.script[0].attachments ) {
          if( newProject.scene_location && newProject.scene_location.length ) {
            let arr = [...sceneLocation,...newProject.scene_location]
            await dispatch(scenesBreakdownActions.setSceneLocation(arr.filter((i, index) => {
              const _thing = JSON.stringify(i);
              return index === arr.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            })
            ))
          }
          if( newProject.scene_time && newProject.scene_time.length) {
            let arr =  [...sceneTime,...newProject.scene_time]
            await dispatch(scenesBreakdownActions.setScenetime(arr.filter((i, index) => {
              const _thing = JSON.stringify(i);
              return index === arr.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            })
            ))
           }
          if( newProject.characters && newProject.characters.length) {
            await dispatch({
              type: CharactersActionTypes.SET_CHARACTERS,
              payload: newProject.characters
            });
           }
          newProject.script.forEach((a,i) => {
              acceptedFiles[i].preview =  a.attachments[0].file_url
          });
        setFiles(acceptedFiles)
        setScriptsObject(newProject.script)
        setLoading(false)
       }
    }
  })

  const setScripts = (s) => {
    const unique = [...new Map([...scripts, ...s].map(item => [item.chapter_number, item])).values()]
    console.log('unique: ', unique)
  	dispatch({
      type: ScriptsActionTypes.SET_SCRIPTS,
      payload: unique
    });
    navigateToBreakDownScenes()
    setFiles([])
    setScriptsObject([])
  };


  const thumbs = files.map((file, fi) => (
    <Col>
    <div className="dz-thumb" key={file.name}>
      <div className="dz-thumb-inner position-relative width-min-content">
        <div className="btn position-absolute position-right-0 position-top-0"
              onClick={()=>{setScriptsObject(scriptsObject.filter((s,i) => i !== fi)); setFiles(files.filter((f,i) => i !== fi))}}>
         	<Icon src={config.iconsPath+"options/x.svg"} style={{height: '2.5rem',width: '1.5rem'}}/>
        </div>
        <iframe
          src={"https://docs.google.com/viewer?url=" + file.preview + "&embedded=true"}
          style={{ width: '300px',
                  height: '350px'}}
                  className="doc-preview"
        ></iframe>

      {/* <img src={file.preview} className="dz-img" alt={file.name} /> */}
      </div>
      </div>
    </Col>
  ))


  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      // files.forEach(file => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (<>
    {/*{['comptuer', 'dropbox', 'google_drive'].map(option => (*/}
	{['comptuer'].map(option => (
      <Col key={option}>
      { !thumbs.length ?
      <Card className="btn bg-light-gray height-250 width-220 d-flex-column align-items-cetner justify-content-center">
      <section onClick={open}>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {/* <p className="mx-1">
         Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה.
        </p> */}
      </div>
      {!files.length ?
       loading ? <CircularProgress /> :
        <div className="d-flex flex-column text-center align-items-center">
            <img src={`${config.iconsPath}upload_script/${option}.png`}/>
            <div className="mt-1 font-medium-2"><FormattedMessage id={option}/></div>
        </div>
      : null }
    </section>
      </Card> : null }
     </Col>
    ))}

	{thumbs && thumbs.length ? (
  		<Modals
			setScripts={() => setScripts(scriptsObject)}
  		/>
	):null}

 </> )
}

class DropzoneProgrammatically extends React.Component {

  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className="height-auto d-flex align-items-center justify-content-center">
        <Row>
              <ProgrammaticallyDropzone navigateToBreakDownScenes={this.props.navigateToBreakDownScenes}/>
        </Row>
      </div>
    )
  }
}

export default DropzoneProgrammatically
