import * as React from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { RootStore } from '@src/store';
import { SweetAlertCallback } from '@extensions'
import { Event } from '@containers/planning/interfaces';
import classnames from 'classnames';
import { ChevronLeft, ChevronRight, XCircle, ChevronDown, List, Columns } from "react-feather"
import { Icon } from '@components';
import { config } from '../../config';
import { FormattedMessage } from "react-intl"
import * as scenesBreakdownActions from "../../redux/actions/scenes-breakdown"
import {
	Pagination,
	PaginationItem,
	PaginationLink,
	Button,
	Row,
	Col
} from "reactstrap"
import {
	DropResult,
	DraggableLocation,
} from 'react-beautiful-dnd';
import { BreakDownScene } from '@components';
import { Script } from '@containers/scripts/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDidUpdateEffect from '@src/utilities/useDidUpdateEffect';
import { deleteEpisode } from "@containers/scripts/initial-state";
import {ScriptsActionTypes} from "@root/src/containers/scripts/enums";

const ITEMS_PER_PAGE = 10;

interface Props {
	readonly addNew: (script_index: number, scene_index: number, type: string, scene: any, defaultValue?: string) => void;
	readonly changeScenePropValue: (value: any, field: string, chapter_number: number, scene_index: number, script_index: number, scene_time_id?: number) => void;
	readonly changeScenePropValueDB: (value: any, field: string, scene_number: number, chapter_number: number) => void;
	readonly isHeaderFixed: boolean;
}


export const BreakDown: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const { isHeaderFixed, addNew, changeScenePropValue, changeScenePropValueDB } = props
	const dispatch = useDispatch();
	const scripts = useSelector((state: RootStore) => state.scripts)
	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const customizer = useSelector((state: RootStore) => state.customizer.customizer)
	const [preview, setPreview] = React.useState<any>(1);
	const [scenePreview, setScenePreview] = React.useState<any>(null);
	const [isListPreview, setIsListPreview] = React.useState<boolean>(true);
	const [showdeleteAlert, setShowdeleteAlert] =  React.useState<any>(false);
	const [pagiScript, setPagiScript] = React.useState<any>([{ name: 'episode', start: 0, end: 20 }, { name: 'scene', start: 0, end: 20 }])
	let script_index = scripts ? scripts.findIndex(s => s.chapter_number == preview) : -1

	const previousPagi = (pagi: number): void => {
		let newPagiScript = pagiScript
		newPagiScript[pagi].start = pagiScript[pagi].start - 1
		newPagiScript[pagi].end = pagiScript[pagi].end - 1
		setPagiScript([...newPagiScript])
	}
	const nextPagi = (pagi: number): void => {
		let newPagiScript = pagiScript
		newPagiScript[pagi].start = pagiScript[pagi].start + 1
		newPagiScript[pagi].end = pagiScript[pagi].end + 1
		setPagiScript([...newPagiScript])
	}

	const onDragEnd = (result: DropResult, scene_index: number, chapter_number: number, script_index: number): void => { //characters
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		var lists = scripts[script_index].scenes

		let source_type = Number(source.droppableId)
		let destination_type = Number(destination.droppableId)
		let list = lists[scene_index].characters
		list[source.index].character_type = destination_type
		changeScenePropValue(list, 'characters', chapter_number, scene_index, script_index)
	};

	const [count, setCount] = React.useState({
		prev: 0,
		next: ITEMS_PER_PAGE
	})
	const [hasMore, setHasMore] = React.useState(true);
	const [current, setCurrent] = React.useState(scripts[script_index]?.scenes.slice(count.prev, count.next))

	const getMoreData = () => {
		if (current.length === scripts[script_index].scenes.length) {
			setHasMore(false);
			return;
		}
		setCurrent(current.concat(scripts[script_index].scenes.slice(count.prev + ITEMS_PER_PAGE, count.next + ITEMS_PER_PAGE)))
		setCount((prevState) => ({ prev: prevState.prev + ITEMS_PER_PAGE, next: prevState.next + ITEMS_PER_PAGE }))
	}

	useDidUpdateEffect(() => {
		setCurrent(
			scripts[script_index].scenes?.slice(
				0,
				hasMore ? count.prev || ITEMS_PER_PAGE : scripts[script_index].scenes.length
			)
		);
	}, [scripts]);

	useDidUpdateEffect(() => {
		window.scrollTo({ top: 0 });
		setCurrent(
			scripts[script_index].scenes.slice(0, ITEMS_PER_PAGE)
		);
		setCount({ prev: 0, next: ITEMS_PER_PAGE, });
		setHasMore(true);
	}, [preview]);

	const handleScrollTo = (index: number) => {
		setScenePreview(index + 1);

		if (!current[index]) {
			setCurrent(scripts[script_index].scenes.slice(0, index + 1));
			setCount({ prev: index - ITEMS_PER_PAGE + 1, next: index });
		}

		setTimeout(() => {
			const yOffset = -230;
			const element = document.querySelector('div[id="' + script_index + '-' + index + '"]');
			if (!element) {
				return;
			}
			const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		});

		setTimeout(() => {
			setScenePreview(null);
		}, 1000);
	};

	const handleDeleteEpisode = chapterNumber => {
		dispatch({
			type: ScriptsActionTypes.DELETE_EPISODE,
			payload: {chapterNumber}
		});

		deleteEpisode(activeEvent.id, chapterNumber);
	};

	return (
		<>
			<div className={classnames({
				'position-fixed': isHeaderFixed,
				'position-top-10': isHeaderFixed,
				'width-100-per': isHeaderFixed,
				'zindex-4': isHeaderFixed,
				'bg-white': isHeaderFixed,
				'overflow-auto': isHeaderFixed,
			})}>  {/*/className="breakdown-navbar-overlay bg-body"> */}
				{/* {!isHeaderFixed && (<div className="d-flex float-right pr-1">
					<div onClick={() => setIsListPreview(true)} className={classnames("cursor-pointer btn bg-light-gray p-075 ml-1", {
						"svg-warning": isListPreview
					})}>
						<Icon src={config.iconsPath + "options/vertical-view.svg"} className="rotate-90" style={{ width: '1rem' }} />
					</div>
					
					<div onClick={() => setIsListPreview(false)} className={classnames("cursor-pointer btn bg-light-gray p-075 ml-1", {
						"svg-warning": !isListPreview
					})}>
						<Icon src={config.iconsPath + "options/vertical-view.svg"} style={{ width: '1rem' }} />
					</div>
					
				</div>)} */}
				{pagiScript.map((pagi: any, pagi_index: number) => {
					let isClickNextActive = pagi_index == 1 && scripts[script_index] && scripts[script_index].scenes ? scripts[script_index].scenes[pagiScript[pagi_index].end] : pagiScript[pagi_index].end + 1 < scripts.length

					return (
						<div key={pagi_index} className={classnames("mx-1 d-flex align-items-center", {
							"mt-1": pagi_index == 0 && !isHeaderFixed
						})}>
							<div className={classnames({ "mb-1": isHeaderFixed })}>
								<FormattedMessage id={pagi.name} />
							</div>
							<Pagination className={classnames("d-flex ml-1 justify-content-start pagination-imgn-gray", {
								"mt-1": !isHeaderFixed
							})} >
								{pagiScript[pagi_index].start - 1 >= 0 ? (
									<PaginationItem>
										<PaginationLink onClick={() => previousPagi(pagi_index)} first>
											{customizer.direction == 'ltr' ? <ChevronLeft /> : <ChevronRight />}
										</PaginationLink>
									</PaginationItem>
								) : <div />}

								{pagi_index == 1 && scripts[script_index] && scripts[script_index].scenes ?
									scripts[script_index].scenes.map((scene: any, index: number) => pagiScript[pagi_index].start <= index && index < pagiScript[pagi_index].end && (
										<PaginationItem key={index} active={index + 1 == scenePreview} className={pagi_index == 1 ? 'rounded' : ''} >
											<PaginationLink className={pagi_index == 1 ? 'rounded' : ''}
												onClick={() => handleScrollTo(index)}
											>
												{index + 1}
											</PaginationLink>
										</PaginationItem>
									))
									:
									scripts.map((script: Script, index: number) => pagiScript[pagi_index].start <= index && index < pagiScript[pagi_index].end && (
										<PaginationItem
											key={index}
											active={preview == script.chapter_number}
											className="show-on-hover-container position-relative"
										>
											{scripts.length > 1 &&
											preview !== script.chapter_number && (
												<>
												<XCircle
													className="position-absolute show-on-hover-item zindex-4 top-minus-05 right-minus-05 cursor-pointer"
													size={20}
													onClick={(): void => setShowdeleteAlert(true)}
												/>
												{showdeleteAlert ? (
													<SweetAlertCallback
														showAlert={true}
														toogle={() => setShowdeleteAlert(!showdeleteAlert) }
														onConfirm={() => {
															handleDeleteEpisode(script.chapter_number)
															setShowdeleteAlert(false)
														}}
													/>) : null}
												</>
											)}
											<PaginationLink
												onClick={() => {
													setPreview(script.chapter_number);
													setCount({
														prev: 0,
														next: ITEMS_PER_PAGE
													});
													setCurrent(script.scenes.slice(0, ITEMS_PER_PAGE));
												}}
											>
												{script.chapter_number}
											</PaginationLink>
										</PaginationItem>
									))
								}

								{isClickNextActive ? (
									<PaginationItem>
										<PaginationLink onClick={() => nextPagi(pagi_index)} last>
											{customizer.direction == 'ltr' ? <ChevronRight /> : <ChevronLeft />}
										</PaginationLink>
									</PaginationItem>
								) : <div />}
							</Pagination>
						</div>
					)
				})}
			</div>
			<Row className="p-1 mt-2">
				{scripts?.[script_index]?.scenes?.length > 0 && <InfiniteScroll
					dataLength={current.length}
					next={getMoreData}
					hasMore={hasMore}
					className={isListPreview ? '' : 'row'}
				>
					{current.map((scene: any, scene_index: number) => (
						<Col
							key={scene.scene_id}
							className={classnames("mb-1", {
								"px-05 col-auto width-250": !isListPreview
							})}
						>
							<BreakDownScene
								isCollapsed
								isListPreview={isListPreview}
								scene={scene}
								scene_index={scene_index}
								script_index={script_index}
								changeScenePropValue={changeScenePropValue}
								changeScenePropValueDB={changeScenePropValueDB}
								onDragEnd={(r: any) => onDragEnd(r, scene_index, scene.chapter_number, script_index)}
								addNewProp={addNew}
							/>
						</Col>
					))}
				</InfiniteScroll>}
			</Row>
		</>
	)
}
);
