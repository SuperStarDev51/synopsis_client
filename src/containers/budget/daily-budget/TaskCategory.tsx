import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { config } from '../../../config';
import { Icon } from '@components';
import {ShootingDaysActionTypes} from "@root/src/containers/shooting_days/enums";
import {addScene} from "@containers/scripts/initial-state";
import {RootStore} from "@root/src/store";

export const TaskCategory: React.FunctionComponent = ({ tasksFromAllScenesList, categoryName, color, activeShootingDay }) => {
	const events = useSelector((state: RootStore) => state.events);
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [isCollapsed, setIsCollapsed] = React.useState(false);
	const dispatch = useDispatch();

	const costsArr = tasksFromAllScenesList(categoryName).filter(item => item.cost !== undefined).map(item => parseInt(item.cost));
	let totalCategoryCost = 0;
	if (costsArr.length) {
		totalCategoryCost = costsArr.reduce((accumulator, currentValue) => accumulator + currentValue);
	}

	let tasksFromAllScenes = [];

	activeShootingDay.shooting_day.total_scenes.forEach(scene => {
		if (scene[categoryName].length) {
			tasksFromAllScenes.push({
				chapterNumber: scene.chapter_number,
				sceneNumber: scene.scene_number,
				sceneId: scene.scene_id,
				[categoryName]: scene[categoryName]
			})
		}
	});

	return (
		<>
		{tasksFromAllScenes.length ? (
			<div>
				<div
					style={{color: color}}
					className="font-medium-3 text-capitalize mb-1 cursor-pointer d-flex align-items-center"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					<span>{categoryName}</span>{totalCategoryCost > 0 &&<span>: {totalCategoryCost}</span>}
					{isCollapsed
						? <Icon className="ml-05" src={config.iconsPath+"options/dropdown-up-black.svg"}/>
						: <Icon className="ml-05" src={config.iconsPath+"options/dropdown-down.svg"}/>
					}
				</div>
				{isCollapsed ? (
					<div className="mb-2">
					{tasksFromAllScenes.map(item => (
						<div className="row mb-1">
							<div className="col-1" style={{paddingTop: '1.1rem'}}>
								<span>{item.sceneId}</span>
							</div>
							<div className="col-8 bg-light-gray pt-05">
								{item[categoryName].map(categoryItem => (
									<div className="row mb-05 align-items-center">
										<div className="col-6"><span>{categoryItem.def}</span></div>
										<div className="col-6">
											<input
												className="form-control width-100"
												value={categoryItem.cost}
												type="number"
												onChange={e => {
													dispatch({
														type: ShootingDaysActionTypes.UPDATE_SHOOTING_DAY_TASK_COST,
														payload: {
															def: categoryItem.def,
															cost: e.target.value,
															categoryName: categoryName,
															shootingDayId: activeShootingDay.id,
															sceneId: item.sceneId,
														}
													})
												}}
												onBlur={() => {
													let scene = {
													 chapter_number: item.chapterNumber,
													 project_id: activeEvent.id,
													 [categoryName]: item[categoryName],
													 scene_number: item.sceneNumber,
													};
													addScene(scene);
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				):null}
			</div>
			) : null}
		</>
	)
};

export default TaskCategory;
