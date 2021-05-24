import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as moment from 'moment';
import {Check, XCircle, Mail} from "react-feather";
import { Icon } from '@components';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '@containers/planning/interfaces';
import { RootStore } from '@src/store';
import { UserInterface } from './interfaces';
import {UsersNavCategorised} from "@root/src/components/users-nav-categorised";
import {TasksNav} from "@root/src/components/tasks-nav";
import { setSceneParameter } from "@root/src/redux/actions/scenes-breakdown";
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import {addScene} from "@root/src/containers/scripts/initial-state";
import './index.scss';
import {Popup} from "@root/src/components/popup";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
} from "reactstrap"
import { addShootingDay } from "@containers/shooting_days/initial-state";
import { CallsheetPropPopover } from '@src/components/CallsheetPropPopover/index.tsx';
import {LocationsTab} from "@root/src/containers/tasks/LocationsTab";

const AddTaskControl: React.FunctionComponent = ({ activeDay, activeEvent, propItem , fieldName}) => {
	const dispatch = useDispatch();
	const inputEl = React.useRef(null);
	const [isInputShown, setIsInputShown] = React.useState(false);
	const [tasksInputValue, setTasksInputValue] = React.useState('');

	React.useEffect(() => {
		if (isInputShown) {
			inputEl.current.focus()
		}
		return () => {
			inputEl.current.blur()
		};
	}, [isInputShown]);

	React.useEffect(() => {
		document.addEventListener('keydown', keydownHandler);
		return () => {
			document.removeEventListener('keydown', keydownHandler);
		};
	});

	const updateIsInputShown = value => {
		setIsInputShown(value)
	};

	const handleAddTaskClick = () => {
		let scene = {
			chapter_number: propItem.chapterNumber,
			project_id: activeEvent.id,
			[fieldName]: [...propItem[fieldName],{def: tasksInputValue, comments: "", supplier_id: null, supplier_name: ""}],
			scene_number: propItem.sceneNumber,
		};
		if (tasksInputValue) {
			addScene(scene);
		}

		tasksInputValue !== '' &&
		dispatch({
			type: ShootingDaysActionTypes.UPDATE_SCENE_TASKS,
			payload: {
				shootingDayId: activeDay.id,
				value: tasksInputValue,
				sceneId: propItem.sceneId,
				field: fieldName,
			}
		})
	};

	const handleButtonClick = () => {
		if (isInputShown) {
			if (tasksInputValue !== '') {
				handleAddTaskClick();
				updateIsInputShown(false);
			}
		} else {
			updateIsInputShown(true);
		}
	};

	const keydownHandler = e => {
		if(e.keyCode === 13 && tasksInputValue !== '') {
			handleButtonClick();
		}
		if(e.keyCode === 27) {
			inputEl.current.blur();
		}
	};

	return (
		<div className="d-flex p-05 align-items-center">
			<input
				ref={inputEl}
				className="form-control mr-05"
				style={{height: '2rem', display: isInputShown ? 'block' : 'none'}}
				type="text"
				value={tasksInputValue}
				onChange={e => setTasksInputValue(e.target.value)}
				onBlur={() => {
					if (tasksInputValue === '') updateIsInputShown(false)
				}}
			/>
			<button
				style={{height: '2rem'}}
				className="btn btn-secondary p-05"
				onClick={handleButtonClick}
			>+</button>
		</div>
	)
};

export const CreateNewTask: React.FunctionComponent = ({ tasksFromAllScenes, activeDay, activeEvent, fieldName }) => {
	const dispatch = useDispatch();
	const [sceneId, setSceneId] = React.useState('');
	const [newTaskName, setNewTaskName] = React.useState('');
	const [createNewVisible, setCreateNewVisible] = React.useState(false);
	const uniqTotalScenes = activeDay && [...new Map(activeDay.shooting_day.total_scenes.map(item => [item.scene_id, item])).values()];

	const occupiedIds = [];
	tasksFromAllScenes && tasksFromAllScenes.forEach(prop => {
		occupiedIds.push(prop.sceneId);
	});

	const availableScenes =	uniqTotalScenes && uniqTotalScenes.filter(item => !occupiedIds.includes(item.scene_id));


	return (
		<div className="d-flex">
			{createNewVisible &&
			<>
			<select
				value={sceneId}
				className="form-control width-150 mr-05"
				onChange={e => setSceneId(e.target.value)}
			>
				<option value="">Select scene</option>
				{availableScenes && availableScenes.map(scene => {
					return (
						<option value={scene.scene_id}>
							{scene.scene_id}
						</option>
					)
				})}
			</select>
			<input
				value={newTaskName}
				type="text"
				className="form-control width-300 mr-05"
				placeholder="Enter prop name"
				onChange={(e) => setNewTaskName(e.target.value)}
			/>
			<button
				className="btn btn-secondary p-05"
				onClick={() => {
					let scene = {
						chapter_number: availableScenes.filter(item => item.scene_id === sceneId)[0].chapter_number,
						project_id: activeEvent.id,
						[fieldName]: [...availableScenes.filter(item => item.scene_id === sceneId)[0][fieldName], {def: newTaskName, comments: "", supplier_id: null, supplier_name: ""} ],
						scene_number: availableScenes.filter(item => item.scene_id === sceneId)[0].scene_number,
					};
					if (newTaskName) {
						addScene(scene);
					}

					dispatch({
						type: ShootingDaysActionTypes.UPDATE_SCENE_TASKS,
						payload: {
							shootingDayId: activeDay.id,
							value: newTaskName,
							sceneId: sceneId,
							field: fieldName,
						}
					});
					setSceneId('');
					setNewTaskName('');
					setCreateNewVisible(false)
				}}
			>
				+ Add task
			</button>
			</>
			}
			<button
				style={{display: createNewVisible ? 'none' : 'block', height: '2.55rem'}}
				className="btn btn-secondary p-05"
				onClick={() => setCreateNewVisible(true)}
			>
				+ Add task
			</button>
		</div>
	)
};

export const ScriptModal: React.FunctionComponent = ({ scene, activeCharacterName }) => {
	const [isModalOpen, setIsModalOpen] =  React.useState(false);
	const noDialog = !scene.script.find(item => item.character === activeCharacterName)

	return (
		<div className="d-flex align-items-center">
			<button
				className="btn btn-sm bg-black text-white width-150"
				onClick={() => setIsModalOpen(true)}
			>
				Script
			</button>
			{noDialog && <div className="ml-1 opacity-05">No dialog</div>}
			<Modal
				isOpen={isModalOpen}
				toggle={() => setIsModalOpen(false)}
				className="modal-dialog-centered modal-md"
			>
				<ModalHeader toggle={() => setIsModalOpen(false)}>
					Script
				</ModalHeader>
				<ModalBody className="mx-3 my-1">
					{scene && scene.script && (
						scene.script.map((s: any, key: number) => (
							<div key={key} className="font-family-bellefair font-medium-2 text-center">
								<div className="h-2 text-bold-600 text-capitalize">
									<span className={classnames("px-1",{"bg-yellow" : s.character === activeCharacterName})}>
										{s.character}
									</span>
								</div>
								<p className={classnames("", {
									'text-italic': s.type === 'def'
								})}>
									{s.type === 'def' && ('(')}
									{s.text &&
									s.text.split(' ').map((w: string, wi: number) =>
									w.trim().length > 0 && (scene.props.filter((p: any) => p.def === w.toLowerCase())[0]
											? (
												<span key={wi} className="display-inline-block">&nbsp; <code>{w}</code></span>
											)
											: (
												<span key={wi} className="display-inline-block">&nbsp;{w}</span>
											)
									))}
									{s.type === 'def' && (' )')}
								</p>
							</div>
						)))}
				</ModalBody>
			</Modal>
		</div>
	)
}

export const TeamControl: React.FunctionComponent = ({ suppliers, shootingDays, activeDay, activeEvent }) => {
	const dispatch = useDispatch();
	const [isPopupOpen, setIsPopupOpen] =  React.useState(false);

	let employees: Array = [];
	suppliers.filter(suppliers => suppliers.supplier_category !== 'Actors').forEach(item => {
		employees = [...employees, ...item.suppliers.default]
	});

	const shootingDaySuppliers = shootingDays.filter(sd => sd.id === activeDay.id)[0].suppliers;

	const selectSupplier = supplier_id => {
		const isSelected = shootingDaySuppliers && shootingDaySuppliers.includes(supplier_id);
		let updatedSuppliers = [];
		let updatedEmployees = [];
		const selectedEmployee = employees.find(employee => employee.id === supplier_id)

		if (!isSelected) {
			dispatch({
				type: ShootingDaysActionTypes.SET_SHOOTING_DAY_SUPPLIRES,
				payload: {
					shootingDayId: activeDay.id,
					supplier_id
				}
			});
			dispatch({
				type: ShootingDaysActionTypes.SET_SHOOTING_DAY_EMPLOYEES,
				payload: {
					shootingDayId: activeDay.id,
					selectedEmployee,
				}
			});
			updatedSuppliers = [...activeDay.suppliers, supplier_id]
			updatedEmployees = activeDay?.employees
				? [...activeDay.employees, selectedEmployee]
				: [selectedEmployee]
		} else {
			dispatch({
				type: ShootingDaysActionTypes.DELETE_SHOOTING_DAY_SUPPLIRES,
				payload: {
					shootingDayId: activeDay.id,
					supplier_id
				}
			});
			dispatch({
				type: ShootingDaysActionTypes.DELETE_SHOOTING_DAY_EMPLOYEES,
				payload: {
					shootingDayId: activeDay.id,
					employee_id: selectedEmployee.id
				}
			});
			updatedSuppliers = activeDay.suppliers.filter(supplierId => supplierId !== supplier_id)
		}

		addShootingDay({
			project_id: activeEvent.id,
			project_shooting_day_id: activeDay.id,
			suppliers: updatedSuppliers,
			employees: updatedEmployees,
			add_suppliers_to_all_following_days: 1,
		})
	};

	return (
		<div className="tasks-team-control">
			<div
				className="tasks-team-control__icon"
				onClick={() => setIsPopupOpen(!isPopupOpen)}
			>
				<Icon
					src="../../assets/icons/navbar/team.svg"
					className="tasks-team-control__icon"
				/>
			</div>

			<Popup
				multiple
				isOpen={isPopupOpen}
				onClick={(): void => {
					return;
				}}
				className="tasks-team-control__dropdown p-1"
				selected={null}
				onOutsideClick={(): void => {
					setIsPopupOpen(false);
				}}
			>
				{!!activeDay.employees.length && (
					<div
						className="position-absolute position-right-1 cursor-pointer"
						onClick={() => {
							const employeesEmails = activeDay.employees.map(employee => employee.email).join(',');
							window.location.href = `mailto:?cc=${employeesEmails}&subject=Subject&body=message%20goes%20here`
						}}
					>
						<Mail/>
					</div>
				)}
				<div className="row w-100">
					{suppliers && suppliers
					.filter(supplierCategory => supplierCategory.supplier_category !== 'Actors')
					.map(supplierCategory => (
						<div className="col tasks-team-control">
							<h4 className="ml-1" style={{color: supplierCategory.color}}>
								{supplierCategory.supplier_category}
							</h4>
							<div>
								{supplierCategory.suppliers &&
								supplierCategory.suppliers.default &&
								supplierCategory.suppliers.default.map(supplier => {
									const isSelected = shootingDaySuppliers && shootingDaySuppliers.includes(supplier.supplier_id);
									let actorsCharacters = [];
										supplier.characters &&
										supplier.characters.forEach(character => {
											actorsCharacters.push(character.character_name)
										});

									return (
										<div
											className="c-popup__item d-flex"
											onClick={() => selectSupplier(supplier.supplier_id)}
										>
											{isSelected ? <Check /> : null}
											<div>
												<div>{supplier.supplier_name}</div>
												<small className="opacity-05">
													({supplier.supplier_category === 'Actors'
														? actorsCharacters.toString()
														: supplier.supplier_job_title
													})
												</small>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					))}
				</div>
			</Popup>
		</div>
	)
};

export const Tasks: React.FunctionComponent = () => {
	const users = useSelector((state: RootStore) => state.users);
	const user = users.find((user: UserInterface) => user.active);
	const dispatch = useDispatch();
	const events = useSelector((state: RootStore) => state.events);
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const characters = useSelector((state: RootStore) => state.characters);
	const suppliers = useSelector((state: RootStore) => state.suppliers);
	const shootingDays = useSelector((state: RootStore) => state.shootingDays);
	const [characterView, setCharacterView] =  React.useState(false);
	const [shootingDayView, setShootingDayView] =  React.useState(false);
	const [locationsView, setLocationsView] =  React.useState(false);
	const [activeTagPopoverId, setActiveTagPopoverId] = React.useState();

	const shootingDaysWithNumbers = shootingDays.map((shootingDay, index) => ({
		...shootingDay,
		dayNumber: index + 1,
	}));

	const daysForCharacters = (shootingDays, characterId) => shootingDays.filter(shootingDay => shootingDay.characters.find(character => character.character_id === characterId));

	const activeCharacter = characters.filter(character => character.active === true)[0];

	const activeDay = shootingDays.filter(shootingDay => shootingDay.active === true)[0];

	const uniqTotalScenes = activeDay && [...new Map(activeDay.shooting_day.total_scenes.map(item => [item.scene_id, item])).values()];

	let propsFromAllScenes = [];
	uniqTotalScenes &&
	uniqTotalScenes.forEach(scene => {
		if (scene.props.length) {
			propsFromAllScenes.push({
				chapterNumber: scene.chapter_number,
				sceneNumber: scene.scene_number,
				sceneId: scene.scene_id,
				props: scene.props
			})
		}
	});

	let clothesFromAllScenes = [];
	uniqTotalScenes &&
	uniqTotalScenes.forEach(scene => {
		if (scene.clothes.length) {
			clothesFromAllScenes.push({
				chapterNumber: scene.chapter_number,
				sceneNumber: scene.scene_number,
				sceneId: scene.scene_id,
				clothes: scene.clothes
			})
		}
	});

	let makeupsFromAllScenes = [];
	uniqTotalScenes &&
	uniqTotalScenes.forEach(scene => {
		if (scene.makeups.length) {
			makeupsFromAllScenes.push({
				chapterNumber: scene.chapter_number,
				sceneNumber: scene.scene_number,
				sceneId: scene.scene_id,
				makeups: scene.makeups
			})
		}
	});

	const handleCallsheetTableChange = (sceneId, field, propIndex, rowIndex, patchObj) => {
		dispatch({
			type: ShootingDaysActionTypes.UPDATE_SCENE_TASKS_INFO,
			payload: {
				shootingDayId: activeDay.id,
				sceneId,
				propIndex,
				field,
				rowIndex,
				patchObj,
			}
		})
	}

	const handleCallsheetTableAdd = (sceneId, field, propIndex) => {
		dispatch({
			type: ShootingDaysActionTypes.ADD_SCENE_TASKS_INFO_ROW,
			payload: {
				shootingDayId: activeDay.id,
				sceneId,
				propIndex,
				field,
			}
		})
	}

	const handleCallsheetTableDeleteRow = (sceneId, field, propIndex, rowIndex) => {
		dispatch({
			type: ShootingDaysActionTypes.DELETE_SCENE_TASKS_INFO_ROW,
			payload: {
				shootingDayId: activeDay.id,
				sceneId,
				propIndex,
				field,
				rowIndex,
			}
		})
	}

	const handleCallsheetPopupClose = () => {
		setActiveTagPopoverId(null);
	};

	const formatDef = def => def.replace(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");

	const getUniqueSceneNames = scenes => {
		if ( !scenes || !scenes.length) return;

		const uniqueSceneNames = new Set();
		for (const scene of scenes) {
			uniqueSceneNames.add(scene.name)
		}
		return Array.from(uniqueSceneNames);
	};

	return (
		<div className="p-2">
			<div>
				{activeDay && shootingDayView && (
				<div>
					<div className="d-flex justify-content-between mb-3">
						<h2>
							<small className="opacity-05 mr-05">{activeDay.dayNumber}.</small>
							{activeDay.date ? moment(activeDay.date).format('D MMMM') : 'No date'}
						</h2>
						<TeamControl
							activeEvent={activeEvent}
							activeDay={activeDay}
							shootingDays={shootingDays}
							suppliers={suppliers}
						/>
					</div>
					<div className="mb-3">
						<div className="row align-items-center mb-2">
							<div className="col">
								<h3 style={{color: '#6236ff'}}>Props</h3>
							</div>
						</div>
						{propsFromAllScenes.length
							?
							propsFromAllScenes.map((propItem, index) => (
								<div key={index} className="row mb-2">
									<div className="col-1 p-05 text-right">
										{propItem.sceneId}
									</div>
									<div className="col-10" style={{background: '#F2F4F6'}}>
										<div className="d-flex flex-wrap">
										{propItem.props && propItem.props.map((prop, index) => (
											<div
												id={`propId-${formatDef(prop.def)}-${propItem.sceneId}-${index}`}
												onClick={() => setActiveTagPopoverId(`propId-${formatDef(prop.def)}-${propItem.sceneId}-${index}`)}
												key={index}
												className="tasks__task-item width-100 p-05 d-flex align-items-center"
											>
												<CallsheetPropPopover
													target={`propId-${formatDef(prop.def)}-${propItem.sceneId}-${index}`}
													isOpen={activeTagPopoverId === `propId-${formatDef(prop.def)}-${propItem.sceneId}-${index}`}
													prop={prop}
													propIndex={index}
													onChange={(patchObj, rowIndex) => handleCallsheetTableChange(propItem.sceneId, 'props', index, rowIndex, patchObj)}
													onDelete={(rowIndex) => handleCallsheetTableDeleteRow(propItem.sceneId, 'props', index, rowIndex)}
													onAdd={() => handleCallsheetTableAdd(propItem.sceneId, 'props', index)}
													onClose={handleCallsheetPopupClose}
													onBlur={() => {
														let scene = {
															chapter_number: propItem.chapterNumber,
															project_id: activeEvent.id,
															props: propItem.props,
															scene_number: propItem.sceneNumber,
														};

														addScene(scene);
													}}
												/>

												<small className="opacity-05 mr-05">{index + 1}.</small> {prop.def}
												<div
													className="ml-1 tasks__task-item-delete"
													onClick={()=>{
														let scene = {
															chapter_number: propItem.chapterNumber,
															project_id: activeEvent.id,
															props: propItem.props.filter(item => item.def !== prop.def),
															scene_number: propItem.sceneNumber,
														};

														addScene(scene);

														dispatch({
															type: ShootingDaysActionTypes.REMOVE_SCENE_TASK,
															payload: {
																shootingDayId: activeDay.id,
																value: prop.def,
																sceneId: propItem.sceneId,
																field: 'props',
															}
														});
													}}
												>
													<XCircle
														className="n-btn-delete"
														size={20}
													/>
												</div>
											</div>
										))}
											<AddTaskControl
												propItem={propItem}
												activeDay={activeDay}
												activeEvent={activeEvent}
												fieldName="props"
											/>
										</div>
									</div>
								</div>
							))
							: null
						}
						<CreateNewTask
							tasksFromAllScenes={propsFromAllScenes}
							activeDay={activeDay && activeDay}
							activeEvent={activeEvent}
							fieldName="props"
						/>
					</div>
					<div className="mb-3">
						<div className="row align-items-center mb-2">
							<div className="col">
								<h3 style={{color: '#b620e0'}}>Clothes</h3>
							</div>
						</div>
						{clothesFromAllScenes.length
							?
							clothesFromAllScenes.map((clothesItem, i) => (
								<div key={i} className="row mb-2">
									<div className="col-1 p-05 text-right">
										{clothesItem.sceneId}
									</div>
									<div className="col-10" style={{background: '#F2F4F6'}}>
										<div className="d-flex flex-wrap">
											{clothesItem.clothes && clothesItem.clothes.map((cloth, index) => (
												<div
													className="tasks__task-item width-100 p-05 d-flex align-items-center"
													key={index}
													id={`clothId-${formatDef(cloth.def)}-${clothesItem.sceneId}-${index}`}
													onClick={() => setActiveTagPopoverId(`clothId-${formatDef(cloth.def)}-${clothesItem.sceneId}-${index}`)}
												>
													<CallsheetPropPopover
														target={`clothId-${formatDef(cloth.def)}-${clothesItem.sceneId}-${index}`}
														isOpen={activeTagPopoverId === `clothId-${formatDef(cloth.def)}-${clothesItem.sceneId}-${index}`}
														prop={cloth}
														propIndex={index}
														onChange={(patchObj, rowIndex) => handleCallsheetTableChange(clothesItem.sceneId, 'clothes', index, rowIndex, patchObj)}
														onDelete={(rowIndex) => handleCallsheetTableDeleteRow(clothesItem.sceneId, 'clothes', index, rowIndex)}
														onAdd={() => handleCallsheetTableAdd(clothesItem.sceneId, 'clothes', index)}
														onClose={handleCallsheetPopupClose}
														onBlur={() => {
															let scene = {
																chapter_number: clothesItem.chapterNumber,
																project_id: activeEvent.id,
																props: clothesItem.props,
																scene_number: clothesItem.sceneNumber,
															};

															addScene(scene);
														}}
													/>
													{index + 1}. {cloth.def}
													<div
														className="ml-1 tasks__task-item-delete"
														onClick={()=>{
															let scene = {
																chapter_number: clothesItem.chapterNumber,
																project_id: activeEvent.id,
																clothes: clothesItem.clothes.filter(item => item.def !== cloth.def),
																scene_number: clothesItem.sceneNumber,
															};
															addScene(scene);

															dispatch({
																type: ShootingDaysActionTypes.REMOVE_SCENE_TASK,
																payload: {
																	shootingDayId: activeDay.id,
																	value: cloth.def,
																	sceneId: clothesItem.sceneId,
																	field: 'clothes',
																}
															});
														}}
													>
														<XCircle
															className="n-btn-delete"
															size={20}
														/>
													</div>
												</div>
											))}
											<AddTaskControl
												propItem={clothesItem}
												activeDay={activeDay}
												activeEvent={activeEvent}
												fieldName="clothes"
											/>
										</div>
									</div>
								</div>
							))
							: null
						}
						<CreateNewTask
							tasksFromAllScenes={clothesFromAllScenes}
							activeDay={activeDay && activeDay}
							activeEvent={activeEvent}
							fieldName="clothes"
						/>
					</div>
					<div className="mb-3">
						<div className="row align-items-center mb-2">
							<div className="col">
								<h3 style={{color: '#0091ff'}}>Makeup</h3>
							</div>
						</div>
						{makeupsFromAllScenes.length
							?
							makeupsFromAllScenes.map((makeupItem, index) => (
								<div key={index} className="row mb-2">
									<div className="col-1 p-05 text-right">
										{makeupItem.sceneId}
									</div>
									<div className="col-10" style={{background: '#F2F4F6'}}>
										<div className="row">
											{makeupItem.makeups && makeupItem.makeups.map((makeup, index) => (
												<div
													className="tasks__task-item width-100 p-05 d-flex align-items-center"
													key={index}
													id={`makeupId-${formatDef(makeup.def)}-${makeupItem.sceneId}-${index}`}
													onClick={() => setActiveTagPopoverId(`makeupId-${formatDef(makeup.def)}-${makeupItem.sceneId}-${index}`)}
													>
													<CallsheetPropPopover
														target={`makeupId-${formatDef(makeup.def)}-${makeupItem.sceneId}-${index}`}
														isOpen={activeTagPopoverId === `makeupId-${formatDef(makeup.def)}-${makeupItem.sceneId}-${index}`}
														prop={makeup}
														propIndex={index}
														onChange={(patchObj, rowIndex) => handleCallsheetTableChange(makeupItem.sceneId, 'makeups', index, rowIndex, patchObj)}
														onDelete={(rowIndex) => handleCallsheetTableDeleteRow(makeupItem.sceneId, 'makeups', index, rowIndex)}
														onAdd={() => handleCallsheetTableAdd(makeupItem.sceneId, 'makeups', index)}
														onClose={handleCallsheetPopupClose}
														onBlur={() => {
															let scene = {
																chapter_number: makeupItem.chapterNumber,
																project_id: activeEvent.id,
																props: makeupItem.props,
																scene_number: makeupItem.sceneNumber,
															};

															addScene(scene);
														}}
													/>
													{index + 1}. {makeup.def}
													<div
														className="ml-1 tasks__task-item-delete"
														onClick={()=>{
															let scene = {
																chapter_number: makeupItem.chapterNumber,
																project_id: activeEvent.id,
																makeups: makeupItem.makeups.filter(item => item.def !== makeup.def),
																scene_number: makeupItem.sceneNumber,
															};
															addScene(scene);

															dispatch({
																type: ShootingDaysActionTypes.REMOVE_SCENE_TASK,
																payload: {
																	shootingDayId: activeDay.id,
																	value: makeup.def,
																	sceneId: makeupItem.sceneId,
																	field: 'makeups',
																}
															});
														}}
													>
														<XCircle
															className="n-btn-delete"
															size={20}
														/>
													</div>
												</div>
											))}
											<AddTaskControl
												propItem={makeupItem}
												activeDay={activeDay}
												activeEvent={activeEvent}
												fieldName="makeups"
											/>
										</div>
									</div>
								</div>
							))
							: null
						}
						<CreateNewTask
							tasksFromAllScenes={makeupsFromAllScenes}
							activeDay={activeDay && activeDay}
							activeEvent={activeEvent}
							fieldName="makeups"
						/>
					</div>
				</div>
				)}
			</div>

			<div>
				{activeCharacter && characterView && (
					<h2 className="text-capitalize mb-4">{activeCharacter.character_name}</h2>
				)}
				{activeCharacter && characterView &&
				daysForCharacters(shootingDaysWithNumbers, activeCharacter.character_id).map((shootingDay, shootingDayKey) => {
					const scenesForCharacter = shootingDay.shooting_day.total_scenes.filter(scene => scene.characters.find(character => character.character_id === activeCharacter.character_id));

					return (
						<div key={shootingDayKey} className="mb-4">
							<h3 className="mb-2">
								<small className="opacity-05 mr-05">{shootingDay.dayNumber}.</small>
								{shootingDay.date ? moment(shootingDay.date).format('D MMMM') : 'No date'}
							</h3>
							{scenesForCharacter.map((scene, sceneKey) => (
								<div key={sceneKey} className="row mb-2">
									<div className="col-1 p-05 text-right">
										{scene.scene_id}
									</div>
									<div className="col-10 d-flex align-items-center" style={{background: '#F2F4F6'}}>
										<ScriptModal
											scene={scene}
											activeCharacterName={activeCharacter.character_name}
										/>
									</div>
								</div>
							))}
						</div>
					)
				})}
			</div>

			<div>
				{locationsView && shootingDaysWithNumbers && (
					<LocationsTab/>
				)}
			</div>

			<TasksNav
				setDayView={() => {
					setShootingDayView(true);
					setLocationsView(false);
					setCharacterView(false);
				}}
				setCharacterView={() => {
					setCharacterView(true);
					setLocationsView(false);
					setShootingDayView(false);
				}}
				setLocationsView={() => {
					setLocationsView(true);
					setCharacterView(false);
					setShootingDayView(false);
				}}
			/>
		</div>
	);
};

export default Tasks;
