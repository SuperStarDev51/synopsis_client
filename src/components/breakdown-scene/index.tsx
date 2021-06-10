import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { shallowEqual, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import classnames from 'classnames';
import { ChevronDown, ArrowUp, PlusCircle, XCircle } from "react-feather"
import { eighthsFormat, SupplierWithJob } from '../../helpers/helpers';
import Select from "react-select"
import * as moment from 'moment';
import { Menu, MenuItem, Divider, Slide } from '@material-ui/core';

import {
	Card,
	CardHeader,
	Col,
	CardBody,
	Collapse,
	InputGroup,
	InputGroupText,
	InputGroupAddon,
	Input,
	Row,
	Button,
} from "reactstrap"
import {
	Droppable,
	Draggable,
	DraggableProvided,
	DragDropContext,
	DropResult,
	DroppableProvided,
} from 'react-beautiful-dnd';
import { TextareaCounter } from "@extensions"
import Popup from '../popup';
import { SceneRow } from '@components';
import Chip from "@vuexy/chips/ChipComponent"
import { useIntl, FormattedMessage } from "react-intl"
import { useSelector } from 'react-redux';
import { Icon } from '@components';
import { config } from '../../config';
import { setSceneParameter } from "@root/src/redux/actions/scenes-breakdown";
import { ShootingDaysActionTypes } from "@root/src/containers/shooting_days/enums";
import { addCharacter, addScene, deleteCharacter } from "@root/src/containers/scripts/initial-state";
import { ScriptsActionTypes } from "@root/src/containers/scripts/enums";
import { addShootingDay } from "@root/src/containers/shooting_days/initial-state";
import { MoveToShootingDay } from "@root/src/components/breakdown-scene/MoveToShootingDay";
import { SceneTimeInput } from "@root/src/components/breakdown-scene/SceneTimeInput";
import { Settings } from "@root/src/components/breakdown-scene/Settings";
import './index.scss';

export const removePunctuation = (word: string) => { return word; return word.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") }
interface Props {
	readonly sd: any
	readonly sdId: any
	readonly scene: any
	readonly isListPreview: boolean
	readonly scene_index: number;
	readonly script_index: number;
	readonly isCollapsed?: boolean;
	readonly onDragEnd: (result: DropResult) => void;
	readonly changeScenePropValue: (value: any, field: string, chapter_number: number, scene_index: number, script_index: number, scene_time_id: number) => void;
	readonly changeScenePropValueDB: (value: any, field: string, scene_number: number, chapter_number: number) => void;
	readonly addNewProp: (chapter_number: number, scene_index: number, type: string, scene: any, defaultValue?: string) => void;
}

interface TasksInputProps {
	readonly scene: any
	readonly field: any
	readonly activeEvent: any
	readonly sdId: any
	readonly changeScenePropValue: any
}

export const TasksInput: React.FunctionComponent<TasksInputProps> = (props: TasksInputProps) => {
	const dispatch = useDispatch();
	const { scene, field, activeEvent, sdId, isOthers, otherItemId, changeScenePropValue } = props;
	const [tasksInputValue, setTasksInputValue] = React.useState('');

	const handleDeleteOtherTaskCategory = () => {
		let sceneData = {
			chapter_number: scene.chapter_number,
			project_id: activeEvent.id,
			others: scene.others.filter(item => item.id !== otherItemId),
			scene_number: scene.scene_number,
			modify_all_scenes: 1,
		};
		addScene(sceneData);

		let updatedScene = scene.others.filter(item => item.id !== otherItemId)
		changeScenePropValue(updatedScene, 'others', scene.scene_id, true);
	};

	const handleAddTaskClick = () => {
		if (!isOthers) {
			//Adding task to Prop/Clothes/Makeup

			let sceneData = {
				chapter_number: scene.chapter_number,
				project_id: activeEvent.id,
				[field.name]: [...scene[field.name], { def: tasksInputValue, comments: "", supplier_id: null, supplier_name: "" }],
				scene_number: scene.scene_number,
			};
			addScene(sceneData);

			let updatedField = [...scene[field.name], { def: tasksInputValue, comments: "", supplier_id: null, supplier_name: "" }]

			tasksInputValue !== '' &&
				changeScenePropValue(updatedField, [field.name], scene.scene_id);
		} else {

			//Adding task to Others

			let sceneData = {
				chapter_number: scene.chapter_number,
				project_id: activeEvent.id,
				others: scene.others.map(item => {
					if (item.name !== field) {
						return item;
					}
					return {
						...item,
						tasks: [
							...item.tasks,
							{ def: tasksInputValue, comments: "", supplier_id: null, supplier_name: "" }
						]
					}
				}),
				scene_number: scene.scene_number,
			};
			addScene(sceneData);

			let updatedOthers = scene.others.map(item => {
				if (item.name !== field) {
					return item;
				}
				return {
					...item,
					tasks: [
						...item.tasks,
						{ def: tasksInputValue, comments: "", supplier_id: null, supplier_name: "" }
					]
				}
			});

			tasksInputValue !== '' &&
				changeScenePropValue(updatedOthers, 'others', scene.scene_id);
		}

		setTasksInputValue('');
	};

	const keydownHandler = e => {
		if (e.keyCode === 13) {
			handleAddTaskClick();
			e.target.blur();
		}
	};

	React.useEffect(() => {
		document.addEventListener('keydown', keydownHandler);
		return () => {
			document.removeEventListener('keydown', keydownHandler);
		};
	});

	return (
		<div className="d-flex flex-grow-1 task-category-input">
			<input
				type="text"
				value={tasksInputValue}
				style={{ height: '2rem' }}
				className="form-control ml-05 mr-05"
				onChange={e => setTasksInputValue(e.target.value)}
			/>
			<button
				className="btn btn-secondary p-05"
				onClick={handleAddTaskClick}
			>+</button>
			{isOthers
				? (
					<XCircle
						className="n-btn-delete"
						size={20}
						onClick={handleDeleteOtherTaskCategory}
					/>
				) : null
			}
		</div>
	)
};

export const AddNewTaskCategory: React.FunctionComponent<any> = ({ scene, activeEvent, sdId, changeScenePropValue }) => {
	const [taskCategoryName, setTaskCategoryName] = React.useState('');
	const [inputIsVisible, setInputIsVisible] = React.useState(false);
	const dispatch = useDispatch();

	const handleAddCategoryClick = () => {
		if (taskCategoryName === '') return;
		const taskCategoryId = uuidv4();

		let sceneData = {
			modify_all_scenes: 1,
			chapter_number: scene.chapter_number,
			project_id: activeEvent.id,
			scene_number: scene.scene_number,
			scene_id: scene.scene_id,
			others: [
				...scene.others,
				{
					id: taskCategoryId,
					name: taskCategoryName,
					tasks: [],
				}
			],
		};
		addScene(sceneData);

		let updatedOthers = [
			...scene.others,
			{
				id: taskCategoryId,
				name: taskCategoryName,
				tasks: [],
			}
		]

		changeScenePropValue(updatedOthers, 'others', scene.scene_id, true);

		setTaskCategoryName('');
		setInputIsVisible(false);
	};

	const keydownHandler = e => {
		if (e.keyCode === 13) {
			handleAddCategoryClick();
		}
	};

	React.useEffect(() => {
		document.addEventListener('keydown', keydownHandler);
		return () => {
			document.removeEventListener('keydown', keydownHandler);
		};
	});

	return (
		<div>
			{inputIsVisible &&
				<div>
					<input
						type="text"
						placeholder="Task category name"
						value={taskCategoryName}
						style={{ height: '2rem' }}
						className="form-control mb-05"
						onChange={e => setTaskCategoryName(e.target.value)}
					/>
					<button
						className="btn btn-secondary p-05 w-100"
						onClick={handleAddCategoryClick}
					>
						+ Add
				</button>
				</div>
			}

			<button
				className="btn opacity-08 p-0"
				style={{ display: inputIsVisible ? 'none' : 'block' }}
				onClick={() => setInputIsVisible(true)}
			>
				+ Add new task category
			</button>
		</div>
	)
};

export const AddNewCharacter: React.FunctionComponent<any> = ({ scene, scene_index, activeEvent, sd, changeScenePropValue, isSupport }) => {
	const characters = useSelector((state: RootStore) => state.characters);
	const occupiedIds = [];
	scene && scene.characters && scene.characters.forEach(ch => {
		occupiedIds.push(ch.character_id);
	});

	const availableCharacters = characters && characters.filter(item => !occupiedIds.includes(item.character_id));

	const dispatch = useDispatch();

	const [characterName, setCharacterName] = React.useState('');
	const [inputIsVisible, setInputIsVisible] = React.useState(false);
	const [existingCharacterId, setExistingCharacterId] = React.useState('');

	const handleAddCharacterClick = async () => {
		if (characterName === '') return;

		let newCharacter = {
			character_type: isSupport ? 1 : 0,
			project_id: activeEvent.id,
			character_name: characterName,
			project_scene_id: scene.project_scene_id,
		};

		let addedCharacter = await addCharacter(newCharacter);

		if (addedCharacter) {
			const updatedCharacters = [...scene.characters, addedCharacter.character];

			changeScenePropValue(updatedCharacters, 'characters', scene.scene_id);
			setCharacterName('');
			setInputIsVisible(false);
		}
	};

	const keydownHandler = e => {
		if (e.keyCode === 13) {
			handleAddCharacterClick();
		}
	};

	React.useEffect(() => {
		document.addEventListener('keydown', keydownHandler);
		return () => {
			document.removeEventListener('keydown', keydownHandler);
		};
	});

	return (
		<div>
			<div className="d-flex mt-1">
				<select
					className="form-control width-150 mr-05"
					value={existingCharacterId}
					onChange={e => setExistingCharacterId(e.target.value)}
				>
					<option value="">Select character</option>
					{availableCharacters.map(character => (
						<option value={character.character_id}>{character.character_name}</option>
					))}
				</select>
				<button
					className="btn btn-secondary p-05"
					onClick={() => {
						let newCharacter = {
							character_type: isSupport ? 1 : 0,
							project_id: activeEvent.id,
							character_id: existingCharacterId,
							project_scene_id: scene.project_scene_id,
						};

						addCharacter(newCharacter);

						const updatedCharacters = [...scene.characters, {
							character_type: isSupport ? 1 : 0,
							project_id: activeEvent.id,
							character_id: existingCharacterId,
							character_name: availableCharacters.filter(ch => ch.character_id === parseInt(existingCharacterId))[0].character_name
						}];

						changeScenePropValue(updatedCharacters, 'characters', scene.scene_id);
						setExistingCharacterId('');
					}}
				>
					+ Add
				</button>
			</div>
			{inputIsVisible &&
				<div className="mt-1">
					<input
						type="text"
						placeholder="Character name"
						value={characterName}
						style={{ height: '2rem' }}
						className="form-control mb-05"
						onChange={e => setCharacterName(e.target.value)}
					/>
					<button
						className="btn btn-secondary p-05 w-100"
						onClick={handleAddCharacterClick}
					>
						+ Add
				</button>
				</div>
			}

			{!isSupport
				? <button
					className="btn opacity-08 pl-0"
					style={{ display: inputIsVisible ? 'none' : 'block' }}
					onClick={() => setInputIsVisible(true)}
				>
					+ Add new character
				</button>
				: null
			}

		</div>
	)
};

export const BreakDownScene: React.FunctionComponent<Props> = (props: Props) => {
	const { formatMessage } = useIntl();
	const { sd, sdId, scene, isListPreview, scene_index, script_index, addNewProp, onDragEnd, changeScenePropValue, changeScenePropValueDB, setReorerd } = props
	const characterState = useSelector((state: RootStore) => state.characters)
	let CharacterList = [...characterState]

	const [showDescription, setShowDescription] = React.useState<boolean>(false);
	const [rowExpanded, setRowExpanded] = React.useState<boolean>(false);
	// const [showAddCharacter, setShowAddCharacter] = React.useState<boolean>(false);
	// const [isTimePopupOpen, setIsTimePopupOpen] = React.useState<boolean>(false);
	// const [isLocationPopupOpen, setIsLocationPopupOpen] = React.useState<boolean>(false);
	const [addNewItemPreview, setAddNewItemPreview] = React.useState<any>(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	// const [isSceneCollapsed, setIsSceneCollapsed] = React.useState<any>(false);
	const [isCollapsed, setIsCollapsed] = React.useState<any>(props.isCollapsed);
	const activeEvent = useSelector((state: RootStore) => state.events.filter((event: any) => event.preview)[0], shallowEqual);
	const sceneTime = useSelector((state: RootStore) => state.sceneTime.filter(st => st.project_id == activeEvent.id), shallowEqual)
	const sceneLocation = useSelector((state: RootStore) => state.sceneLocation.filter(sl => sl.project_id == activeEvent.id), shallowEqual)
	

	if (!window.x) {
		let x = {};
	}

	x.Selector = {};
	x.Selector.getSelected = function () {
		let t = '';
		if (window.getSelection) {
			t = window.getSelection();
		} else if (document.getSelection) {
			t = document.getSelection();
		} else if (document.selection) {
			t = document.selection.createRange().text;
		}
		return t;
	}

	// console.log(activeEvent, sceneTime, sceneLocation);
	// const [isSceneTimeOpen, setIsSceneTimeOpen] = React.useState<boolean>(false);

	// const allSuppliers = useSelector((state: RootStore) => state.suppliers)
	// const suppliersRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex != 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	// const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	// const ActorsRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex == 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	// const actors = Array.prototype.concat.apply([], ActorsRootStore);

	// let scene_duration = scene && scene.prepare ? Number(scene.prepare) : 0

	// React.useEffect(() => { setShowDescription(false) }, [scene])
	/* eslint-disable @typescript-eslint/no-non-null-assertion */

	/*top list view is the squar scene breakdown*/
	const topListView = (
		/*container for scene name and duration (shooting day schedule*/
		<div className={classnames("breakdownscene-location-name text-bold-700 text-blue5 font-medium-2 text-bold justify-content-center px-1 d-flex-column align-items-center justify-content-center text-align-left", {})}>
			<div className="d-flex align-items-center">
				{sdId ? (
					<div className="mr-1" >
						{moment(scene.timeStart).format('HH:mm') + '-' + moment(scene.timeEnd).format('HH:mm')}
						{/*<SceneTimeInput*/}
						{/*value={scene.timeStart}*/}
						{/*timepickerChangeValue={(value) => {*/}
						{/*const isoTimeString = moment(`1970-01-01 ${value}`, 'YYYY-MM-DD hh:mm').toISOString();*/}

						{/*changeScenePropValueDB(isoTimeString, 'timeStart', scene.scene_number, scene.chapter_number)*/}
						{/*changeScenePropValue(isoTimeString, 'timeStart', scene.scene_id)*/}
						{/*}}*/}
						{/*/>*/}
						{/*-&nbsp;*/}
						{/*<SceneTimeInput*/}
						{/*value={scene.timeEnd}*/}
						{/*timepickerChangeValue={(value) => {*/}
						{/*const isoTimeString = moment(`1970-01-01 ${value}`, 'YYYY-MM-DD hh:mm').toISOString();*/}

						{/*changeScenePropValueDB(isoTimeString, 'timeEnd', scene.scene_number, scene.chapter_number)*/}
						{/*changeScenePropValue(isoTimeString, 'timeEnd', scene.scene_id)*/}
						{/*}}*/}
						{/*/>*/}
					</div>
				) : null}
				{/*clock icon + time duration*/}
				<div className="d-flex align-items-center">
					<Icon src={config.iconsPath + "script/duration.svg"} style={{ height: '1rem', width: '1rem', flex: '1 0 auto' }} className="mr-05" />
					<input
						type="number"
						className="text-center form-control breakdown-scene__duration-input"
						style={{height: '2rem'}}
						value={scene.scene_duration}
						min="0" max="100"
						onBlur={
							e => changeScenePropValueDB(e.target.value, 'scene_duration', scene.scene_number, scene.chapter_number)
						}
						onChange={
							e => changeScenePropValue(e.target.value, 'scene_duration', scene.scene_id)
						}
					/>
				</div>
			</div>
			{/*scene name*/}
			<div className="mt-05 font-medium-2 text-align-left">{scene.name}</div>
		</div>
	)
	const top = (withoutSceneName?: boolean) => (
		/*episode numbering info*/
		<>
			<Row className={classnames("breakdown-scene__time-location d-flex align-items-center mr-auto text-bold-700", {
				'ml-0': withoutSceneName || !isListPreview,
				'row-reverse': withoutSceneName,
			})} >

				<div className={classnames({ 'd-flex': !isListPreview })}>
					<div className={classnames('text-left', { 'ml-05': !isListPreview })}>
						{scene.scene_id ? scene.scene_id : `${scene.chapter_number}${scene.scene_number < 10 && ('0')}${scene.scene_number}`}
					</div>
					{!isListPreview
						? (
							<div>
								<div
									className={classnames('breakdown-scene-eighth', { 'ml-05': !isListPreview })}
								>
									{eighthsFormat(scene.eighth)}
									&nbsp;
								{scene.scene_duration > 0
										? (
											<span>
												&#40;
												<Icon src={config.iconsPath + "script/duration_black.svg"} style={{ height: '.7rem', width: '.7rem' }} className="d-inline-block" />
												&nbsp;
											{scene.scene_duration}
												&#41;
											</span>
										)
										: null
									}
								</div>
							</div>
						) : null
					}
				</div>
				{/* {isListPreview ?
			 <div className="mx-auto text-center flex-column">
			 {!withoutSceneName && (<div className="font-medium-2 text-blue5">{scene.name}</div> )}
			 </div>: */}
				{/*{!isListPreview && (<>*/}
				{/*<Col className="d-flex align-items-center justify-content-center text-bold-700 text-blue5">*/}
				{/*<Icon src={config.iconsPath + "script/duration.svg"} style={{ height: '1rem', width: '1rem' }} className="mr-05" />*/}
				{/*{scene_duration > 0 ? scene_duration : 0}*/}
				{/*<div className="ml-05">*/}
				{/*{moment(scene.timeStart).format('HH:mm') + '-' + moment(scene.timeEnd).format('HH:mm')}*/}
				{/*</div>*/}
				{/*</Col>*/}
				{/*</>*/}
				{/*)}*/}

				<div className={classnames("position-relative d-flex align-items-center p-0 ml-1 !", { 'my-05': !isListPreview })}>
					<select
						className="breakdown-scene__time-location-select"
						title={sceneTime.find((st: any) => scene.time && scene.time.toLowerCase() === st.scene_time.toLowerCase())?.scene_time}
						value={sceneTime.find((st: any) => scene.time && scene.time.toLowerCase() === st.scene_time.toLowerCase())?.scene_time}
						onChange={(e: any) => {
							const optionIndex = sceneTime.indexOf(sceneTime.find(item => item.scene_time === e.target.value));

							if (scene.time == e.target.value) return null;

							changeScenePropValueDB(e.target.value, 'time', scene.scene_number, scene.chapter_number)
							changeScenePropValue(e.target.value, 'time', scene.scene_id)
							//changeScenePropValueDB(index + 1, 'time_id', scene.scene_number, scene.chapter_number)
							changeScenePropValue(optionIndex + 1, 'time_id', scene.scene_id)
						}}
					>
						{sceneTime.map((st: any, sti: number) => {
							return <option>{st.scene_time}</option>;
						})}
					</select>
					&nbsp;/&nbsp;
					<select
						className="breakdown-scene__time-location-select"
						title={sceneLocation.find((sl: any) => scene?.location && scene?.location?.toLowerCase() === sl?.scene_location.toLowerCase())?.scene_location}
						value={sceneLocation.find((sl: any) => scene?.location && scene?.location?.toLowerCase() === sl?.scene_location.toLowerCase())?.scene_location}
						onChange={(e: any) => {
							if (scene.location == e.target.value) return null;
							changeScenePropValueDB(e.target.value, 'location', scene.scene_number, scene.chapter_number)
							changeScenePropValue(e.target.value, 'location', scene.scene_id)
						}}
					>
						{sceneLocation.map((sl: any) => {
							return <option>{sl.scene_location}</option>;
						})}
					</select>
				</div>
			</Row>
			{!isListPreview && (
				<div className="mx-auto text-center flex-column">
					<div className="breakdown-scene__name px-05 font-medium-2 text-bold-700 text-blue5">{scene.name}</div>
				</div>
			)}
		</>
	)

	const synofsis = (rows?: number, isRow?: boolean) => (
		<Col className={classnames('mt-05', {
			'px-1': !isRow,
			'px-0': isRow
		})} sm="12">
			<TextareaCounter
				isListPreview={isListPreview}
				onChange={changeScenePropValue}
				onBlur={changeScenePropValueDB}
				sceneId={scene.scene_id}
				script_index={script_index}
				scene_index={scene_index}
				scene_time={scene.time_id}
				value={scene.text}
				rows={rows ? rows : 3}
				scene_number={scene.scene_number}
				chapter_number={scene.chapter_number}
			// placeholder={formatMessage({id: 'write_somthing_here'})}
			/>
		</Col>

	)

	const script = (
		<div className="vx-collapse">
			{isListPreview && (<div className="text-bold-600 py-1 px-1"><FormattedMessage id={'script'} /></div>)}
			<Card 
				className={classnames("bg-transparent flex-column", {
					"collapse-collapsed": !showDescription || !isListPreview,
					"collapse-shown": showDescription || isListPreview,
				})}
				style= {{height:"730px", overflowY:'auto'}}
			>

				{!isListPreview && (
					<CardHeader className="justify-content-start py-1"
						onClick={() => setShowDescription(!showDescription)}>
						<div className="btn width-100-per bg-black  d-flex justify-content-center align-items-center text-white p-05">
							<div className="font-weight-bold"><FormattedMessage id='script' /></div>
							<ChevronDown size={20} className="collapse-icon accordion-icon-rotate" />
						</div>
					</CardHeader>
				)}
				<Collapse
					style={{ paddingBottom: '3rem' }}
					isOpen={showDescription || isListPreview}
				>
					<div
						onClick={
							() => { }
							// addNewItemPreview ? () => setAddNewItemPreview(false) : () => { }
						}
						className={classnames("bg-white mx-1 d-flex-column py-2 text-center px-2 overflow-auto", { 'height-300': !isListPreview })}>
						{scene && scene.script && (
							scene.script.map((s: any, key: number) => (
								<div key={key} className="font-family-bellefair font-medium-2">
									<div className="h-2 text-bold-600 text-capitalize">{s.character}</div>
									<div
										onMouseUp={() => {
											const selectedText = x.Selector.getSelected().toString();
											if (addNewItemPreview) {
												setAddNewItemPreview(false)
												setAnchorEl(null);
											} else {
												if (selectedText !== '') {
													setAddNewItemPreview(selectedText)
												}
											}
										}}
										className={classnames("brekdown-scene-script-text mb-1", { 'text-italic': s.type === 'def' })}>
										{
											s.type === 'def' && s.text !== ''
												? s.type === 'def' && s.text.includes('(') ? '' : ('(')
												: ''
										}
										{
											s.type === 'character' && s.def !== ''
												? <div>{s.def}</div>
												: ''
										}
										{s.text !== '' && (
											s.text.split(' ').map((w: string, wi: number) => {
												let allOtherTasks = [];
												scene.others.forEach(item => {
													allOtherTasks = [...allOtherTasks, ...item.tasks];
												});
												return (
													w.trim().length > 0 && (scene.props.filter((p: any) => p.def === w.toLowerCase())[0] ||
														addNewItemPreview == w ||
														scene.clothes.filter((p: any) => p.def === w.toLowerCase())[0] ||
														scene.makeups.filter((p: any) => p.def === w.toLowerCase())[0] ||
														scene.specials.filter((p: any) => p.def === w.toLowerCase())[0] ||
														allOtherTasks.filter((p: any) => p.def === w.toLowerCase())[0])
														? (
															<div
																className="display-inline-block"
																key={wi}
																aria-controls="simple-menu"
																aria-haspopup="true"
																onMouseUp={(event) => setAnchorEl(event.currentTarget)}
																onClick={(event) => {
																	setAnchorEl(event.currentTarget);
																}}
															>&nbsp;<code>{w}</code></div>)
														: (<div
															className="display-inline-block"
															key={wi}
															onMouseUp={(event) => setAnchorEl(event.currentTarget)}
															onClick={(event) => { setAddNewItemPreview(w); setAnchorEl(event.currentTarget); }}
														>&nbsp;{w}</div>)
												)
											}))}
										{
											s.type === 'def' && s.text !== ''
												? s.type === 'def' && s.text.includes(')') ? '' : (')')
												: ''
										}
									</div>
								</div>
							)))}
					</div>




					{/* <div className="position-absolute position-top-0 position-left-0">
					 <X onClick={()=>setAddNewItemPreview(false)} />
					 </div> */}
					<Menu
						id="simple-menu"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						anchorEl={anchorEl}
						open={addNewItemPreview}
						onClose={() => {
							setAddNewItemPreview(false);
							setAnchorEl(null);
						}}
						className="breakdown-scene-script-text-dropdown"
					>
						{/*['props', 'clothes', 'makeups', 'others']*/}
						{['props', 'clothes', 'makeups', 'specials'].map((field: string, key: number) => (
							<MenuItem
								key={key}
								className="breakdown-scene-script-text-dropdown__button"
								onClick={() => {
									const resetSelection = () => {
										setAddNewItemPreview(false);
										if (window.getSelection) {
											if (window.getSelection().empty) {
												window.getSelection().empty();
											} else if (window.getSelection().removeAllRanges) {
												window.getSelection().removeAllRanges();
											}
										} else if (document.selection) {
											document.selection.empty();
										}
									};

									let updatedProps = [
										...scene[field],
										{ def: removePunctuation(addNewItemPreview), comments: "", supplier_id: null, supplier_name: "" }
									];
									changeScenePropValue(updatedProps, field, scene.scene_id);
									changeScenePropValueDB(updatedProps, field, scene.scene_number, scene.chapter_number);
									resetSelection();
								}}
							>
								<FormattedMessage id={field} />
							</MenuItem>
						))}
						{scene.others.map((othersItem, key) => (
							<MenuItem
								key={key}
								className="breakdown-scene-script-text-dropdown__button"
								onClick={() => {
									const resetSelection = () => {
										setAddNewItemPreview(false);
										if (window.getSelection) {
											if (window.getSelection().empty) {
												window.getSelection().empty();
											} else if (window.getSelection().removeAllRanges) {
												window.getSelection().removeAllRanges();
											}
										} else if (document.selection) {
											document.selection.empty();
										}
									};

									let updatedOthers = scene.others.map(otherCategory => {
										if (otherCategory.id !== othersItem.id) {
											return otherCategory;
										}
										return {
											...otherCategory,
											tasks: [
												...otherCategory.tasks,
												{ def: removePunctuation(addNewItemPreview), comments: "", supplier_id: null, supplier_name: "" }
											]
										}
									});

									changeScenePropValue(updatedOthers, 'others', scene.scene_id);
									changeScenePropValueDB(updatedOthers, 'others', scene.scene_number, scene.chapter_number);
									resetSelection();
								}}
							>
								<span className="text-capitalize">{othersItem.name}</span>
							</MenuItem>
						))}
						<Settings resetSelection={() => {
							setAddNewItemPreview(false);
							if (window.getSelection) {
								if (window.getSelection().empty) {
									window.getSelection().empty();
								} else if (window.getSelection().removeAllRanges) {
									window.getSelection().removeAllRanges();
								}
							} else if (document.selection) {
								document.selection.empty();
							}
						}} />
					</Menu>

				</Collapse>
			</Card>

		</div>
	)
	const duration = (
		<div className="flex-column mt-3">
			<div className="text-bold-600 text-capitalize d-flex">
				<FormattedMessage id={'scene_duration'} />
				<Input
					style={{ padding: '0.1rem', marginTop: '-.7rem' }}
					className="width-15-per text-center ml-1"
					type="number"
					placeholder="0"
					value={scene['scene_duration']}
					min="0" max="100"
					onBlur={
						// e => changeScenePropValueDB(e.target.value, f + '_text', scene.scene_number, scene.chapter_number)
						e => changeScenePropValueDB(e.target.value, 'scene_duration', scene.scene_number, scene.chapter_number)
					}
					onChange={
						//e => changeScenePropValue(e.target.value, 'prepare', scene.chapter_number, scene_index, script_index, scene.time_id)
						e => changeScenePropValue(e.target.value, 'scene_duration', scene.scene_id)
					}
				/>
			</div>
			{/*{[*/}
			{/*'prepare',*/}
			{/*// 'one_shoot',*/}
			{/*// 'reshoots'*/}
			{/*].map((f: string, k: number) => (*/}
			{/*<div key={k} className="mb-1 d-flex align-items-center">*/}
			{/*<div className="pr-1 font-medium-1 text-capitalize">*/}
			{/*<FormattedMessage id={f} />*/}
			{/*</div>*/}
			{/*<Input style={{padding: '0.1rem'}} className="width-15-per text-center" type="number" placeholder="0" value={scene[f] || ''} min="0" max="100"*/}
			{/*onBlur={e => changeScenePropValueDB(e.target.value, f, scene.scene_number, scene.chapter_number)}*/}
			{/*onChange={e => changeScenePropValue(e.target.value, f, scene.chapter_number, scene_index, script_index, scene.time_id)}*/}
			{/*/>*/}
			{/*</div>*/}
			{/*))}*/}

			{['word', 'characters'].map((f: string, k: number) => (
				<div key={k} className="my-1 pr-1 font-medium-1 text-capitalize d-flex">
					<FormattedMessage id={f} />:&nbsp;
						{f === 'word'
						? <div className="d-inline-block">{scene[f + '_count']}</div>
						: <div className="d-inline-block">{scene.characters.length}</div>
					}
				</div>
			))}

			{/*<div className="my-1 d-flex">
				 <div className="pr-1 font-medium-1 text-capitalize text-bold-700">
				 <FormattedMessage id='total' />:
				 </div>
				 <div className="pr-1">
				 <div className="d-flex align-items-center font-medium-1 text-capitalize text-bold-700 svg-stroke-black">
				 <Icon src={config.iconsPath + "script/duration.svg"} style={{ height: '1rem', width: '1rem' }} className="mr-05" />
				 {scene_duration > 0 ? scene_duration : 0}
				 </div>
				 </div>
				 </div>*/}
		</div>
	)

	const onCharacterDragEnd = r => {
		const oldCharacterType = parseInt(r.source.droppableId);
		const newCharacterType = parseInt(r.destination.droppableId);
		const movingCharacter = scene.characters.filter(character => character.character_type === parseInt(oldCharacterType))[r.source.index];
		const updatedCharacters = scene.characters.map(item => {
			if (item.character_name !== movingCharacter.character_name) {
				return item;
			}
			return {
				...item,
				character_type: newCharacterType
			}
		})

		let updatedCharacter = {
			character_type: newCharacterType,
			project_id: activeEvent.id,
			character_id: movingCharacter.character_id,
			project_scene_id: scene.project_scene_id,
		};

		addCharacter(updatedCharacter);
		changeScenePropValue(updatedCharacters, 'characters', scene.scene_id);
	}

	//characters with drag and drop
	const characters = (
	<CardBody className="text-center pt-0 characters">
	<DragDropContext onDragEnd={(r: DropResult) => onCharacterDragEnd(r)}>
	<div className="d-flex-column justify-content-between mt-2">
	{['characters', 'support'].map((f: string, k: number) => (
	 <div key={k} className="align-items-center mt-2 mb-2 text-left">
	   <span><FormattedMessage id={f} /></span>
	   <Droppable droppableId={String(k)} direction="vertical" type="charactersItem" key={String(k)}>
	     {(provided: DroppableProvided, snapshot: any): React.ReactElement => (
	       <div
	         ref={provided.innerRef}
	         className="w-100 min-height-35 mt-05"
	         {...provided.droppableProps}
	       >
	         {scene.characters && (
	           scene.characters.filter((c: any) => c.character_type == k).map((character: any, key: number, arr) => (
	             <Draggable index={key} key={key} draggableId={`${k}-${key}`}>
	               {(DraggableProvided: DraggableProvided): React.ReactElement =>
	                 <div
	                   ref={DraggableProvided.innerRef}
	                   {...DraggableProvided.draggableProps}
	                   {...DraggableProvided.dragHandleProps}
	                 >
	                   <div className="chip mr-1 bg-light-gray text-bold-600">
	                     <div className="chip-body">
	                       <div className="chip-text" style={{fontSize: '1.2rem'}}>
	                         {character.character_name}
	                       </div>
	                       <div
	                         className="chip-closable"
							 onClick={() => {
								deleteCharacter(
									character.character_id,
									activeEvent.id,
									0,
									1,
									1
								);

								const updatedCharacters = scene.characters.filter(item => item.character_id !== character.character_id);
								changeScenePropValue(updatedCharacters, 'characters', scene.scene_id);
							}}
	                       >
	                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	                           <line x1="18" y1="6" x2="6" y2="18"/>
	                           <line x1="6" y1="6" x2="18" y2="18"/>
	                         </svg>
	                       </div>
	                     </div>
	                   </div>
	                 </div>
	               }
	             </Draggable>
	           )))}

	         {false && (
	           <InputGroup className="mb-1">
	             {showAddCharacter && (<>
	             <InputGroupAddon addonType="append">
	               <InputGroupText className={classnames("options", {
	                 "bg-transparent": !showAddCharacter,
	                 "no-border": !showAddCharacter
	               })}>
	                 <XCircle size={20} onClick={() => setShowAddCharacter(false)} />
	               </InputGroupText>
	             </InputGroupAddon>
	             <Input className="chip width-30-per height-auto" value={''} />
	             </>)}
	             <InputGroupAddon addonType="append">
	               <InputGroupText className="options">
	                 <PlusCircle size={20} onClick={() => setShowAddCharacter(true)} />
	               </InputGroupText>
	             </InputGroupAddon>
	           </InputGroup>
	         )}
	         {provided.placeholder}
	         {snapshot.isDraggingOver && (
	           <div className="width-100-per divider divider-center">
	             <div className="divider-text bg-transparent">
	               <ArrowUp />
	             </div>
	           </div>
	         )}
			   <AddNewCharacter
				   isSupport={f === 'support'}
				   scene={scene}
				   scene_index={scene_index}
				   activeEvent={activeEvent}
				   sd={sd}
				   changeScenePropValue={changeScenePropValue}
			   />
	       </div>
	     )}
	   </Droppable>
	 </div>
	))}
	{['extras', 'bits'].map((f: string) => (
		<div key={f} className="d-flex justify-content-between mt-1 align-items-center">
			<span><FormattedMessage id={f} /></span>
			<div className="d-flex w-100 pl-2">
				<div className="d-flex justify-content-between">
					<Input type="number" value={scene[f]} min="0" max="100" className="width-15-per text-center mr-1" placeholder={formatMessage({ id: 'num' })}
						   onBlur={
							   e => changeScenePropValueDB(e.target.value, f, scene.scene_number, scene.chapter_number)
						   }
						   onChange={e => changeScenePropValue(e.target.value, f, scene.scene_id)}
					/>
					<Input type="text" value={scene[f + '_text']} className="width-100-per" placeholder={formatMessage({ id: 'description' })}
						   onBlur={
							   e => changeScenePropValueDB(e.target.value, f + '_text', scene.scene_number, scene.chapter_number)
						   }
						   onChange={
							   // e => changeScenePropValue(e.target.value, f + '_text', scene.chapter_number, scene_index, script_index, scene.time_id)
							   e => changeScenePropValue(e.target.value, f + '_text', scene.scene_id)
						   }
					/>
				</div>
			</div>
		</div>
	))}
	{duration}
	</div>
	</DragDropContext>
	</CardBody>
	)






	// const actorCharacters = scene.characters.filter(item => item.character_type === 0)
	// const supportCharacters = scene.characters.filter(item => item.character_type === 1)
    //
	// const characters = (
	// 	<CardBody className="text-center pt-0 characters">
	// 		<div className="d-flex-column justify-content-between mt-2">
	// 			{['characters', 'support'].map((f: string, k: number) => (
	// 			   <Droppable droppableId={`${f}-${String(k)}`} type="charactersItem" direction="vertical" key={String(k)}>
	// 					{(provided: DroppableProvided, snapshot: any): React.ReactElement => (
	// 						<div ref={provided.innerRef} {...provided.droppableProps}>
	// 							<div
	// 								key={k}
	// 								className={classnames("align-items-center mt-2 mb-2 text-left")}
	// 							>
	// 								<div className={classnames("d-flex flex-wrap w-100 min-height-35")}>
	// 									<span className="mr-05 mb-05">
	// 										<FormattedMessage id={f} />
	// 									</span>
	// 									{f === 'characters'
	// 										? actorCharacters.map((character: any, key: number, arr) => (
	// 											//scene.characters.filter((c: any) => c.character_type == k).map((character: any, key: number, arr) => (
	// 										<Draggable index={key} key={key} draggableId={`${k.toString()}-${key.toString()}`}>
	// 											{(DraggableProvided: DraggableProvided): React.ReactElement => (
	// 												<div
	// 													ref={DraggableProvided.innerRef}
	// 													{...DraggableProvided.draggableProps}
	// 													{...DraggableProvided.dragHandleProps}
	// 												>
	// 													<div
	// 														key={k+key}
	// 														onDragStartCapture={(r) => {
	// 															// console.log('start r: ', r)
	// 														}}
	// 														onDragEnd={(r: any) => {
    //
	// 															// onDragEnd(r, scene_index, scene.chapter_number, sdi, scene.time_id)
	// 														}}
	// 													>
	// 														<div className="chip mr-05 bg-light-gray text-bold-600">
	// 															<div className="chip-body">
	// 																<div className="chip-text" style={{ fontSize: '1.2rem' }}>
	// 																	{character.character_name}
	// 																</div>
	// 																<div
	// 																	className="chip-closable"
	// 																	onClick={() => {
	// 																		deleteCharacter(
	// 																			character.character_id,
	// 																			activeEvent.id,
	// 																			0,
	// 																			1,
	// 																			1
	// 																		);
    //
	// 																		const updatedCharacters = arr.filter(item => item.character_id !== character.character_id);
	// 																		changeScenePropValue([...updatedCharacters, ...supportCharacters], 'characters', scene.scene_id);
	// 																	}}
	// 																>
	// 																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	// 																		<line x1="18" y1="6" x2="6" y2="18" />
	// 																		<line x1="6" y1="6" x2="18" y2="18" />
	// 																	</svg>
	// 																</div>
	// 															</div>
	// 														</div>
	// 													</div>
	// 												</div>
	// 											)}
	// 										</Draggable>
	// 										))
	// 										: supportCharacters.map((character: any, key: number, arr) => (
	// 											//scene.characters.filter((c: any) => c.character_type == k).map((character: any, key: number, arr) => (
	// 											<Draggable index={key} key={key} draggableId={`${k.toString()}-${key.toString()}`}>
	// 											{(DraggableProvided: DraggableProvided): React.ReactElement => (
	// 												<div
	// 													ref={DraggableProvided.innerRef}
	// 													{...DraggableProvided.draggableProps}
	// 													{...DraggableProvided.dragHandleProps}
	// 												>
	// 													<div
	// 														key={k+key}
	// 														onDragStartCapture={(r) => {
	// 															console.log('start r: ', r)
	// 														}}
	// 														onDragEnd={(r: any) => {
	// 															console.log('r: ', r)
	// 															// onDragEnd(r, scene_index, scene.chapter_number, sdi, scene.time_id)
	// 														}}
	// 													>
	// 														<div className="chip mr-05 bg-light-gray text-bold-600">
	// 															<div className="chip-body">
	// 																<div className="chip-text" style={{ fontSize: '1.2rem' }}>
	// 																	{character.character_name}
	// 																</div>
	// 																<div
	// 																	className="chip-closable"
	// 																	onClick={() => {
	// 																		deleteCharacter(
	// 																			character.character_id,
	// 																			activeEvent.id,
	// 																			0,
	// 																			1,
	// 																			1
	// 																		);
	// 																		const updatedCharacters = arr.filter(item => item.character_id !== character.character_id);
	// 																		changeScenePropValue([...actorCharacters, ...updatedCharacters], 'characters', scene.scene_id);
	// 																	}}
	// 																>
	// 																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	// 																		<line x1="18" y1="6" x2="6" y2="18" />
	// 																		<line x1="6" y1="6" x2="18" y2="18" />
	// 																	</svg>
	// 																</div>
	// 															</div>
	// 														</div>
	// 													</div>
	// 												</div>
	// 											)}
	// 											</Draggable>
	// 										))
	// 									}
	// 									{provided.placeholder}
	// 									{/*{false && (*/}
	// 									{/*<InputGroup className="mb-1">*/}
	// 									{/*{showAddCharacter && (<>*/}
	// 									{/*<InputGroupAddon addonType="append">*/}
	// 									{/*<InputGroupText className={classnames("options", {*/}
	// 									{/*"bg-transparent": !showAddCharacter,*/}
	// 									{/*"no-border": !showAddCharacter*/}
	// 									{/*})}>*/}
	// 									{/*<XCircle size={20} onClick={() => setShowAddCharacter(false)} />*/}
	// 									{/*</InputGroupText>*/}
	// 									{/*</InputGroupAddon>*/}
	// 									{/*<Input className="chip width-30-per height-auto" value={''} />*/}
	// 									{/*</>)}*/}
	// 									{/*<InputGroupAddon addonType="append">*/}
	// 									{/*<InputGroupText className="options">*/}
	// 									{/*<PlusCircle size={20} onClick={() => setShowAddCharacter(true)} />*/}
	// 									{/*</InputGroupText>*/}
	// 									{/*</InputGroupAddon>*/}
	// 									{/*</InputGroup>*/}
	// 									{/*)}*/}
	// 								</div>
	// 								<AddNewCharacter
	// 									isSupport={f === 'support'}
	// 									scene={scene}
	// 									scene_index={scene_index}
	// 									activeEvent={activeEvent}
	// 									sd={sd}
	// 									changeScenePropValue={changeScenePropValue}
	// 								/>
	// 							</div>
	// 						</div>
	// 					)}
	// 				</Droppable>
	// 			))}
    //
	// 			{['extras', 'bits'].map((f: string) => (
	// 				<div key={f} className="d-flex justify-content-between mt-1 align-items-center">
	// 					<span><FormattedMessage id={f} /></span>
	// 					<div className="d-flex w-100 pl-2">
	// 						<div className="d-flex justify-content-between">
	// 							<Input type="number" value={scene[f]} min="0" max="100" className="width-15-per text-center mr-1" placeholder={formatMessage({ id: 'num' })}
	// 								   onBlur={
	// 									   e => changeScenePropValueDB(e.target.value, f, scene.scene_number, scene.chapter_number)
	// 								   }
	// 								   onChange={e => changeScenePropValue(e.target.value, f, scene.scene_id)}
	// 							/>
	// 							<Input type="text" value={scene[f + '_text']} className="width-100-per" placeholder={formatMessage({ id: 'description' })}
	// 								   onBlur={
	// 									   e => changeScenePropValueDB(e.target.value, f + '_text', scene.scene_number, scene.chapter_number)
	// 								   }
	// 								   onChange={
	// 									   // e => changeScenePropValue(e.target.value, f + '_text', scene.chapter_number, scene_index, script_index, scene.time_id)
	// 									   e => changeScenePropValue(e.target.value, f + '_text', scene.scene_id)
	// 								   }
	// 							/>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			))}
	// 			{duration}
	// 		</div>
	// 	</CardBody>
	// )
	// const tasks = (
	//  <div>
	//    <div className="mx-2 my-1 flex-column">
	//      <dl>
	//        {[{ name: 'props', color: '#6236ff' },
	//        { name: 'clothes', color: '#b620e0' },
	//        { name: 'makeups', color: '#0091ff' },
	//        // { name: 'others', color: '#0091ff' }
	//        ].map((field: any, key: number) => (
	//          <div key={key}>
	//            <dt className="mb-1" style={{ color: field.color }}><FormattedMessage id={field.name} /></dt>
	//            {scene[field.name] && (
	//              scene[field.name].map((prop: any, type_index: number) => (
	//                <SceneRow
	//                  key={type_index}
	//                  data={prop}
	//                  color={field.color}
	//                  type_index={type_index}
	//                  script_index={script_index}
	//                  scene_index={scene_index}
	//                  scene_time_id={scene.time_id}
	//                  scene_number={scene.scene_number}
	//                  chapter_number={scene.chapter_number}
	//                  characters={scene.characters}
	//                  SupplierWithJob={(supplier_job_title: string) => SupplierWithJob(supplier_job_title, [...suppliers, ...actors])}
	//                  type={field.name}
	//                  fields={
	//                    //['def', 'character_name', 'supplier_job_title', 'supplier_name', 'comments']
	//                    ['def', 'supplier_job_title', 'supplier_name', 'comments']
	//                  }
	//                  onDelete={onDelete}
	//                  onChange={onChange}
	//                  onBlur={onBlur}
	//                />
	//              )))}
	//            {AddNewButton(script_index, scene_index, field.name, scene)}
	//          </div>
	//        ))}
	//      </dl>
	//    </div>
	//  </div>
	// )

	const tasks = (
		<div>
			<div className="mx-2 my-1 flex-column">
				<dl>
					{/*{[{ name: 'props', color: '#6236ff' },*/}
					{/*{ name: 'clothes', color: '#b620e0' },*/}
					{/*{ name: 'makeups', color: '#0091ff' },*/}
					{/*// { name: 'others', color: '#0091ff' }*/}
					{/*].map((field: any, key: number) => (*/}
					{/*<div key={key}>*/}
					{/*<dt className="mb-1" style={{ color: field.color }}><FormattedMessage id={field.name} /></dt>*/}
					{/*{scene[field.name] && (*/}
					{/*scene[field.name].map((prop: any, type_index: number) => (*/}
					{/*<SceneRow*/}
					{/*key={type_index}*/}
					{/*data={prop}*/}
					{/*color={field.color}*/}
					{/*type_index={type_index}*/}
					{/*script_index={script_index}*/}
					{/*scene_index={scene_index}*/}
					{/*scene_time_id={scene.time_id}*/}
					{/*scene_number={scene.scene_number}*/}
					{/*chapter_number={scene.chapter_number}*/}
					{/*characters={scene.characters}*/}
					{/*SupplierWithJob={(supplier_job_title: string) => SupplierWithJob(supplier_job_title, [...suppliers, ...actors])}*/}
					{/*type={field.name}*/}
					{/*fields={*/}
					{/*//['def', 'character_name', 'supplier_job_title', 'supplier_name', 'comments']*/}
					{/*['def', 'supplier_job_title', 'supplier_name', 'comments']*/}
					{/*}*/}
					{/*onDelete={onDelete}*/}
					{/*onChange={onChange}*/}
					{/*onBlur={onBlur}*/}
					{/*/>*/}
					{/*)))}*/}
					{/*{AddNewButton(script_index, scene_index, field.name, scene)}*/}
					{/*</div>*/}
					{/*))}*/}

					{[{ name: 'props', color: '#6236ff' },
					{ name: 'clothes', color: '#b620e0' },
					{ name: 'makeups', color: '#0091ff' },
					{ name: 'specials', color: 'rebeccapurple' },
					].map((field: any, key: number) => (
						<div key={key} className="mb-2">
							<dt className="mb-1 d-flex align-items-center" style={{ color: field.color }}>
								<FormattedMessage id={field.name} />
								<TasksInput
									scene={scene}
									sceneIndex={scene_index}
									field={field}
									activeEvent={activeEvent}
									sdId={sdId}
									changeScenePropValue={changeScenePropValue}
								/>
							</dt>
							<div className="row">
								{scene[field.name] && (
									scene[field.name].map((prop: any, type_index: number) => (
										<div
											key={type_index}
											title={prop.def}
											style={{
												borderLeft: '5px solid',
												borderLeftColor: field.color,
												whiteSpace: 'nowrap',
												textOverflow: 'ellipsis',
												overflow: 'hidden',
											}}
											className="col-4 my-05 p-05 task-item"
										>
											{prop.def}
											<div
												className="task-item__delete"
												onClick={() => {
													let sceneData = {
														chapter_number: scene.chapter_number,
														project_id: activeEvent.id,
														[field.name]: scene[field.name].filter(item => item.def !== prop.def),
														scene_number: scene.scene_number,
													};
													addScene(sceneData);

													let updatedField = scene[field.name].filter(item => item.def !== prop.def)
													changeScenePropValue(updatedField, [field.name], scene.scene_id);
												}}
											>
												<XCircle
													className="n-btn-delete"
													size={20}
												/>
											</div>
										</div>
									)))}
							</div>
						</div>
					))}

					{scene.others && scene.others.map((otherItem, key) => (
						<div key={key} className="mb-2 other-task-category-item">
							<dt className="mb-1 d-flex align-items-center">
								<span className="text-capitalize">{otherItem.name}</span>
								<TasksInput
									scene={scene}
									sceneIndex={scene_index}
									field={otherItem.name}
									activeEvent={activeEvent}
									sdId={sdId}
									isOthers
									otherItemId={otherItem.id}
									changeScenePropValue={changeScenePropValue}
								/>
							</dt>
							<div className="row">
								{otherItem.tasks && (
									otherItem.tasks.map((prop: any, type_index: number) => (
										<div
											key={type_index}
											title={prop.def}
											style={{
												borderLeft: '5px solid',
												// borderLeftColor: field.color,
												whiteSpace: 'nowrap',
												textOverflow: 'ellipsis',
												overflow: 'hidden',
											}}
											className="col-4 my-05 p-05 task-item"
										>
											{prop.def}
											<div
												className="task-item__delete"
												onClick={() => {
													let sceneData = {
														chapter_number: scene.chapter_number,
														project_id: activeEvent.id,
														others: scene.others.map(item => {
															if (item.name !== otherItem.name) {
																return item;
															}
															return {
																...item,
																tasks: item.tasks.filter(item => item.def !== prop.def)
															}
														}),
														scene_number: scene.scene_number,
													};

													addScene(sceneData);

													let updatedOthers = scene.others.map(item => {
														if (item.name !== otherItem.name) {
															return item;
														}
														return {
															...item,
															tasks: item.tasks.filter(item => item.def !== prop.def)
														}
													});

													changeScenePropValue(updatedOthers, 'others', scene.scene_id);
												}}
											>
												<XCircle
													className="n-btn-delete"
													size={20}
												/>
											</div>
										</div>
									)))}
							</div>
						</div>
					))}
					<AddNewTaskCategory
						activeEvent={activeEvent}
						scene={scene}
						sdId={sdId}
						changeScenePropValue={changeScenePropValue}
					/>
				</dl>
			</div>
		</div>
	)

	let associated_numList = []
	let non_repeated_characterIDList = []

	scene.characters.length?scene.characters.map((each_character) =>{
		let associated_num = CharacterList.find(item => item.id === each_character.character_id)?.associated_num
		if(associated_numList.includes(associated_num)){

		}else{
			associated_numList.push(associated_num)
			non_repeated_characterIDList.push(each_character.character_id)
		}
		
	}):null

	const sceneDetails = (
		<div className={classnames("d-flex", {})} style={{ flex: 1 }}>
			<div
				className={classnames("d-flex-column justify-content-between", {
					'w-100': !isListPreview,
				})}
				style={{ maxWidth: isListPreview ? '22rem' : 'none' }}>
				{[{ name: 'characters', color: 'black' },
				{ name: 'support', color: 'black' },
				{ name: 'extras', color: 'black' }].map((field: any, k: number) => (
					<div
						key={k}
						style={{ display: 'flex' }}
						className={classnames("my-05 text-bold-700", {
							'd-none': (field.name !== 'characters' && !isListPreview),
							'px-2': isListPreview,
							'my-0': !isListPreview,
						})}
					>
						{field.name === 'characters'
							?
							<div
								className={classnames("d-flex align-items-center flex-wrap", {
									'text-left': isListPreview,
									'justify-content-center': !isListPreview,
								})}
							>
								{isListPreview ? (
									<div className="ml-1 mr-05 d-inline-flex" style={{ color: field.color }}>
										<FormattedMessage id={field.name} />
									</div>
								) : null}

								{scene.characters.length
								? scene.characters
									.filter(ch => ch.character_type === 0)
									.filter(ch => non_repeated_characterIDList.includes(ch.character_id))
									.sort((a, b) => a.character_name.localeCompare(b.character_name))
									.map((character, key) => (

										<Chip
											key={key}
											className={classnames("mr-05 bg-light-gray text-bold-600", { "chip-smaller": !isListPreview })}
											avatarColor="danger"
											text={CharacterList.find(item => item.id === character.character_id)?.associated_num }
											
										/>
								)) : null}
							</div>
							:
							<div className="ml-1 d-flex">
								<div style={{ color: field.color }}>
									<FormattedMessage id={field.name} />
								</div>
								<div className="ml-05" style={{ whitespace: 'nowrap' }}>
									{field.name === 'support'
										? - scene.characters.length ? scene.characters.filter(ch => ch.character_type === 1).length : 0
										: - scene[field.name] ? scene[field.name].length : 0
									}
								</div>
							</div>
						}
					</div>
				))}
			</div>
			{isListPreview ? (
				<div className="ml-2 d-flex-column justify-content-between" >
					{[{ name: 'props', color: '#6236ff' },
					{ name: 'clothes', color: '#b620e0' },
					{ name: 'makeups', color: '#0091ff' },
						// { name: 'others', color: '#0091ff' }
					].map((field: any, k: number) => (
						<div key={k} className="d-flex my-05 text-bold-700 px-2" >
							<div style={{ color: field.color }}><FormattedMessage id={field.name} /></div>
							<div className="ml-05" style={{ whitespace: 'nowrap' }}> -  {scene[field.name] ? scene[field.name].length : 0}</div>
						</div>
					))}
				</div>
			) : null}
			{isListPreview ? (
				<div
					className="ml-auto scene-set-disable"
					onClick={() => {
						const sceneStatusIdValue = scene.scene_status_id === 4 ? 3 : 4;

						addScene({
							chapter_number: scene.chapter_number,
							project_id: activeEvent.id,
							scene_number: scene.scene_number,
							scene_status_id: sceneStatusIdValue,
						});
						changeScenePropValue(sceneStatusIdValue, 'scene_status_id', scene.scene_id);
					}}
				>

					{scene.scene_status_id === 4
						? <div className="scene-put-back">Put back</div>
						: (
							<XCircle
								size={30}
							/>
						)
					}

				</div>
			) : null}
			{/* <div className="d-flex justify-content-between" >
				 {['tasks','additional_expenses'].map((field:string)=>(
				 <>
				 <div className="px-2 text-center">
				 <div><FormattedMessage id={field}/></div>
				 <div>{scene[field] ? scene[field].length : 0}</div>
				 </div>
				 </>
				 ))}
				 </div> */}
		</div>
	)

	const arrowListView = (isCollapsed: boolean) => (
		<div className={classnames("scene-collapse-arrow cursor-pointer width-2-rem height-9-rem bg-gray bg-light-gray-3 d-flex justify-content-center align-items-center", {
			'height-100-per': isCollapsed
		})}
			onClick={() => {
				setRowExpanded(Boolean(!rowExpanded));
				changeScenePropValue(!rowExpanded, 'scene_expanded', scene.scene_id);
			}}>
			{!isCollapsed ?
				<div className={classnames({ "icon-rotate": !rowExpanded })}>
					<Icon src={config.iconsPath + "options/dropdown-up.svg"} />
				</div>
				: null}
		</div>
	)

	const arrow = (isCollapsed: boolean) => (
		<div className="btn mt-3 width-100-per bg-gray bg-light-gray-3 d-flex justify-content-center py-1"
			onClick={() => setIsCollapsed(Boolean(isCollapsed))}>
			<div className={classnames({ "icon-rotate": !isCollapsed })}>
				<Icon src={config.iconsPath + "options/dropdown-up.svg"} />
			</div>
		</div>
	);

	const sceneBackgroundColor = sceneTime.find(item => item.scene_time === scene.time)?.color

	React.useEffect(() => {
		return () => {
		};
	}, [scene]);

	return scene ? isListPreview ? (
		<>
			<Card
				id={`${script_index}-${scene_index}`}
				style={{ backgroundColor: sceneBackgroundColor }}
				className={classnames("btn p-0 text-dark card-transparent height-9-rem width-auto d-flex flex-row align-items-center mb-0 position-relative", {
					"scene-disabled": scene.scene_status_id === 4,
				})}
			// onClick={()=> setRowExpanded(!rowExpanded)}
			>
				{isListPreview ? topListView : null}
				<div className="d-flex flex-wrap align-items-center px-2" style={{ flex: 1 }}>

					{sdId ? (
						<div className="move-to-shooting-day-list">
							<MoveToShootingDay
								sd={sd}
								projectSceneId={scene?.project_scene_id}
								activeEvent={activeEvent}
								setReorerd={setReorerd}
								isListPreview={isListPreview}
							/>
						</div>
					) : null}

					{top(true)}
					<div className="breakdown-scene-eighth">
						{eighthsFormat(scene.eighth)}
					</div>
					{synofsis(1, true)}
				</div>
				{sceneDetails}
				{arrowListView(false)}
			</Card>

			{rowExpanded && (
				<Card className={classnames("text-dark d-flex flex-row", {
					"scene-disabled": scene.scene_status_id === 4,
				})} style={{height:"840px"}}>

					<div className="mt-1" style={{ flex: 1 }}>
						{/* {topListView} */}
						<div className="ml-1">{top(true)}</div>
						{synofsis(5)}
						{characters}
					</div>
					<div style={{ flex: '1 1 15%' }}>{script}</div>
					<div style={{ flex: 1 }}>{tasks}</div>
					<div>{arrowListView(true)}</div>
				</Card>
			)}
		</>
	) :
		(
			<Card
				id={`${script_index}-${scene_index}`}
				style={{ backgroundColor: scene.color }}
				className={classnames("text-dark min-width-300 card-transparent pb-1 mb-05", {
					"pt-1": isListPreview,
					"pt-05": !isListPreview,
					"scene-disabled": scene.scene_status_id === 4
				})}
			>
				<div>
					{sdId ? (
						<div className="move-to-shooting-day-column">
							<MoveToShootingDay
								sd={sd}
								projectSceneId={scene?.project_scene_id}
								activeEvent={activeEvent}
								setReorerd={setReorerd}
							/>
						</div>
					) : null}
					{top()}
					{isCollapsed && (
						<>
							{sceneDetails}
							{/*{arrow(false)}*/}
						</>)}
					{synofsis(1)}
					{!isCollapsed && (
						<>
							<Collapse isOpen={!isCollapsed}>
								{characters}
								{script}
								{tasks}
								{duration}
								{arrow(true)}
							</Collapse>
						</>
					)}
				</div>
			</Card>


		)




		: null;

}

const propsAreEqual = (prevProps, nextProps): boolean => {
	return (
		JSON.stringify(prevProps.scene) === JSON.stringify(nextProps.scene) &&
		prevProps.isListPreview === nextProps.isListPreview
	);
};

export default React.memo(BreakDownScene, propsAreEqual);

