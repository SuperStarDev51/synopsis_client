import React, { useState,  useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { XCircle } from "react-feather";
import { addCharacter, deleteCharacter, getProjectScript } from "@containers/scripts/initial-state";
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
} from "reactstrap"
import { CharactersActionTypes } from '@containers/tasks/ListsReducer';
import { addProject, deleteProject } from '@containers/planning/initial-state';
import { FormattedMessage } from "react-intl"
import { ScriptsActionTypes } from '@containers/scripts/enums';
import { SceneTimeActionTypes } from '@containers/tasks/ListsReducer';
import { Icon } from '@components';

export const Modals = ({ setScripts }) => {
	const dispatch = useDispatch();
	const state = useSelector(state => state);
	const events = useSelector((state) => state.events);
	const activeEvent = events.filter((event) => event.preview)[0];
	const characters = useSelector((state) => state.characters);
	const sceneTime = useSelector((state) => state.sceneTime);
	const user = useSelector((state) => state.user);
	const [activeStep, setActiveStep] = React.useState(0);
	const [associatedNumberArrayState, setAssociatedNumberArrayState] = React.useState([]);
	const [charactersSelectedState, setCharactersSelectedState] = React.useState([]);
	const [selectCount, setSelectcount] = React.useState(0)
	const [colorList, setColorList] = React.useState([])

	let charactersSelected = [...charactersSelectedState];

	let bgColor = ['#dce1ff', 'pink', '#DDAE90', '#C3DAEA', '#F4E489' , '#d4459a', '#45bb7a', '#ff324b', '#324bff' ,  '#ccc']
	let selectedAssociatedNumberArray = [...associatedNumberArrayState]

	const handleDeleteCharacter = characterId => {
		deleteCharacter(
			characterId,
			activeEvent.id,
			1,
			1,
			1
		);

		dispatch({
			type: CharactersActionTypes.DELETE_CHARACTER,
			payload: {characterId},
		})
	};
	const handleSetCharacterAssociated = (characterIds, associatedNum) => {
		dispatch({
			type: CharactersActionTypes.SET_CHARACTER_ASSOCIATED,
			payload: {characterIds, associatedNum},
		})
		characterIds.forEach(id => {
			return addCharacter({
				project_id: activeEvent.id,
				character_id: id,
				associated_num: associatedNum,
			})
		})
	};

	useEffect (() => {
		console.log("Useeffect in modal")
		characters.map((character , index )=> {
			let associatedNum = character.associated_num ? character.associated_num : index + 1
			addCharacter({
				project_id: activeEvent.id,
				character_id: character.character_id,
				associated_num: associatedNum
			})

			
		})
	}, [characters])

	

	return (
		<>
		<Modal
			isOpen={activeStep === 0}
			className="modal-dialog-centered modal-md"
		>
			<ModalBody className="mx-3 my-1">
				<h2 className="text-center">Welcome to Synopsis</h2>
				<p>Your knowledge and expertise are valuable and important,
				please guide us in improving the product for you.</p>
				<ul className="list-style-none">
					<li>1. Setting shooting days hours</li>
					<li>2. Merging characters</li>
				</ul>
				<p>Thank you for choosing Imgn for your production!</p>
			</ModalBody>
			<ModalFooter className="justify-content-center py-2">
				<Button color="yellow"
						className="width-200"
						onClick={() => setActiveStep(1)}>
					<FormattedMessage id='ok'/>
				</Button>
			</ModalFooter>
		</Modal>
		<Modal
			isOpen={activeStep === 1}
			className="modal-dialog-centered modal-md"
		>
			<ModalBody className="mx-3 my-1">
				<h2 className="text-center mb-2">Scene Time</h2>
				{sceneTime && sceneTime.map(item => (
					<div className="row align-items-center mb-05">
						<div
							className="col-5 text-right pr-05"
							style={{borderRight: `1rem solid ${item.color}`}}
						>
							{item.scene_time}
						</div>
						<div className="col-3">
							<input
								type="time"
								value={item.timeStart ? item.timeStart : ''}
								onChange={e => {
									dispatch({
										type: SceneTimeActionTypes.SET_SCENE_TIME_PARAM,
										payload: {
											sceneTimeId: item.id,
											field: 'timeStart',
											value: e.target.value
										}
									});
								}}
							/>
						</div>
						<div className="col-3">
							<input
								type="time"
								value={item.timeEnd ? item.timeEnd : ''}
								onChange={e => {
									dispatch({
										type: SceneTimeActionTypes.SET_SCENE_TIME_PARAM,
										payload: {
											sceneTimeId: item.id,
											field: 'timeEnd',
											value: e.target.value
										}
									});
								}}
							/>
						</div>
						<div className="col-1 p-0">
							<XCircle
								className="n-btn-delete"
								size={20}
								onClick={() => {
									let updatedProject = {
										user_id: user.id,
										company_id: user.company_id,
										project_id: activeEvent.id,
										scene_time: sceneTime.filter(sceneTimeItem => sceneTimeItem.id !== item.id)
									};
									addProject(updatedProject);

									dispatch({
										type: SceneTimeActionTypes.DELETE_SCENE_TIME_ITEM,
										payload: { sceneTimeId: item.id }
									});
								}}
							/>
						</div>
					</div>
				))}
			</ModalBody>
			<ModalFooter className="justify-content-center py-2">
				<Button color="yellow"
						className="width-200"
						onClick={() => setActiveStep(2)}>
					<FormattedMessage id='ok'/>
				</Button>
			</ModalFooter>
		</Modal>
		<Modal
			isOpen={
				activeStep === 2
				// true
			}
			className="modal-dialog-centered modal-xl"
		>
			<ModalBody className="my-1 overflow-auto" style={{maxHeight: 'calc(100vh - 12rem)'}}>
				<div className="row">
				{characters.map((character , index )=> (
					<div key={character.character_id} className="col-3 row align-items-center mb-05">
						<div
							className="col-9 d-flex align-items-center p-05 cursor-pointer"
							style={{
								borderRadius: '.5rem',
								backgroundColor:  character.associated_num || charactersSelectedState.includes(character.character_id) ? bgColor[ colorList[index] % 10 ] : ''
							}}
							onClick={(e) => {
								let colorListClone = [...colorList]
								colorListClone[index] = selectCount
								setColorList(colorListClone)

								console.log("character.associated_num", character.associated_num)
								if (charactersSelected.includes(character.character_id)) {    // if existing charater, cancel it
									let updatedCharacterSelected = charactersSelected.filter(item => item !== character.character_id);
									setCharactersSelectedState(updatedCharacterSelected);    // cancel charter selection array

									let selectedCharaterIndex = index + 1
									let updated_associated_num = selectedAssociatedNumberArray.filter(item => item !== selectedCharaterIndex)
									setAssociatedNumberArrayState(updated_associated_num)     // cancel character index array

								} else {
									let updatedCharactersSelected = [...charactersSelected, character.character_id];
									setCharactersSelectedState(updatedCharactersSelected);

									let selectedCharaterIndex = index + 1
									let updated_associated_num = [...selectedAssociatedNumberArray, selectedCharaterIndex]
									setAssociatedNumberArrayState(updated_associated_num)

								}
								console.log("charactersSelectedState", charactersSelectedState)
								
							}}
						>
							<input
								readOnly
								value={ 
									character.associated_num ? 
									 character.associated_num
									: index +1
								}
								type="number"
								style={{width: '38px'}}
								className="form-control mr-05 height-1-rem bg-white"
							/>
							<span> {character.character_name}</span>
						</div>
						<div className="col-3">
							<XCircle
								className="n-btn-delete mr-05"
								size={20}
								onClick={() => {
									addProject({});
									handleDeleteCharacter(character.character_id)
								}}
							/>
						</div>
					</div>
				))}
				</div>
			</ModalBody>
			<ModalFooter className="justify-content-center py-2">
				<Button
					outline
					color="primary"
					className=""
					disabled={charactersSelectedState.length < 2}
					onClick={() => {
						handleSetCharacterAssociated(charactersSelectedState, Math.min(...associatedNumberArrayState))
						setCharactersSelectedState([]); 
						setAssociatedNumberArrayState([]);
						setSelectcount(selectCount + 1)
						
					}}
				>
					Set Associated
				</Button>
				<Button color="yellow"
						className="width-200"
						onClick={() => {
								setScripts()
								characters.map((character , index )=> {
									let associatedNum = character.associated_num ? character.associated_num : index + 1
									let characterIds = []
									characterIds = [...characterIds, character.character_id]
									
									dispatch({
										type: CharactersActionTypes.SET_CHARACTER_ASSOCIATED,
										payload: {characterIds, associatedNum},
									})
								})
							}
						}>
					<FormattedMessage id='ok'/>
				</Button>
			</ModalFooter>
		</Modal>
		</>
	)
};

export default Modals;
