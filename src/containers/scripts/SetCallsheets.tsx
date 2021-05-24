
import * as React from 'react';
import { RootStore } from '@src/store';
import { Event } from '@containers/planning/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from "react-intl"
import { buildSchedule } from '@containers/scripts/initial-state';
import * as SuppliersActions from "../../redux/actions/suppliers/suppliers"
import { EventActionTypes } from '@containers/planning/enum';
import { XCircle, Check } from "react-feather"
import { SuppliersActionTypes } from '@containers/suppliers/enums';
import { ShootingDaysActionTypes } from '@containers/shooting_days/enums';
import { UsersActionTypes } from '@containers/tasks/enums';
import { BreakDownLoader } from '@components';
import { Spinner } from 'reactstrap'

import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
  FormGroup,
  Row,
  Col,
	Input,
  } from "reactstrap"



  interface Props {
    readonly isOpen: boolean;
    readonly toogle: (b:boolean) => void;
    readonly navigateToShootingDaysBreakdown: () => void
  }

 export const SetCallsheets: React.FunctionComponent<Readonly<Props>> = (props: Readonly<Props>) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { isOpen, toogle, navigateToShootingDaysBreakdown } = props
    const state = useSelector((state: RootStore) => state)
    const user = state.user
    const [maxShootingDays, setMaxShootingDays] =  React.useState<number>(0);
    const [loading, setLoading] = React.useState(false)
    const [showAddBreak, setShowAddBreak] =  React.useState<boolean>(false);
    const [breakTitle, setBreakTitle] =  React.useState<string>('');
    const events:Event[] =  state.events
    const activeEvent = events.filter((event: Event) => event.preview)[0];
    const setEventParameter = (project_id: number, field: string, data: any) => {
      dispatch({
        type: EventActionTypes.SET_EVENT_PARAMETER,
        payload: { project_id, field, data }
      });
    }

     const changeHandler = (e:any, ci: number, location:string) => {
      let newValues = activeEvent.params
      newValues[ci][location][e.target.name] = e.target.value;
      setEventParameter(activeEvent.id, 'params', newValues)
     }

     const onDelete = (ci: number) => {
      let newValues = activeEvent.params
      newValues.splice(ci, 1);
      setEventParameter(activeEvent.id, 'params', newValues)
     }


    const addBreak = (type: string) => {
      let newBreak = {
        custom:true,
        type,
        outside: { start: '', end: ''},
        inside: { start: '', end: ''}
      }
      setEventParameter(activeEvent.id, 'params', [...activeEvent.params, newBreak])
      setShowAddBreak(false)
      setBreakTitle('')
    }



  return (
				<Modal
					isOpen={isOpen}
					toggle={()=>toogle(false)}
					className="modal-dialog-centered modal-md"
                >
                  {/* <ModalHeader toggle={()=>toogle(false)}>
                   <FormattedMessage id='shooting_day_settings' />
                  </ModalHeader> */}
                  <ModalBody className="mx-3 my-1">
                  {loading && (<BreakDownLoader/> )}


			{activeEvent && (
                <FormGroup className="d-flex justify-content-center align-items-center">
                      <Label className="font-medium-1 text-bold-700" for={'max_shooting_days'}><FormattedMessage id={'max_shooting_days'} />:</Label>
                      <Input
                        className="ml-1 width-15-per text-center"
                        type="number"
                        id={'max_shooting_days'}
                        value={activeEvent.max_shooting_days}
                        onChange={(e:any)=> {setEventParameter(activeEvent.id, 'max_shooting_days', Number(e.target.value))}}
                      />
                 </FormGroup>
             )}

                <Row>
                  {/* <Row className="width-100-per">
                    <Col className="height-35 text-center"></Col>
                    <Col className="height-35 text-center"><FormattedMessage id='inside' /></Col>
                    <Col className="height-35 text-center"><FormattedMessage id='outside' /></Col>
                  </Row> */}

                  {activeEvent && activeEvent.params && (
                    activeEvent.params.map((category: any, ci: number)=> (
                   <div className="d-flex-column position-relative width-100-per justify-content-center" key={ci}>

                   <Col>
                          <div className="d-flex align-items-center font-medium-1 height-50 text-bold-700"><FormattedMessage id={category.type} /></div>
                    </Col>
                    <Col>
                    <Row className="align-items-center">
                    <Col className="height-35 text-center"><FormattedMessage id='inside' /></Col>
                    <Row>
                          {category.inside &&  (
                            Object.keys(category.inside).map((field: any, index: number)=> (
                               <div className="d-flex align-items-center height-50 width-50-per" key={index}>
                                <Input
                                    className="ml-1 text-center p-1"
                                    type="time"
                                    name={field}
                                    value={category['inside'][field]}
                                    onChange={(e)=>changeHandler(e, ci, 'inside')}
                                  />
                             </div>
                          )))}
                    </Row>
                    </Row>
                    <Row className="align-items-center">
                    <Col className="height-35 text-center"><FormattedMessage id='outside' /></Col>
                    <Row>
                      {category.outside &&  (
                          Object.keys(category.outside).map((field: any, index: number)=> (
                               <div className="d-flex align-items-center height-50 width-50-per" key={index}>
                                <Input
                                    className="ml-1 text-center p-1"
                                    type="time"
                                    name={field}
                                    value={category['outside'][field]}
                                    onChange={(e)=>changeHandler(e, ci,'outside')}
                                  />
                             </div>
                          )))}
                       </Row>
                    </Row>
                    </Col>

                   {category.custom && (
                    <div className="fonticon-container">
                      <div className="fonticon-wrap width-0 height-auto">
                      <XCircle
                      className="n-btn-delete mr-1 mb-1"
                      size={20}
                      onClick={(): void => onDelete(ci)}
                      />
                      </div>
                    </div>
                    )}
                </div>
                )))}
                <Row className="mx-2">
                </Row>
                {showAddBreak && (
                <Row className="width-100-per align-items-center">
                  <Col>
                    <Input
                    className="my-1"
                    type="text"
                    value={breakTitle}
                    onChange={(e)=>setBreakTitle(e.target.value)}
                  />
                 </Col>
                 <Check onClick={breakTitle.trim().length > 0 ? ()=>addBreak(breakTitle) : ()=>setShowAddBreak(false)} />
                </Row>)}
                <div  onClick={()=>setShowAddBreak(true)}>
                    +  <FormattedMessage id='add_break' />
               </div>
               </Row>
                  </ModalBody>
      <ModalFooter className="justify-content-center py-2">

      {loading ?
      null
      //  <Button color="yellow"  className="width-200">
      //     <Spinner color="white" size="sm" type="grow" />
      //     <span className="ml-50"> <FormattedMessage id='loading'/>...</span>
      //   </Button>
        :
          <Button color="yellow"
            className="width-200"
            onClick={async ()=>{
               setLoading(true)
               let newSchedule:any = await buildSchedule(activeEvent.id, activeEvent.params, activeEvent.max_shooting_days)
                if( newSchedule && newSchedule.project_id) {
                  const { budgets, project_id, shooting_days, suppliers, tasks } = newSchedule
                  if( shooting_days ){
                  	dispatch({
                      type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
                      payload: shooting_days
                    });
                  }
                  if( tasks ){
                    dispatch({
                      type: UsersActionTypes.SET_USERS,
                      payload: tasks
                    });
                  }
                  if( suppliers ){
                    dispatch(SuppliersActions.setSuppliersGroup(suppliers))
                  }
                  navigateToShootingDaysBreakdown()
                }
                  setLoading(false)
                  toogle(false)
              }}>
                      <FormattedMessage id='set_callsheets' />
             </Button>
              }
            </ModalFooter>
             </Modal>
    )
                }
