import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { TaskShootingDayRow, Icon, BreakDownScene }  from '@components'
import classnames from 'classnames'
import { Event } from '@containers/planning/interfaces';
import * as moment from 'moment';
import { config } from '../../config';
import { EventActionTypes } from '@containers/planning/enum';
import Flatpickr from "react-flatpickr";
import {  Button, Card, CardBody, Input } from "reactstrap"
import { useIntl, FormattedMessage } from "react-intl"
import * as shootingDaysActions from "../../redux/actions/shooting-days"
import { XCircle }  from 'react-feather'
import { ShootingDaysActionTypes } from '@containers/shooting_days/enums';
import { addProject } from '@containers/planning/initial-state';
import {eighthsFormat, timeStringToNumber, durationBetweenDates} from '../../helpers/helpers';
import {
	Pagination,
	PaginationItem,
	PaginationLink,

} from "reactstrap"
import {
	Droppable,
	Draggable,
	DraggableProvided,
	DragDropContext,
	DropResult,
	DroppableProvided,
} from 'react-beautiful-dnd';
import {addShootingDay, addShootingDays, moveScenesBetweenShootingDays} from './initial-state';
import useDidUpdateEffect from '@src/utilities/useDidUpdateEffect';
import './index.scss';

const ITEMS_PER_PAGE = 1;
const cloneDeep = require('lodash/cloneDeep');

interface Props {
	readonly addNew: (script_index: number, scene_index: number, type:string, scene:any, defaultValue?: string) => void;
	readonly changeSceneValue: (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number, script_index: number, scene_time_id: number) => void;
	readonly changeSceneValueDB: (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number,scene_number:number, script_index?: number, scene_time_id?: number) => void;
	readonly changeScenePropValue: (value: any, field: string, chapter_number:number, scene_index:number, script_index: number, scene_time_id: number) => void;
	readonly changeScenePropValueDB: (value: any, field: string,scene_number:number, chapter_number: number) => void;
	readonly deleteRow:  (index: number, type:string, chapter_number:number, scene_index:number,scene_number:number, script_index: number, scene_time: number) => void;
	readonly AddNewButton:  (script_index: number,scene_index: number,type: string, scene:any) => void;
}

export const ShootingDays: React.FunctionComponent<Props> = React.memo((props: Props) => {
	let savedLocale = localStorage.getItem('locale');
	if (savedLocale === 'heb') savedLocale = 'he';
	const dispatch = useDispatch();
	const { formatMessage } = useIntl();
	const { addNew, changeSceneValue, changeSceneValueDB, changeScenePropValue, changeScenePropValueDB, deleteRow, AddNewButton} = props
	const scripts = useSelector((state: RootStore) => state.scripts)
	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [date, setDate] = React.useState('');
	const [isFullPage, setIsFullPage] = React.useState<boolean>(false);
	const [reorderedByTime, setReorderedByTime] = React.useState<boolean>(true);
	// const [types, setTypes] = React.useState<any[]>([false]);
	const [render, setRender] = React.useState<boolean>(false);
	const user = useSelector((state: RootStore) => state.user);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [isListPreview, setIsListPreview] = React.useState<boolean>(true);
	const [reorderd, setReorerd] = React.useState<boolean>(false);

	const shootingDays = useSelector((state: RootStore) => state.shootingDays);

	const orderedShootingDays = React.useMemo(() => shootingDays && shootingDays.map((sd, index) => ({
		...sd,
		shooting_day_pos: index,
		shooting_day: {
			...sd.shooting_day,
			total_scenes: sd.scene_pos
				? sd.shooting_day?.total_scenes?.sort((a,b) => sd.scene_pos.indexOf(a.scene_id)-sd.scene_pos.indexOf(b.scene_id))
				: sd.shooting_day?.total_scenes
		}
	})), [shootingDays]);

	const [next, setNext] = React.useState(ITEMS_PER_PAGE);
	  const [hasMore, setHasMore] = React.useState(true);
	  const [current, setCurrent] = React.useState(orderedShootingDays.slice(0, next));

	  const getMoreData = () => {
		if (current.length === orderedShootingDays.length) {
		  setHasMore(false);
		  return;
		}
		setCurrent(orderedShootingDays.slice(0, next + ITEMS_PER_PAGE));
		setNext(next + ITEMS_PER_PAGE)
	  };

	  const scrollDivRef = React.useRef();

	  const handleScrollTo = (index: number) => {
		if (!current[index]) {
			setCurrent(orderedShootingDays.slice(0, index + ITEMS_PER_PAGE));
			setNext(index);
		}

		setTimeout(() => {
			const yOffset = -170;
			const xOffset = -120; // left menu width
			const element = document.querySelector('div[data-rbd-droppable-id="'+ index +'"]');
			const parent = scrollDivRef.current;

			if (!element) {
				return;
			}
			const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			const x = parent.scrollLeft + element.getBoundingClientRect().left + xOffset;

			if (isListPreview) {
				window.scrollTo({top: y, behavior: 'smooth'});
			} else {
				parent?.scrollTo({ left: x, behavior: 'smooth' });
			}
		});
	};

	useDidUpdateEffect(() => {
		setCurrent(orderedShootingDays.slice(0, current.length));
	}, [orderedShootingDays]);
	const handleScroll = (e) => {
		const el = e.target;
		if (!hasMore) {
			return;
		}

		// infinite scroll for horizontal
		if (Math.floor(el.offsetWidth + Math.abs(el.scrollLeft)) >= el.scrollWidth - 80 && !isListPreview) {
			getMoreData();
		}
		// infinite scroll for vertical
		if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 80 && isListPreview) {
			getMoreData();
		}
	};

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [current, next]);

	useDidUpdateEffect(() => {
		if (isListPreview) {
			setHasMore(true);
			setNext(ITEMS_PER_PAGE);
			setCurrent(orderedShootingDays.slice(0, ITEMS_PER_PAGE));
		} else {
			setHasMore(true);
			const daysToRender = Math.round(window.innerWidth / 230) + 1; // 252 width of columns
			setNext(daysToRender);
			setCurrent(orderedShootingDays.slice(0, daysToRender));
		}
	}, [isListPreview]);

	React.useEffect(() => {
		if( !reorderd && shootingDays && shootingDays.length  ) {
			setLoading(true)
			const arr = [1];
			var payload = cloneDeep(shootingDays)
			for(var sdi=0; sdi < payload.length ;sdi++) {
				var sd = payload[sdi]
				let breaksUsed:any[] = []
				if( !sd.shooting_day || !sd.shooting_day.total_scenes || !sd.shooting_day.total_scenes.length ) break;
				let params = sd.params;
				//var bi=0;
				// for(var time_index=0; time_index < sd.shooting_day.total_scenes.length ;time_index++) {
					// var time = sd.shooting_day.scenes[time_index]
					// if ( !time.length ) break;
					for(var scene_index=0; scene_index < sd.shooting_day.total_scenes.length ;scene_index++) {
						var scene = sd.shooting_day.total_scenes[scene_index]
						// if(scene.break) break;
						// let scene_duration = scene && scene.one_shoot && scene.reshoots && scene.prepare ? (Number(scene.one_shoot) * Number(scene.reshoots)) + Number(scene.prepare) : 60;
						let scene_duration = scene.scene_duration ? scene.scene_duration : 60;
						// scene.duration = scene_duration
						let time_location = scene.time_id == 0 ? 'inside' : 'outside'
						let breaks = params?.filter((p:any)=> p.type !== 'shooting_hours' )

						//console.log('scene.scene_id, breaks: ', scene.scene_id, breaks)

						// let scene = shootingDays[sdi] ? shootingDays[sdi].shooting_day.scenes[time_index][scene_index]: undefined
						let sceneBefore =  payload[sdi].shooting_day.total_scenes[scene_index-1] ? payload[sdi].shooting_day.total_scenes[scene_index-1] : undefined
						//  if( time_location == 'outside' ) sceneBefore= shootingDays[sdi].shooting_day.total_scenes && shootingDays[sdi].shooting_day.total_scenes.length-1 ? shootingDays[sdi].shooting_day.total_scenes[shootingDays[sdi].shooting_day.total_scenes.length-1] :undefined

						console.log('breaksUsed', breaksUsed)
						if( scene && sceneBefore && sceneBefore.timeEnd) {
							//Not first scene of a shooting day

							var start = sceneBefore.timeEnd.getTime()
							var end = sceneBefore.timeEnd.getTime()  + (scene_duration  * 1000 * 60)
							var ClosestBreak:any = undefined;

							for (var z=0; z < breaks.length;z++) {
								if (
									ClosestBreak ||
									(breaksUsed.includes(breaks[z].type)
									&& breaks[z].type !== 'breakfast')
									// && breaks[z].type !== 'lunch'
								) {
									break;
								}

								let BreakEndTimeNumbers = isBreakHere(sd.date,start, end, breaks[z].type, breaks[z].inside.start, breaks[z].inside.end);
								console.log('BreakEndTimeNumbers', BreakEndTimeNumbers)
								if( BreakEndTimeNumbers ) {
									//console.log('BreakEndTimeNumbers: ', BreakEndTimeNumbers)

									ClosestBreak = {
										break: {
											index: z,
											...breaks[z],
											duration: BreakEndTimeNumbers.duration,
										},
										BreakEndTimeNumbers
									};

									breaksUsed.push(breaks[z].type);
									z = breaks.length+1
								}
							}

							// if( ClosestBreak &&  ClosestBreak.break ) {
							//
							// 	console.log("1 ClosestBreak.break['inside']['start']", ClosestBreak.break['inside']['start'])
							// 	ClosestBreak.break['inside']['start'] = new Date(end).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
							// 	ClosestBreak.break['inside']['end'] = new Date(end + ClosestBreak.break.duration).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
							// }

							let cbete = ClosestBreak ? ClosestBreak.BreakEndTimeNumbers : undefined
							scene.break = cbete ?  ClosestBreak.break : undefined;

							//console.log('scene id -> has scene before, breaks' , scene.scene_id, breaks);

							scene.timeStart = new Date(start);

							if (sceneBefore.break) {
								const prevSceneEnd = Math.max(sceneBefore.timeEnd.getTime(), timeStringToNumber(sceneBefore.timeStart, sceneBefore.break.inside.end));
								scene.timeStart = new Date(prevSceneEnd);
							}
							scene.timeEnd = new Date(scene.timeStart.getTime() +  scene_duration  * 1000 * 60);

						} else {
							//First scene of a shooting day

							var stsd = params.find((p:any)=> p.type == 'shooting_hours')
							stsd = stsd ? params.find((p:any)=> p.type == 'shooting_hours')[time_location]['start'] : '06:00'
							var start:any = timeStringToNumber(sd.date, stsd)
							var end:any = timeStringToNumber(sd.date, stsd) + (scene_duration * 1000 * 60 )
							var ClosestBreak:any = undefined
							for(var z=0; z < breaks.length  ;z++) {
								if( ClosestBreak ) break;
								let BreakEndTimeNumbers = isBreakHere(sd.date,start, end, breaks[z].type, breaks[z].inside.start, breaks[z].inside.end);
								if( BreakEndTimeNumbers ) { ClosestBreak = {break: {index:z,...breaks[z], duration: BreakEndTimeNumbers.duration }, BreakEndTimeNumbers}; breaksUsed.push(breaks[z].type);  z = breaks.length+1 }
							}

							// if( ClosestBreak &&  ClosestBreak.break ) {
							// 	console.log("2 ClosestBreak.break['inside']['start']", ClosestBreak.break['inside']['start'])
							//
							// 	ClosestBreak.break['inside']['start'] = new Date(end).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
							// 	ClosestBreak.break['inside']['end'] = new Date(end + ClosestBreak.break.duration).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
							// }

							let cbete = ClosestBreak ? ClosestBreak.BreakEndTimeNumbers : undefined
							scene.break = cbete ?  ClosestBreak.break : undefined ;
							scene.timeStart = cbete ? new Date(timeStringToNumber(sd.date,ClosestBreak.break['inside']['end'])) :  new Date(start);
							scene.timeEnd = cbete ? new Date(timeStringToNumber(sd.date,ClosestBreak.break['inside']['end']) + (scene_duration * 1000 * 60 )) : new Date(end)
						}
					}
				}

				dispatch({
					type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
					payload,
				});
			setReorerd(true)
			setLoading(false)
		}

	},[shootingDays, scripts, reorderd]);

	const onDragEnd = (result: DropResult, scene_index:number, chapter_number:number, script_index:number, time_id:number): void => { //characters
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		var lists = scripts[script_index]?.scenes
		let source_type = Number(source.droppableId)
		let destination_type = Number(destination.droppableId)
		let list = lists[scene_index].characters
		list[source.index].character_type = destination_type
		changeScenePropValue(list, 'characters', chapter_number , scene_index, script_index, time_id)
	 };

	 const onDelete = async (index: any, type:string, shooting_day_index:number) => {
		dispatch(shootingDaysActions.deleteShootingDayParameter(shooting_day_index,index, type ))
		await addShootingDay({ project_id:activeEvent.id, project_shooting_day_id: shootingDays[shooting_day_index].id, [type]: tasks })

	}

	const changeShootingDayValue =  (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number, modifyAllScenes  ) => {
		dispatch(shootingDaysActions.setShootingDayParameterValue(shooting_day_index,type, value, field, type_index, modifyAllScenes))
	};

	const changeShootingDayValueDB = (value: any, type:string, shooting_day_index:number, field?: string ,type_index?:number) => {
		let task = shootingDays[shooting_day_index][type]
		if( field ) {
			task[type_index][field] = value;
		} else task = value

		// addShootingDay({ project_id:activeEvent.id, project_shooting_day_id: shootingDays[shooting_day_index].id, [type]: task })
	};

	const onDragSceneEnd = (result: DropResult): void => {

		const { source, destination, draggableId } = result;
		if (!destination) {
			return;
		}
		// var newshootingDay = shootingDays
		let sourceDayIndex = Number(draggableId.split('-')[0]);
		// let destination_sdi = Number(draggableId.split('-')[0])
		// let scene_index = Number(draggableId.split('-')[1])
		// let destination_sdi = Number(draggableId.split('-')[0])
		//let sourceList = newshootingDay[source_sdi].shooting_day.scenes;
		//let destinationList = newshootingDay[destination_sdi].shooting_day.scenes;



		// const rows =
		// source_sdi === destination_sdi
		// 	? reorderRows(sourceList, destinationList,source_sdi, destination_sdi, scene_index)
		//      : reorderRowsInDifferentLists( sourceList, destinationList,source_sdi, destination_sdi, scene_index);


		if (source.droppableId !== destination.droppableId) {
			//Moving scenes between different days
			const shootingDayFrom = shootingDays[source.droppableId];
			const shootingDayTo = shootingDays[destination.droppableId];

			moveScenesBetweenShootingDays({
				project_id: activeEvent.id,
				project_scene_id: shootingDayFrom.shooting_day.total_scenes[source.index].project_scene_id,
				project_shooting_day_id_from: shootingDayFrom.id,
				project_shooting_day_id_to: shootingDayTo.id,
			});

			const rows = reorderRowsBetweenDifferentDays(source.droppableId, destination.droppableId, source.index, destination.index);

			if( rows && rows.length ) {
				// setReorerd(false)
				dispatch({
					type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
					payload: rows
				});
			}

		} else {
			//Moving scenes within one day

			const sourceIndex = source.index;
			const destinationIndex = destination.index;
			const rows = reorderRows(sourceDayIndex, sourceIndex, destinationIndex);

			addShootingDay({
				project_id: activeEvent.id,
				project_shooting_day_id: rows[sourceDayIndex].id,
				scene_pos: rows[sourceDayIndex].scene_pos
			});

			if( rows && rows.length ) {
				setReorerd(false)
				dispatch({
					type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
					payload: rows
				});
				console.log('rows: ', rows)
			}
		}
	};

	const onDragDayEnd = (result: DropResult): void => handleMoveShootingDayChange(result.source.index, result.destination.index);

	function reorderRows(sourceDayIndex, sourceIndex, destinationIndex) {

		let scene_pos = (shootingDays[sourceDayIndex].scene_pos && [...shootingDays[sourceDayIndex].scene_pos]) || shootingDays[sourceDayIndex].shooting_day.total_scenes.map(s => s.scene_id);

		const array_move = (arr, old_index, new_index) => {
			if (new_index >= arr.length) {
				let k = new_index - arr.length + 1;
				while (k--) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		};

		array_move(scene_pos, sourceIndex, destinationIndex);

		const updatedShootingDays = shootingDays.map((shootingDay, index) => sourceDayIndex === index
			? ({
				...shootingDay,
				scene_pos,
			})
			: shootingDay
		);

		return updatedShootingDays;
	}

	function reorderRowsBetweenDifferentDays(sourceDayIndex, destinationDayIndex, sourceIndex, destinationIndex) {
		let scene_pos_source = (shootingDays[sourceDayIndex].scene_pos && [...shootingDays[sourceDayIndex].scene_pos]) || shootingDays[sourceDayIndex].shooting_day.total_scenes.map(s => s.scene_id);
		let scene_pos_destanation = (shootingDays[destinationDayIndex].scene_pos && [...shootingDays[destinationDayIndex].scene_pos]) || shootingDays[destinationDayIndex].shooting_day.total_scenes.map(s => s.scene_id);

		let total_scenes_source = shootingDays[sourceDayIndex].shooting_day.total_scenes;
		let total_scenes_destination = shootingDays[destinationDayIndex].shooting_day.total_scenes;

		//Start modify
		const movingSceneId = scene_pos_source[sourceIndex];

		scene_pos_source.splice(sourceIndex, 1);
		const new_total_scenes_source = total_scenes_source.filter(scene => scene.scene_id !== movingSceneId);

		scene_pos_destanation.splice(destinationIndex, 0, movingSceneId);
		const new_total_scenes_destination = [
			...total_scenes_destination,
			shootingDays[sourceDayIndex].shooting_day?.total_scenes?.find(item=> item.scene_id === movingSceneId)
		];
		//End modify

		const updatedShootingDays = shootingDays.map((shootingDay, index) => {
			if (parseInt(sourceDayIndex) === index) {

				return {
					...shootingDay,
					scene_pos: scene_pos_source,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: new_total_scenes_source
					}
				}
			} else if (parseInt(destinationDayIndex) === index) {

				return {
					...shootingDay,
					scene_pos: scene_pos_destanation,
					shooting_day: {
						...shootingDay.shooting_day,
						total_scenes: new_total_scenes_destination
					}
				}
			} else {
				return shootingDay
			}
		});

		return updatedShootingDays;
	}

	// const reorderRowsInDifferentLists = (
	// 	sourceList: any,
	// 	destinationList: any,
	// 	source_sdi: number,
	// 	destination_sdi: number,
	// 	scene_index:number
	// ): any => {
	// 	if (!sourceList || !sourceList.length || !destinationList  ) {
	// 		return;
	// 	}
	// 	let source_scene_time: number;
	// 	let destination_scene_time: number;
	// 	var movedCard: any = sourceList[scene_index];
	// 	// if( movedCard ) if( movedCard.time_id == 0 ) { movedCard.time_id == 1 ;source_scene_time = 1; destination_scene_time = 0;} else {movedCard.time_id == 0 ; source_scene_time = 0; destination_scene_time = 1}

	// 	var sourceCards = [...sourceList];
	// 	var destinationCards = [...destinationList];
	// 	sourceCards.splice(source_sdi, 1);
	// 	destinationCards.splice(destination_sdi, 0, movedCard);
	// 	// sourceCards.forEach((row:any, index:number) => row.pos = index+1)
	// 	// destinationCards.forEach((row:any, index:number) => {row.pos = index+1 })
	// 	const newShootingDays = shootingDays.map((list: any, index:number) => {
	// 		if (index === source_sdi) {
	// 			return {
	// 				...list,
	// 				shooting_day: {
	// 					...list.shooting_day,
	// 					scenes: sourceCards
	// 					// list.shooting_day.scenes.map((st: any, sti:number) => {
	// 					// 			if( sti == source_scene_time ) return sourceCards
	// 					// 			return st
	// 					// 	   	})
	// 				}
	// 			};
	// 		}

	// 		if (index === destination_sdi) {
	// 			return {
	// 				...list,
	// 				shooting_day: {
	// 					...list.shooting_day,
	// 					scenes: destinationCards
	// 					//list.shooting_day.scenes.map((st: any, sti:number) => {
	// 					//	if( sti == destination_scene_time) return destinationCards
	// 					//	return  st
	// 					 //  })
	// 				}
	// 			};
	// 		}

	// 		return list;
	// 	});

	// 	return newShootingDays
	// };

	const addDays = (date: Date | string | number, days: number) =>{
		var result = new Date(date);
		result.setDate(result.getDate() + days)
		return result
	}

	React.useEffect(()=>{
		// if there is event date but not shooting days date, set dates automatically
		if( activeEvent.date && shootingDays[0] && shootingDays[0].date === null) {
			setDates(new Date(activeEvent.date), shootingDays)
		}
	},[]);

	const setDates = async (firstDate: Date, daysList) => {
		var businessDays = 0
		let shooting_days = daysList.map((sd:any, index:number) => {
			let date:any = addDays(firstDate, index + businessDays)
			if( date.getDay() == 6 )
			{
				businessDays = businessDays+1
				return {
					project_shooting_day_id: sd.id,
					project_id: activeEvent.id,
					date: addDays(date, 1),
					pos: index,
				}
			} else return {
					project_shooting_day_id: sd.id,
					project_id: activeEvent.id,
					date: date,
					pos: index,
				}
			})
		let newShootingDays:any = await addShootingDays(shooting_days);
		if( newShootingDays && newShootingDays.length ) {
			//setReorerd(false)
			dispatch({
				type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
				payload: newShootingDays
			});
		}
	}


	// const shootingDaysAdditonal  = (sd:any, sdi:number) => {
	// 	return <div className={classnames("bg-light-gray py-3 px-2 d-flex justify-content-between",{
	// 		"width-70-per": isListPreview,
	// 		'flex-column': !isListPreview
	// 	})}>
	// 	{['tasks','additional_expenses'].map((field:string, key:number)=>(
	// 		<div key={key} className={classnames("flex-1",{
	// 			"ml-3": key > 0 && isListPreview,
	// 		})}>
	// 		<dt className="mb-1"><FormattedMessage id={field}/></dt>
	// 		{sd[field] &&  (
	// 		sd[field].map((prop:any, type_index:number)=>(
	// 			<TaskShootingDayRow
	// 				data={prop}
	// 				color={field == 'tasks' ? '#005bb0': ''}
	// 				type_index={type_index}
	// 				sdi={sdi}
	// 				type={field}
	// 				fields={field === 'tasks' ? ['description','supplier_name', 'comments'] : ['description', 'price', 'comments']}
	// 				onDelete={onDelete}
	// 				onChange={changeShootingDayValue}
	// 				onBlur={changeShootingDayValueDB}
	// 				/>
	// 		)))}
	// 			{field == 'additional_expenses' ?
	// 				<div className="text-bold-600"><FormattedMessage id='total'/>: {sd[field].reduce((acc: number, prop: any) => {return acc+ Number(prop.price)},0)} </div>
	// 				: null}
	// 		<div
	// 		className="btn mr-1 mb-1 text-bold-600"
	// 		onClick={()=>{ let NEW = field === 'tasks' ? {description: '', supplier_name: '', comments: '' } : {description: '', price: '', comments: ''} ; changeShootingDayValue([...sd[field], NEW], field, sdi)}}>
	// 			+ <FormattedMessage id={'add_new'} />
	// 		</div>
	// 		{/* <Button.Ripple
	// 		color="primary"
	// 		outline
	// 		className="mr-1 mb-1"
	// 		onClick={()=>{ let NEW = field === 'tasks' ? {description: '', supplier_name: '', comments: '' } : {description: '', price: '', comments: ''} ; changeShootingDayValue([...sd[field], NEW], field, sdi)}}>
	// 			<FormattedMessage id={'add_new'} />
	// 		</Button.Ripple> */}
	// 		</div>
	// 		))}
	// </div>
	// }

	const sceneBreak = (scene_break:any, sdi:number, sdId:number) => {
		return (
			 <Card className={classnames("bg-light-aqua  mx-auto text-center color-white mb-05",{})}>
				 <CardBody className={classnames("d-flex align-items-center",{"d-flex p-1": isListPreview, "p-05": !isListPreview})}>
					 <div className={classnames("text-bold-600 text-left mb-0",{"min-width-15-rem h3": isListPreview})}>
						 <FormattedMessage id={scene_break.type}/>
					 </div>
					 <div className={classnames("ml-1 d-flex align-items-center",{"min-width-15-rem justify-content-center": isListPreview,})}>
						 <div className="text-bold-600">
							 <input
								 className="sqaure p-0 bg-white text-bold-600 color-black text-center bg-transparent form-control"
								 style={{borderRadius:0, borderColor: 'lightgray', height: 'auto'}}
								 type={'time'}
								 value={scene_break['inside']['start']}
								 required
								 onBlur={({ target }: React.ChangeEvent<HTMLInputElement>): void => {
									 let params = shootingDays[sdi].params
									 params[scene_break.index+1]['inside']['start'] = target.value
									 addShootingDay({
										 project_id: activeEvent.id,
										 project_shooting_day_id: sdId,
										 params: params
									 });
									 setReorerd(false);
								 }}
								 onChange={({ target }: React.ChangeEvent<HTMLInputElement>): void => {
									 let params = shootingDays[sdi].params
									 params[scene_break.index+1]['inside']['start'] = target.value
									 dispatch(shootingDaysActions.setShootingDayParameterValue(sdi,'params', params))
								 }}
							 />
						 </div>
						 &nbsp;-&nbsp;
						 <div className="text-bold-600">
							 <input
								 className="sqaure p-0 bg-white text-bold-600 color-black text-center bg-transparent form-control"
								 style={{borderRadius:0, borderColor: 'lightgray', height: 'auto'}}
								 type={'time'}
								 value={scene_break['inside']['end']}
								 required
								 onBlur={({ target }: React.ChangeEvent<HTMLInputElement>): void => {
									 let params = shootingDays[sdi].params
									 params[scene_break.index+1]['inside']['end'] = target.value;
									 addShootingDay({
										 project_id: activeEvent.id,
										 project_shooting_day_id: sdId,
										 params: params
									 });
									 setReorerd(false);
								 }}
								 onChange={({ target }: React.ChangeEvent<HTMLInputElement>): void => {
									 let params = shootingDays[sdi].params
									 params[scene_break.index+1]['inside']['end'] = target.value;
									 dispatch(shootingDaysActions.setShootingDayParameterValue(sdi,'params', params))
								 }}
							 />
						 </div>
					 </div>

				 </CardBody>
			 </Card>
		)
	};

	const isBreakHere = (sd_date:string, sceneTimeStart: number, scenTimeEnd: number,  type:string, BreakStartTime:string, BreakEndTime:string) =>{
		let BreakStartTimeNumbers:number = timeStringToNumber(sd_date, BreakStartTime)
		let breakStartDate = new Date(BreakStartTimeNumbers)
		let BreakEndTimeNumbers:number = timeStringToNumber(sd_date, BreakEndTime)
		let breakEndDate = new Date(BreakEndTimeNumbers)
		let duration = durationBetweenDates(breakStartDate, breakEndDate)

		return breakEndDate.getTime() >= sceneTimeStart  ? {duration, BreakEndTimeNumbers: moment.duration(BreakEndTime).asMilliseconds()} : false
	}

	const shootingDaysPagination = (
		<div className="shooting-days-pagination">
			<Pagination>
				{shootingDays.map((shootingDay, index) => (
					<PaginationItem>
						<PaginationLink
							className="rounded"
							onClick={() => handleScrollTo(index)}
						>
							{index + 1}
						</PaginationLink>
					</PaginationItem>
				))}
			</Pagination>
		</div>
	);

	function reorderShootingDaysArr(days, from, to) {
		console.log('from: ', from)
		console.log('to: ', to)

		let clone = cloneDeep(days);
		clone.splice(to, 0, clone.splice(from, 1)[0]);
		console.log('clone: ', clone)
		return clone;
	}

	function getFirstShootingDate(days) {
		let firstShootingDate = days[0]?.date;

		days.forEach(item => {
			if (!firstShootingDate || Date.parse(firstShootingDate) > Date.parse(item.date)) {
				firstShootingDate = item.date;
			}
		});

		return firstShootingDate;
	}

	const datepickerValue = () => {
		if (activeEvent.date) {
			return new Date(activeEvent.date)
		} else if (shootingDays[0].date) {
			return getFirstShootingDate(shootingDays)
		} else {
			return new Date()
		}
	}

	const [dayNumber, setDayNumber] = React.useState('');
	const [dayDate, setDayDate] = React.useState('');

	const handleMoveShootingDayChange = async (indexFrom, indexTo) => {
		const updatedShootingDays = reorderShootingDaysArr(shootingDays, indexFrom, indexTo);

		dispatch({
			type: ShootingDaysActionTypes.SET_SHOOTING_DAYS,
			payload: updatedShootingDays,
		});

		const firstShootingDate = getFirstShootingDate(shootingDays);
		await setDates(new Date(firstShootingDate), updatedShootingDays);
		setReorerd(false);
	};

	const getShootingDayStartTime = sd => sd?.shooting_day?.total_scenes?.map(scene => scene?.break?.inside.start.replace('AM', '').replace('PM', ''));
	const getShootingDayEndTime = sd => moment(sd?.shooting_day?.total_scenes[sd?.shooting_day?.total_scenes?.length - 1]?.timeEnd).format('HH:mm');

	return  (
		<>
		<div className="d-flex px-1">
		<div className="d-flex justify-content-center width-100-per mb-05">
			<div className="mb-0 bg-transparent height-min-content d-flex">
				<div className="d-flex justify-content-start align-items-center">
					<div className="font-medium-1 text-bold-700 mr-05 p-0"><FormattedMessage id="first_shoot"/></div>
					  <div className="ttt d-flex align-items-center bg-light-gray p-05 ml-1">
						 <Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
						  <Flatpickr
						  placeholder="First shooting day"
						  className="width-150 no-border height-auto cursor-pointer p-0 font-medium-1"
						  value={datepickerValue()}
						  options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", defaultDate: new Date()}}
						  onChange={(date:any) => { {
							setDates(date, shootingDays);
							dispatch({
								type: EventActionTypes.SET_EVENTS,
								payload: [
									{
										...activeEvent,
										date
									}
								]
							});
							setReorerd(false);
							// addProject({company_id: user.company_id, project_id: activeEvent.id, date})

						}}}
						/>
					  </div>
				</div>
				<div
					className="btn font-weight-bold p-05 ml-1"
					onClick={async () => {
						let updatedShootingDays = await addShootingDay({
							project_id: activeEvent.id,
							params: shootingDays ? shootingDays[0].params : [],
							shooting_day: {
								total_scenes: []
							}
						});

						const firstShootingDate = getFirstShootingDate(shootingDays);
						await setDates(new Date(firstShootingDate), updatedShootingDays);
						setReorerd(false);
					}}
				>
					+ <FormattedMessage id={'add_new'} />
				</div>
			</div>
			{shootingDaysPagination}
				<div className="d-flex float-right pr-1 margin-left-auto">
				<div onClick={()=> setIsListPreview(true)} className={classnames("cursor-pointer bg-light-gray p-075 ml-1",{
							"svg-warning": isListPreview
						})}>
					<Icon src={config.iconsPath+"options/vertical-view.svg"}  className="rotate-90" style={{width:'1rem'}}/>
				</div>
				{/* <List onClick={()=> setIsListPreview(true)} className={classnames("ml-1",{
							"text-warning": isListPreview
						})}/> */}
				<div onClick={()=> setIsListPreview(false)} className={classnames("cursor-pointer bg-light-gray p-075 ml-1", {
							"svg-warning": !isListPreview
						})}>
					<Icon src={config.iconsPath+"options/vertical-view.svg"} style={{width:'1rem'}} />
				</div>
				{/* <Maximize2 className={classnames("ml-1",{
					"position-fixed": isFullPage,
					"position-top-0": isFullPage,
					"position-right-0": isFullPage,
					"zindex-10002": isFullPage,
					"text-warning": isFullPage
				})} onClick={()=> setIsFullPage(!isFullPage)}/> */}
			</div>
		</div>
		</div>

		<DragDropContext
			onDragEnd={(r: DropResult) => {
				if (r.type === 'shootingDayItem') {
					onDragDayEnd(r)
				} else {
					onDragSceneEnd(r)
				}
			}}
		>
		<div
			className={classnames("d-flex-column overflow-auto",{
				"full-page": isFullPage,
				"d-flex shooting-days-columns-view": !isListPreview
			})}
		>
			<div ref={scrollDivRef} onScroll={handleScroll} className="overflow-auto height-100-per shootingDaysDroppable-container">
			<Droppable droppableId="shootingDaysDroppable" type="shootingDayItem" direction="horizontal" className="height-100-per">
				{(provided: DroppableProvided, snapshot: any): React.ReactElement => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{orderedShootingDays && orderedShootingDays.length && !loading ? (
							<div className={isListPreview ? 'overflow-auto' : 'overflow-auto d-flex height-100-per'} >
								{current.map((sd:any, sdi:number) => (
									<>
									<Draggable isDragDisabled={isListPreview} index={sdi} key={sd.id} draggableId={sdi.toString()}>
										{(DraggableProvided: DraggableProvided): React.ReactElement => (
											<div
												ref={DraggableProvided.innerRef}
												{...DraggableProvided.draggableProps}
												{...DraggableProvided.dragHandleProps}
											>
												<div key={sdi} className={classnames("list height-min-content pt-2",{"p-1": isListPreview, "px-05 width-18-rem min-width-18-rem": !isListPreview})}>
													<div className={classnames("d-flex justify-content-start align-items-center flex-wrap", {"mb-1": isListPreview})} style={{height: isListPreview ? null : '4.9rem'}}>
														<div className="bg-light-gray font-medium-1 p-05">
															<select
																className="border-none bg-transparent outline-none"
																value={dayNumber}
																onChange={e => handleMoveShootingDayChange(sdi, e.target.value)}
															>
																<option value={sdi+1}>{sdi+1}</option>
																{orderedShootingDays.filter(item => item.id !== sd.id).map((item, sd_index) => (
																	<option value={sd_index}>{sd_index + 1}</option>
																))}
															</select>
														</div>
														{sd.date ? (
															<div
																className={classnames("d-flex align-items-center bg-light-gray font-medium-1 p-05",{
																	"ml-1": isListPreview,
																	"ml-05": !isListPreview
																})}
															>
																<Icon src={config.iconsPath+"options/calendar.svg"} style={{height: '1rem', width: '1rem'}} className="mr-05"/>
																<select
																	className={classnames("border-none bg-transparent outline-none",{"width-9-rem": !isListPreview})}
																	value={dayDate}
																	onChange={e => handleMoveShootingDayChange(e.target.value, sdi)}
																>
																	<option value={sd.id}>
																		{sd.date ? moment(sd.date).locale(savedLocale ? savedLocale : 'he').format('LL') : ''}
																	</option>
																	{orderedShootingDays.filter(item => item.id !== sd.id).map(item => (
																		<option value={item.id}>
																			{item.date ? moment(item.date).locale(savedLocale ? savedLocale : 'he').format('LL') : ''}
																		</option>
																	))}
																</select>
															</div>
														):null}
														{sd?.shooting_day?.total_scenes && sd?.shooting_day?.total_scenes[0]?.break ? (
															<div
															className={classnames("bg-light-gray d-inline-block p-05",{
															"ml-1": isListPreview
														})}
															>
															{getShootingDayStartTime(sd)} - {getShootingDayEndTime(sd)}
															</div>
															):null}
														{sd?.shooting_day?.total_scenes.length > 0 ? (
															<div className={classnames({"ml-1": isListPreview, "ml-05": !isListPreview})}>
															{ eighthsFormat(sd?.shooting_day?.total_scenes.map(scene => scene.eighth)?.reduce((a, b) => a + b, 0)) }
															</div>
															):null}
														{sd?.shooting_day?.total_scenes.length === 0 ? (
															<div
															className="cursor-pointer"
															onClick={async () => {
															let newShootingDays = shootingDays.filter(item => item.id !== sd.id);
															let updatedShootingDays = await addShootingDays(newShootingDays);

															const firstShootingDate = getFirstShootingDate(shootingDays);
															await setDates(new Date(firstShootingDate), updatedShootingDays);
															setReorerd(false);
														}}
															>
															<XCircle
															size={25}
															/>
															</div>
															):null}
													</div>
													<div className="list-inner" onScroll={e => e.stopPropagation()}>
														<Droppable droppableId={String(sdi)} type="sceneItem">
															{(provided: DroppableProvided, snapshot: any): React.ReactElement => (
																<div ref={provided.innerRef} {...provided.droppableProps}>
																	{sd?.shooting_day?.total_scenes?.map((scene:any, scene_index:number) => {
																		const isBreakAfter =
																		scene.break &&
																		scene.timeStart &&
																		timeStringToNumber(scene.timeStart, scene.break.inside.start) >= scene.timeStart.getTime();
																		return (
																		<>
																		{scene.break && !isBreakAfter ? sceneBreak(scene.break, sdi, sd.id) : null}
																		<Draggable isDragDisabled={scene.scene_expanded} index={scene_index} key={scene.scene_id} draggableId={`${sdi}-${scene_index}`}>
																		{(DraggableProvided: DraggableProvided): React.ReactElement => (
																			<div
																				ref={DraggableProvided.innerRef}
																				{...DraggableProvided.draggableProps}
																				{...DraggableProvided.dragHandleProps}
																			>
																				<BreakDownScene
																					sd={sd}
																					sdId={sd.id}
																					isCollapsed
																					isListPreview={isListPreview}
																					scene={scene}
																					scene_index={scene_index}
																					script_index={sdi}
																					AddNewButton={AddNewButton}
																					changeScenePropValue={(
																						value,
																						field,
																						chapter_number,
																						scene_index,
																						script_index,
																						scene_time_id,
																						modifyAllScenes
																					) => {
																						if (['time_id', 'prepare', 'one_shot', 'reshoot'].includes(field)) {
																							setReorerd(false);
																						}
																						changeScenePropValue(
																							value,
																							field,
																							chapter_number,
																							scene_index,
																							script_index,
																							scene_time_id,
																							modifyAllScenes
																						);
																					}}
																					changeScenePropValueDB={changeScenePropValueDB}
																					onDragEnd={(r: any) =>
																						onDragEnd(r, scene_index, scene.chapter_number, sdi, scene.time_id)
																					}
																					onDelete={deleteRow}
																					onChange={changeSceneValue}
																					onBlur={changeSceneValueDB}
																					addNewProp={addNew}
																					setReorerd={setReorerd}
																				/>
																			</div>
																		)}
																		</Draggable>
																		{scene.break && isBreakAfter ? sceneBreak(scene.break, sdi, sd.id) : null}
																		</>
																		);
																	}
																		)}
																	{provided.placeholder}
																	{/*{shootingDaysAdditonal(sd,sdi)}*/}
																</div>
															)}
														</Droppable>
													</div>
												</div>
											</div>
										)}
									</Draggable>
									</>
								))}
							</div>
						):null}
					</div>
				)}
			</Droppable>
			</div>
		</div>
		</DragDropContext>
		</>
		)
	 }
);
export default ShootingDays;
