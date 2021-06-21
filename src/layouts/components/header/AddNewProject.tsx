import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Input } from 'reactstrap';

interface AddNewProjectProps {
	setShowAddAlert(data: boolean): void;
	showAddAlert: boolean;
}

const AddNewProject: React.FC<AddNewProjectProps> = (props: AddNewProjectProps) => {
	const { setShowAddAlert, showAddAlert } = props;
	const [eventName, setEventName] = React.useState('');
	const [eventBudget, setEventBudget] = React.useState(0);
	return (
		<Modal isOpen={showAddAlert} toggle={() => setShowAddAlert(false)} className="modal-dialog-centered">
			<ModalHeader toggle={() => setShowAddAlert(false)}>create new project</ModalHeader>
			<ModalBody>
				<FormGroup>
					<Label for="name">Name:</Label>
					<Input
						onChange={(e: any): void => {
							setEventName(e.target.value);
						}}
						type="text"
						name="name"
						id="name"
						placeholder="Event name"
						value={eventName}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="budget">Budget:</Label>
					<Input
						onChange={(e: any): void => {
							setEventBudget(e.target.value);
						}}
						type="number"
						name="budget"
						id="budget"
						placeholder="Planned Budget"
						value={eventBudget === 0 ? '' : eventBudget}
					/>
				</FormGroup>
			</ModalBody>
			<ModalFooter>
				<Button
					color="primary"
					onClick={async () => {
						//   if( isEventDataFilled ) {
						// 	  const newProject: any = await addProject({user_id: user.id, company_id: user.company_id,project_name: eventName, budget: eventBudget})
						// 	  if( newProject && newProject.project) {
						// 		  dispatch({
						// 			  type: EventActionTypes.SET_EVENTS,
						// 			  payload: [...events,newProject.project]
						// 		  });
						// setEventActive(newProject.project.id)
						setShowAddAlert(false);
						setEventName('');
						setEventBudget(0);
					}}
				>
					create
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default AddNewProject;
