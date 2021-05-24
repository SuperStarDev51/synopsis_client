import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as moment from 'moment';
import classnames from 'classnames';
import * as shootingDaysActions from "../../../redux/actions/shooting-days"
import { TableType, ListView } from '@components';
import { Card, CardBody } from "reactstrap"
import { config } from '../../config';
import {ShootingDaysActionTypes} from "@containers/shooting_days/enums";
import {addScene} from "@containers/scripts/initial-state";
import {TaskCategory} from "@containers/budget/daily-budget/TaskCategory";

export const DailyBudget: React.FunctionComponent = ({ shootingDays, suppliers, sdActive }) => {
	const dispatch = useDispatch();
	const [TeamExtraHoursDailyFields, setTeamExtraHoursDailyFields] = React.useState<any>(['supplier_name', 'supplier_job_title', 'supplier_unit_cost']);
	const [TeamExtraHoursDailyFieldsActors, setTeamExtraHoursDailyFieldsActors] = React.useState<any>(['actor_name', 'character_name', 'supplier_unit_cost']);
	const [TeamExtraHoursDailyFieldsOthers, setTeamExtraHoursDailyFieldsOthers] = React.useState<any>(['description', 'supplier_unit_cost', 'supplier_unit_type']);
	const [initialDailyCost, setInitialDailyCost] = React.useState<number>(0);

	const suppliersOfActiveDay = suppliers.map(data => data.suppliers.default.filter(item => shootingDays[sdActive]?.suppliers?.includes(item.id)));
	const actorsOfActiveDayIds = shootingDays[sdActive]?.actors.map(actor => actor.id);
	const actorsOfActiveDay = suppliers.find(data => data.supplier_category === 'Actors').suppliers.default.filter( item => actorsOfActiveDayIds?.includes(item.id) )

	suppliersOfActiveDay = [...suppliersOfActiveDay, actorsOfActiveDay]

	const actorRows:any[] = shootingDays.map((sd:any, sdi:number) => {
		return sd && sd.characters && sd.characters ?
			sd.characters.map((character:any)=> {
				// 	let sd_date:any = sd && sd.date ?  sd.date : String(new Date())
				// 	let siteDateTime = new Date(timeStringToNumber(sd_date, supplier.site))
				// 	let endTimeDateTime = new Date(timeStringToNumber(sd_date, supplier.end_time))
				// 	let Hours:number = Number((durationBetweenDates(siteDateTime, endTimeDateTime) / 1000 / 60 / 60).toFixed(2))
				// 	let ExtraHours = Hours && shootingHours > 0 && (Hours - shootingHours) > 0 ? Number(Math.abs(Hours - shootingHours ).toFixed(2)) : 0
				return {
					...character,
					character_name: character.character_name,
					// hours: Hours,
					// extra_hours: ExtraHours,
				}}):[]
	});

	const tasksFromAllScenes = (taskName) => {
		let tasksFromAllScenesArr = [];
		shootingDays[sdActive]?.shooting_day?.total_scenes.forEach(scene => {
			if (scene[taskName].length) {
				tasksFromAllScenesArr = [...tasksFromAllScenesArr, ...scene[taskName]]
			}
		});
		return tasksFromAllScenesArr;
	};

	//get total tasks cost
	const tasksCategoriesList = [
		{name: 'props', color: '#6236ff'},
		{name: 'clothes', color: '#b620e0'},
		{name: 'makeups', color: '#0091ff'},
		{name: 'specials', color: '#663399'}
	];

	let totalTasksWithCost = [];
	tasksCategoriesList.forEach(taskCategory => {
		totalTasksWithCost = [...totalTasksWithCost, ...tasksFromAllScenes(taskCategory.name)]
	});

	const tasksCostsList = totalTasksWithCost
		.filter(totalTasksCostItem => totalTasksCostItem.cost !== undefined)
		.map(itemsWithCost => parseInt(itemsWithCost.cost));

	let totalTasksCost = 0;
	if (tasksCostsList.length > 0) {
		totalTasksCost = tasksCostsList.reduce((accumulator, currentValue) => accumulator + currentValue);
	}

	//get total suppliers cost
	let totalDailyCost = 0;
	for (let i = 0; i < suppliersOfActiveDay.length; i++) {
		for (let j = 0; j < suppliersOfActiveDay[i].length; j++) {
			totalDailyCost += parseInt(suppliersOfActiveDay[i][j].supplier_unit_cost);
		}
	}

	// add total tasks cost to total suppliers cost
	totalDailyCost += totalTasksCost;

	const shootingDayTotalScenes = shootingDays[sdActive]?.shooting_day.total_scenes;
	let otherCategoryNames = []
	for (let i = 0; i < shootingDayTotalScenes?.length; i++) {
		for (let j = 0; j < shootingDayTotalScenes[i].others?.length; j++) {
			otherCategoryNames.push(shootingDayTotalScenes[i].others[j].name)
		}
	}

	const selectShootingDay = index => {
		dispatch(shootingDaysActions.setShootingDayPreview(index));

		const suppliersOfActiveDay = suppliers.map(data => data.suppliers.default.filter(item => shootingDays[index]?.suppliers?.includes(item.id)))
		const actorsOfActiveDayIds = shootingDays[index]?.actors.map(actor => actor.id);
		const actorsOfActiveDay = suppliers.find(data => data.supplier_category === 'Actors').suppliers.default.filter( item => actorsOfActiveDayIds?.includes(item.id) )

		suppliersOfActiveDay = [...suppliersOfActiveDay, actorsOfActiveDay];

		let cost = 0;
		for (let i = 0; i < suppliersOfActiveDay.length; i++) {
			for (let j = 0; j < suppliersOfActiveDay[i].length; j++) {
				cost += parseInt(suppliersOfActiveDay[i][j].supplier_unit_cost);
			}
		}

		let totalTasksWithCost = [];
		tasksCategoriesList.forEach(taskCategory => {
			totalTasksWithCost = [...totalTasksWithCost, ...tasksFromAllScenes(taskCategory.name)]
		});

		const tasksCostsList = totalTasksWithCost
			.filter(totalTasksCostItem => totalTasksCostItem.cost !== undefined)
			.map(itemsWithCost => parseInt(itemsWithCost.cost));

		let totalTasksCost = 0;
		if (tasksCostsList.length > 0) {
			totalTasksCost = tasksCostsList.reduce((accumulator, currentValue) => accumulator + currentValue);
		}

		console.log('totalTasksCost: ', totalTasksCost)
		cost += totalTasksCost;
		setInitialDailyCost(cost);
	};

	React.useEffect(() => {
		selectShootingDay(sdActive);

		return function cleanup () {
		}
	}, []);

	return (
		<>
		<div>
			{shootingDays && shootingDays.length ? (
				<Card className="mt-1 mb-3">
					<CardBody>
						<div className="row">
							{shootingDays.map((shootingDay: any, index: number) => (
								<div
									key={index}
									className="col-1 p-02"
								>
									<button
										className={classnames("btn p-05 w-100 d-flex align-items-center", {
											'btn-primary': index === sdActive,
											'btn-outline-primary' : index !== sdActive,
										})}
										onClick={() => selectShootingDay(index)}
									>
										<small
											style={{minWidth: '1.1rem'}}
											className="opacity-08 mr-02"
										>
											{index + 1}.
										</small>
										<div>
											{shootingDay.date ? moment(shootingDay.date).format('D MMM') : 'No date'}
										</div>
									</button>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			):null}
		</div>
		<div className="row">
			<div className="col-6">
				<div className="mt-1 mb-2 ml-2 h1 text-bold-600 text-capitalize">
					Daily cost{totalDailyCost > 0 && (
					<>
					:&nbsp;
					<span className="text-danger">{totalDailyCost}</span>&nbsp;
					<small>
						{(initialDailyCost - totalDailyCost) !== 0 &&
						<>
							<span className="text-success">
								({(initialDailyCost - totalDailyCost) > 0 ? '-' : '+'}{Math.abs(initialDailyCost - totalDailyCost)})
							</span>
						</>
						}
					</small>
					</>
					)}
				</div>

				{actorRows[sdActive] ? (
					<ListView
						fields={TeamExtraHoursDailyFieldsActors}
						setFields={setTeamExtraHoursDailyFieldsActors}
						type={TableType.BUDGET_DAILY}
						list={suppliers.find(category => category.supplier_category === 'Actors')}
						category="Actors"
						rows={actorRows[sdActive] ? actorRows[sdActive] : []}
					/>
				):null}

				{suppliers.map((data: any, index: number) => {
					let fields = [];
					let setFields = [];
					if (data.supplier_category === 'Production' || data.supplier_category ===  'Technical') {
						fields = TeamExtraHoursDailyFields;
						setFields = setTeamExtraHoursDailyFields;
					} else {
						fields = TeamExtraHoursDailyFieldsOthers;
						setFields = setTeamExtraHoursDailyFieldsOthers;
					}

					const suppliersOfActiveDay = data.suppliers.default.filter(item => shootingDays[sdActive]?.suppliers?.includes(item.id))

					let categoryTotalCost = 0;
					suppliersOfActiveDay.forEach(item => categoryTotalCost += parseInt(item.supplier_unit_cost));


					if (suppliersOfActiveDay.length) {
						return (
							<ListView
								fields={fields}
								setFields={setFields}
								id={data.id}
								type={TableType.BUDGET_DAILY}
								index={index}
								list={data}
								category={data.supplier_category + ': ' + categoryTotalCost}
								rows={suppliersOfActiveDay}
								titles={data.supplier_title}
							/>
						)
					} else {
						return null;
					}
				})}
			</div>
			<div className="col-6">
				<div className="mt-1 mb-3 h1 ml-2 text-bold-600 text-capitalize">
					Breakdown
				</div>
				{shootingDays[sdActive] ? (
					<>
					{tasksCategoriesList.map(taskCategory => (
						<TaskCategory
							activeShootingDay={shootingDays[sdActive]}
							tasksFromAllScenesList={tasksFromAllScenes}
							categoryName={taskCategory.name}
							color={taskCategory.color}
						/>
					))}
					</>
				):null}
			</div>
		</div>
		</>
	)
};

export default DailyBudget;
