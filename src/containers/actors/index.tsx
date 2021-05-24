import * as React from 'react';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
// import {Button} from '@components';
import { EventActionTypes } from '@containers/planning/enum';
import { Event } from '@containers/planning/interfaces';
import { useHistory } from "react-router-dom";
import { Routes } from '../../utilities';
import {
	Card,
	CardBody,
	CardImg,
	Row,
	Col,
	Button,
	Progress
  } from "reactstrap"


export const Projects: React.FC = () => {
	const dispatch = useDispatch();
	const events = useSelector((state: RootStore) => state.events);
	const history = useHistory();


	const setEvent = (event_id: number): void => {
		dispatch({
			type: EventActionTypes.SET_EVENTS,
			payload: events.map((event: Event, i: number)=>{
					if( event.id !== event_id ) return {...event, preview: false}
					else return {...event,preview: true}
				})
		});
		history.push(Routes.PLANNING.replace(':id',String(event_id))) 

	}

	return (
		<div style={{padding: '1.8rem 2.2rem 0'}}>
			<Row> 
	
			{events.map((event:Event,i:number)=> (
				<Col lg="4" md="12">
				   <Card>
					 <CardBody>
					   {/* <CardImg
						 className="img-fluid mb-2"
						 src={img}
						 alt="card image cap"
					   /> */}
					   <h5>{event.project_name}</h5>
					   <div className="d-flex justify-content-between mt-1">
						 <small className="float-left font-weight-bold mb-25">
						  $ {event.budget}
						 </small>
						 <small className="float-left font-weight-bold mb-25">
						   $ {event.budget}
						 </small>
					   </div>
					   <Progress className="box-shadow-6" value="75" />
					   <div className="card-btns d-flex justify-content-between mt-2">
						 {/* <Button.Ripple className="gradient-light-primary text-white">
						   Download
						 </Button.Ripple> */}
						 <Button.Ripple color="primary" outline onClick={()=>setEvent(event.id)}>
						   View Project
						 </Button.Ripple>
					   </div>
					 </CardBody>
				   </Card>
				 </Col>
			))}
			    </Row>
      </div>
	
		);
};

export default Projects;
