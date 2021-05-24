import * as React from 'react';
import SVG from 'react-inlinesvg';
import classnames from "classnames"
import { useDispatch, useSelector } from 'react-redux';
import { addShootingDay } from '@containers/shooting_days/initial-state';
import { FormattedMessage } from "react-intl"
import { RootStore } from '@src/store';
import Chart from "react-apexcharts"
import * as moment from 'moment'
import { useIntl } from 'react-intl';
import { Card, CardBody, CardHeader, Col, Progress, Row, Input } from "reactstrap"
import { Expense, ExpenseGroup} from '@containers/budget/interfaces'
import * as shootingDaysActions from "../../redux/actions/shooting-days"
import {timeStringToNumber, durationBetweenDates} from '../../helpers/helpers'
import { Table, TableType } from '@components'
import { Event } from '@containers/planning/interfaces';
import { ShootingDay, shootingDayObj } from '../shooting_days/interfaces';
import Suppliers from '../suppliers';
import { SSL_OP_ALL } from 'constants';
import { SupplierJobTitlesActionTypes } from '../tasks/ListsReducer';
import { filledButtons } from '@src/components/reactstrap/buttons/ButtonsSourceCode';

let $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $info = "#00cfe8",
  $label_color_light = "#dae1e7"


export const Overview: React.FC = () => {
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();

	const state = useSelector((state: RootStore) => state);
	const activeEvent = state.events.filter((event: Event) => {return event.preview})[0]
	const eventBudget = activeEvent ? activeEvent.budget : 0;
	const allSummaries = state.overview
	const shootingDays = useSelector((state: RootStore) => state.shootingDays)
	const suppliersLists = useSelector((state: RootStore) => state.suppliers )
	const suppliersRootStore:any[] = suppliersLists.map((suppliers, listIndex)=> {if( listIndex != 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const ActorsRootStore:any[] = suppliersLists.map((suppliers, listIndex)=> {if( listIndex == 0 && suppliers.suppliers &&  suppliers.suppliers.default )  return suppliers.suppliers.default; else return  }).filter(a=>a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);
	const sdActive = shootingDays.findIndex((sd: ShootingDay) => sd.preview);
	const shootingDaysThatNotShootYet:any = shootingDays.map(sd=> {return new Date(sd.date).getTime() > new Date().getTime() ? sd : undefined }).filter(a=>a)
	const shootingDaysThatShooted:any = shootingDays.map(sd=> {
	return new Date(sd.date).getTime() < new Date().getTime() ? sd : undefined }).filter(a=>a)
	const inisdeLength = shootingDays.map((sd: any)=> sd && sd.shooting_day && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes.filter((scene:any)=> scene.location == 'פנים').length : 0)
	const OutsideLength = shootingDays.map((sd: any)=> sd && sd.shooting_day && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes.filter((scene:any)=> scene.location == 'חוץ').length : 0)
	const expenses = state.expenses;
	const [calculatedRawTime, setCalculatedRawTime] = React.useState<number>(0);
	const [calculatedScreenTime, setCalculatedScreenTime] = React.useState<number>(0);
	const [calculatedExpenses, setCalculatedExpenses] = React.useState<number>(0);
	const [calculatedPayed, setCalculatedPayed] = React.useState<number>(0);
	const [ExtendedDays, setExtendedDays] = React.useState<any>([]);
	let location = shootingDays[0] && shootingDays[0].shooting_day.total_scenes[0]?.location == 'פנים' ?  'inside' : 'outside'
	let shooting_hours = shootingDays[0] ? shootingDays[0].params.find(p=> p.type == 'shooting_hours') : null
	let shootingHoursStartDateTime = shooting_hours && shooting_hours[location] ?  new Date(timeStringToNumber(String(new Date()), shooting_hours[location].start)) : null
	let shootingHoursEndDateTime = shooting_hours && shooting_hours[location] ? new Date(timeStringToNumber(String(new Date()), shooting_hours[location].end)) :null
	let shootingHours = shootingHoursStartDateTime && shootingHoursEndDateTime ? (durationBetweenDates(shootingHoursStartDateTime, shootingHoursEndDateTime) / 1000 / 60 / 60) : 0

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

	const shootingDaySuppliersIds =  shootingDays &&
		sdActive !== -1 &&
		shootingDays[sdActive] &&
		shootingDays[sdActive].suppliers &&
		shootingDays[sdActive].suppliers

	const shootingDaySuppliers = suppliers &&
		shootingDaySuppliersIds &&
		suppliers.filter(supplier => shootingDaySuppliersIds.includes(supplier.id));

	// const employeeRows:any[] = shootingDays.map((sd:any, sdi:number) => {
	// 	return sd?.employees?.map((employee:any) => {
	// 		console.log('employee: ', employee)
	// 		//let sd_date:any = sd && sd.date ?  sd.date : String(new Date())
	// 		//let siteDateTime = new Date(timeStringToNumber(sd_date, supplier.site))
	// 		//let endTimeDateTime = new Date(timeStringToNumber(sd_date, supplier.end_time))
	// 		//let Hours:number = Number((durationBetweenDates(siteDateTime, endTimeDateTime) / 1000 / 60 / 60).toFixed(2))
	// 		//let ExtraHours = Hours && shootingHours > 0 && (Hours - shootingHours) > 0 ? Number(Math.abs(Hours - shootingHours ).toFixed(2)) : 0
	// 		return {
	// 			...employee,
	// 			hours: Hours,
	// 			extra_hours: ExtraHours,
	// 		}
	// 	})
	// })


	const employeeRows:any[] = shootingDays.map((sd:any, sdi:number) => {
		return sd?.employees
	})

React.useEffect(() => {
		// const NewExtendedDays:any[] = []
		//  shootingDays.forEach((sd,sdi) => {
		// 	let allSuppliers = actorRows[sdi] && employeeRows[sdi] ? [...actorRows[sdi],...employeeRows[sdi]] : null
		//  if( allSuppliers ) {
		// 	let hours_amount =  allSuppliers.map(a=>a.extra_hours).reduce((acc: number, extra_hours: any) => {return acc + Number(extra_hours)}, 0)
		// 	let amount = allSuppliers.reduce((acc: number, actor: any) => {
		// 		let extra_hours_array:any = actor && actor.extra_hours && actor.extra_hours > 0 ?  Array.from(Array(actor.extra_hours).keys()) : []
		// 		if( shootingHours && extra_hours_array.length &&  actor.supplier_unit_cost > 0  ) {
		// 			let actor_cost_hourly = actor.supplier_unit_cost/shootingHours
		// 			let actor_extra_hours_amount_array:any = extra_hours_array.map((l:any,h:number) =>  h == 0 ?
		// 			(Number(( actor_cost_hourly * actor.percentage1) /100)) :
		// 			(Number(( actor_cost_hourly * actor.percentage2) /100)))
		// 			let actor_extra_hours_amount:any = actor_extra_hours_amount_array.reduce((acc: number, extra_hours: any) => {return acc+ extra_hours},0)
		// 			return acc + actor_extra_hours_amount
		// 		} else return acc
		// 		 } ,0)
		// 		if( amount > 0) {
		// 		 NewExtendedDays.push({
		// 		date: sd.date,
		// 		hours_amount,
		// 		amount
		// 		});
		// 		}
		// 	}
		// })
		 //setExtendedDays(NewExtendedDays)

		const calculatedRawTime = shootingDays.reduce((acc: number, sd: any) => {
			const subTotal = sd.shooting_day.total_scenes && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes.reduce((sub: number, scene: any) => {
				return  scene.raw_time ?  sub + Number(scene.raw_time) :  scene.one_shoot && scene.reshoots && scene.prepare ?  sub + ((Number(scene.one_shoot) * Number(scene.reshoots)) + Number(scene.prepare)) : sub;
			}, 0): 0;
			return acc + subTotal;
		}, 0);
		setCalculatedRawTime(calculatedRawTime);

		const calculatedScreenTime = shootingDays.reduce((acc: number, sd: any) => {
			const subTotal = sd.shooting_day.total_scenes && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes.reduce((sub: number, scene: any) => {
				return  scene.screen_time ?  sub + Number(scene.screen_time) : scene.one_shoot ?   sub + Number(scene.one_shoot) : sub;
			}, 0): 0;
			return acc + subTotal;
		}, 0);
		setCalculatedScreenTime(calculatedScreenTime);


		const calculatedExpenses = expenses && expenses.length ? expenses.reduce((acc: number, data: ExpenseGroup) => {
			const subTotal = data.budgets && data.budgets.default ? data.budgets.default.reduce((sub: number, subrow: Expense) => {
				return sub + Number(subrow.price);
			}, 0): 0;

			return acc + subTotal;
		}, 0): 0;
		setCalculatedExpenses(calculatedExpenses);


		const calculatedPayed = expenses.reduce((acc: number, data: ExpenseGroup) => {
			if( data.budgets && data.budgets.default ) {
				var subTotal = 0
				data.budgets && data.budgets.default.forEach(expense => {
					const subTotalPayments = expense.payments ? expense.payments.reduce((sub: number, subrow: any) => {
						return  subrow.amount_paid  ? sub + Number(subrow.amount_paid) : sub;
					}, 0) : 0
					subTotal += subTotalPayments
				});
				return acc + subTotal;
			} else return 0
		}, 0);
		setCalculatedPayed(calculatedPayed);

	},[state]);


	let allExtraExpenses:any[] = Array.prototype.concat.apply([], shootingDays.map((sd:ShootingDay) => {
		let ee = sd.post_shooting_day.extra_expenses
			return ee && ee.length ?  ee.filter(a=>a).map((ee:any) => {
			let total = ee.quantity ? ee.price * ee.quantity : ee.price ? ee.price  : 0
			return {
				date: sd.date ? moment(sd.date).format('DD/MM/YYYY') : null,
				description: ee.description,
				amount: total
			}
		}) : []
	}))

	let categories =  shootingDays.map((sd:any, sdi:number)=> moment(sd.date).format('DD/MM'))
	let data =  shootingDays.map((sd:any, sdi:number)=> {
	let location = shootingDays[sdi] &&  shootingDays[sdi].shooting_day && shootingDays[sdi].shooting_day.total_scenes &&  shootingDays[sdi].shooting_day.total_scenes[0] && shootingDays[sdi].shooting_day.total_scenes[0].location == 'פנים' ?  'inside' : 'outside'
	let shooting_hours = shootingDays[sdi] && shootingDays[sdi].params && shootingDays[sdi].params.length ? shootingDays[sdi].params.find(p=> p.type == 'shooting_hours') : null
	let shootingHoursStartDateTime = shooting_hours && shooting_hours[location] ?  new Date(timeStringToNumber(String(new Date()), shooting_hours[location].start)) : null
	let shootingHoursEndDateTime = shooting_hours && shooting_hours[location] ? new Date(timeStringToNumber(String(new Date()), shooting_hours[location].end)) :null
	let shootingHours = shootingHoursStartDateTime && shootingHoursEndDateTime ? (durationBetweenDates(shootingHoursStartDateTime, shootingHoursEndDateTime) / 1000 / 60 / 60) : 0
		return shootingHours
	})
	const options =  {
		chart: {
			events: {
				dataPointSelection: (event, chartContext, config) => {
					// this will print mango, apple etc. when clicked on respective datapoint
					dispatch(shootingDaysActions.setShootingDayPreview(config.dataPointIndex))
				}
			},
		  stacked: true,
		  toolbar: { show: false }
		},
		plotOptions: {
		  bar: {
			columnWidth: "20%"
		  }
		},
		colors: ['#005bb0', '#ff0000'],
		dataLabels: {
		  enabled: false
		},
		grid: {
		  borderColor: '#ffffff',
		  padding: {
			left: 0,
			right: 0
		  }
		},
		legend: {
		  show: true,
		  position: "top",
		  horizontalAlign: "left",
		  offsetX: 0,
		  fontSize: "14px",
		  markers: {
			radius: 50,
			width: 10,
			height: 10
		  }
		},
		xaxis: {
		  labels: {
			style: {
			  colors: '#000000'
			}
		  },
		  axisTicks: {
			show: false
		  },
		  categories,
		  axisBorder: {
			show: false
		  }
		},
		yaxis: {
		  tickAmount: 5,
		  labels: {
			style: {
			  color: '#000000'
			}
		  }
		},
		tooltip: {
		  x: { show: true }
		}
	  };
	  const series = [{ name: formatMessage({id:'duration'}), data }];

	return (
			<div>
				<Card>
				<CardBody>
				<Row className="d-flex justify-content-between font-medium-2">

				<Col xs="12">
					<div>
						<div className="font-large-1 mb-05 text-primary text-bold-700"><FormattedMessage id="total"/> {eventBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
						<div className="bg-primary" style={{padding:4}}>
							<Progress barClassName="square" className="bg-transparent square progress-xxl mb-0 position-relative" value={(calculatedPayed * eventBudget) /100} color={calculatedPayed < eventBudget  ? "white" : "white"}
								 >
								<div className="d-flex justify-content-between position-absolute font-medium-2 webkit-fill-available px-2 text-secondary">
									<div className={`${calculatedPayed <= 0  ? "text-white" : "text-primary"}`}><FormattedMessage id="paid"/> {calculatedPayed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
								</div>
							</Progress>
						</div>
					</div>
					{/*<Row className="mt-1">*/}
						{/*{[*/}
							{/*{*/}
								{/*title: formatMessage({id: 'unplanned_expenses'}),*/}
								{/*items: `${allExtraExpenses.length} ${formatMessage({id: 'items'})}`,*/}
								{/*total: allExtraExpenses && allExtraExpenses.length ? allExtraExpenses.reduce((acc:number, cv:any) => cv.amount && Number(cv.amount) > 0  ? acc + Number(cv.amount) : acc,0) : 0,*/}
								{/*fields: ['date', 'description', 'amount'],*/}
								{/*rows: allExtraExpenses*/}

							{/*},*/}
							{/*{*/}
								{/*title: formatMessage({id: 'extended_days'}),*/}
								{/*items: `${ExtendedDays.length} ${formatMessage({id: 'days'})}`,*/}
								{/*total: ExtendedDays && ExtendedDays.length ? ExtendedDays.reduce((acc:number, cv:any) => cv.amount && Number(cv.amount) > 0  ? acc + Number(cv.amount) : acc,0).toFixed(2) : 0,*/}
								{/*fields: ['date', 'hours_amount', 'amount'],*/}
								{/*rows: ExtendedDays.map((ed:any) => {*/}
									{/*return {*/}
										{/*date: moment(ed.date).format('DD/MM/YYYY'),*/}
										{/*hours_amount: ed.hours_amount,*/}
										{/*amount: ed.amount ? Number(ed.amount).toFixed(0) : 0*/}
									{/*}*/}
								{/*})*/}
							{/*}*/}
						{/*].map(box=> (*/}
							{/*<Col xs="12" md="6">*/}
								{/*<Card className="height-auto border">*/}
									{/*<CardHeader className="d-flex align-items-start flex-column text-center">*/}
										{/*<div className="text-bold-600 font-medium-4">{box.total}</div>*/}
										{/*<div className="text-bold-600 font-medium-4">{box.title}</div>*/}
										{/*<div className="font-small-3">{box.items}</div>*/}
										{/*<div className="my-1 d-flex justify-content-between width-90-per font-medium-4">*/}
										{/*</div>*/}
									{/*</CardHeader>*/}
									{/*<CardBody className="text-center">*/}
										{/*<Row className="my-1 border">*/}
											{/*{box.fields.map(field => (*/}
												{/*<Col className="bg-light-gray border-2  border-left border-color-white"><FormattedMessage id={field}/></Col>*/}
											{/*))}*/}
										{/*</Row>*/}
										{/*{box.rows ?*/}
										{/*box.rows.map((row:any) => (*/}
										{/*<Row className="mb-1">*/}
											{/*{box.fields.map((field:any) => (*/}
												{/*<Col className="bg-light-gray border-2  border-left border-color-white">>{row[field]}</Col>*/}
											{/*))}*/}
										{/*</Row>*/}
										{/*)):null}*/}
									{/*</CardBody>*/}
								{/*</Card>*/}
							{/*</Col>*/}
						{/*))}*/}

					{/*</Row>*/}
				 </Col>

				<Col xs="12" className="d-flex flex-wrap">
				<Row>
				 {[
					 {
						hide: !shootingDays || !shootingDays.length,
						title: `${formatMessage({id:'shooting_day'})}`,
						subTitle:`(${formatMessage({id:'inside'})}
						${shootingDays.map((sd:ShootingDay)=> sd && sd.shooting_day && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes[0]?.location == 'פנים' : null).filter(a=>a).length} /
						${formatMessage({id:'outside'})}
						${shootingDays.map((sd:ShootingDay)=> sd && sd.shooting_day && sd.shooting_day.total_scenes ? sd.shooting_day.total_scenes[0]?.location == 'חוץ' : null).filter(a=>a).length})`,
						labels:[formatMessage({id:'not_shooted'}), formatMessage({id:'shooted'})],
						colors: [ '#b620e0', '#7f169d'],
						series: [shootingDaysThatNotShootYet.length,shootingDaysThatShooted.length]
					 },
					 {
						hide: !shootingDays || !shootingDays.length,
						title: `${formatMessage({id:'scenes'})}`,
						subTitle: `(${formatMessage({id:'inside'})}
						${inisdeLength && inisdeLength.length ? inisdeLength.reduce((accumulator, currentValue) => accumulator + currentValue) : 0} /
						${formatMessage({id:'outside'})}
						${OutsideLength && OutsideLength.length ? OutsideLength.reduce((accumulator, currentValue) => accumulator + currentValue) : 0})`,
						labels:[formatMessage({id:'not_shooted'}), formatMessage({id:'shooted'})],
						colors: [ '#ffbb00', '#cc9600'],
						series: [shootingDaysThatNotShootYet && shootingDaysThatNotShootYet.length ? shootingDaysThatNotShootYet.reduce((accumulator:number, currentValue:any) => {
																									let cv = currentValue.shooting_day && currentValue.shooting_day.total_scenes ? currentValue.shooting_day.total_scenes.length : 0;
																									return accumulator + cv
																									},0) : 0,
								shootingDaysThatShooted && shootingDaysThatShooted.length ? shootingDaysThatShooted.reduce((accumulator:number, currentValue:any) => {
																							let cv = currentValue.shooting_day && currentValue.shooting_day.total_scenes ? currentValue.shooting_day.total_scenes.length : 0;
																							return accumulator + cv
																							} ,0) : 0
								]
						//labels:[formatMessage({id:'inside'}), formatMessage({id:'outside'})],
						// series: [inisdeLength && inisdeLength.length ? inisdeLength.reduce((accumulator, currentValue) => accumulator + currentValue) : 0,
						// 	  	 OutsideLength && OutsideLength.length ? OutsideLength.reduce((accumulator, currentValue) => accumulator + currentValue) : 0
						// 		]

					 },
					 {
						hide: !suppliersLists,
						title: `${formatMessage({id:'actors'})} / ${formatMessage({id:'team'})}`,
						labels: suppliersLists ? suppliersLists.map(s=> s.supplier_category ).filter(a=>a) : [],
						colors: ['#44d0d7','#7ea300','#658300','#2b858a','#e3e3e3', '#36a7ac'],
						series: suppliersLists ? suppliersLists.map(s=> s.suppliers && s.suppliers.default ?  s.suppliers.default.length : 0) : []
					 },
					 {
						hide: calculatedRawTime <= 0 || calculatedScreenTime <= 0,
						title: `${formatMessage({id: 'raw_time'})} / ${formatMessage({id: 'screen_time'})}`,
						labels: [formatMessage({id:'raw_time'}), formatMessage({id:'screen_time'})],
						colors: ['#0065b3', '#f2f4f6'],
						series: [Number((calculatedRawTime/60).toFixed(2)),Number((calculatedScreenTime/60).toFixed(2))]

					 },
				].map((chart=> !chart.hide ?(
					<div className="px-1 m-1 bg-light-gray d-flex-column font-medium-4">
					<div className="mt-1 mb-05 font-medium-3 text-bold-600">{chart.title}</div>
					<div className="my-05 font-small-3" style={{minHeight: '17.5px'}}>{chart.subTitle}</div>
					 <Chart
						 options={{
							 colors: chart.colors,
							 tooltip: {
								enabled: false,
							 },
							  dataLabels: {
								enabled: true,
								offsetX: 0,
								offsetY: 0,
								style: {
									fontSize: '1.2rem',
									fontWeight: '0',
									fontFamily: `"Heebo", 'Alef', Arial, serif"`
								},
								formatter: function (val:number, opts:any) {
									return opts.w.config.series[opts.seriesIndex];
								  },
							  },
							 fill: {
								type: "gradient",
								gradient: {
								  gradientToColors: chart.colors.map(c=> c),
								}
							  },
							 labels: chart.labels,

							  legend: { show: true },
							  stroke: {
								//width: 5
							  },
							 responsive: [
							   {
								 breakpoint: 480,
								 options: {
								   chart: {
									 width: window.innerWidth
								   },
								   legend: {
									 position: "bottom"
								   }
								 }
							   },
							 ],
							 plotOptions: {
								chart: {
									dropShadow: {
									  enabled: false,
									  blur: 5,
									  left: 1,
									  top: 1,
									  opacity: 0.2
									},
									toolbar: {
									  show: false
									}
								  },
								pie: {
								  startAngle: 0,
								  endAngle: 360,
								  expandOnClick: false,
								  offsetX: 0,
								  offsetY: 0,
								  customScale: 1,
								  dataLabels: {
									offset: window.innerWidth * 0.10 > 300 ? -(window.innerWidth * 0.3) : -10,
									minAngleToShowLabel: 10
								  },
								}
								}
						   }}
						 series={chart.series}
						 type="pie"
						 width={window.innerWidth * 0.10 > 300 ? window.innerWidth * 0.10 : 300}
						 height={135}
					 />
				 </div>
				 ):null))}
				</Row>
				</Col>
				</Row>
				</CardBody>
				</Card>
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
									onClick={() => {
										dispatch(shootingDaysActions.setShootingDayPreview(index))
									}}
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
						{/*<Chart*/}
								{/*options={options}*/}
								{/*series={series}*/}
								{/*type="bar"*/}
								{/*height={290}*/}
						{/*/>*/}
					</CardBody>
				</Card>
			):null}

			{sdActive >= 0 && shootingDays[sdActive] ? (
			<>
				<Card>
					<CardBody className="mr-2">
						<div className="my-1 font-medium-4 text-success font-weight-600">
							<FormattedMessage id="day"/> {sdActive+1} <div className="opacity-05 d-inline-block">({shootingDays.length})</div>/ {shootingDays[sdActive].date ? moment(shootingDays[sdActive].date).locale('he').format('LL') : ''}
						</div>
						<Table
							headerColor='text-primary'
							id={shootingDays[sdActive].id}
							fields={['early_call','early_call_suppliers', 'call', 'breakfast', 'first_shoot', 'lunch', 'wrap', 'finished','finished_suppliers', 'over_time', 'comments']}
							type={TableType.POST_ROW}
							rows={[shootingDays[sdActive].post_shooting_day.team_hours]}
							index={sdActive}
						/>
						<Table
							headerColor='text-primary'
							id={shootingDays[sdActive].id}
							fields={['location_def','set_name', 'time', 'location','comments']}
							type={TableType.POST_SHOOTING_DAY_LOCATIONS}
							rows={shootingDays[sdActive].post_shooting_day.locations}
							index={sdActive}
						/>
					</CardBody>
					<Card>
						<CardBody className="mr-2">
							<Table
								headerColor='text-primary'
								id={shootingDays[sdActive].id}
								fields={['scene_id', 'status', 'screen_time', 'raw_time','script_pages', 'camera_card', 'sound_card', 'comments', 'reschedule']}
								type={TableType.POST_SHOOTING_DAY_SCENES}
								sd={shootingDays[sdActive]}
								rows={shootingDays[sdActive].shooting_day.total_scenes.map(scene=> {
									return {
										...scene,
										status: scene.status ? scene.status : '',
										screen_time: scene.screen_time ? scene.screen_time : scene.one_shoot,
										raw_time: scene.raw_time ? scene.raw_time : scene.one_shoot && scene.reshoots && scene.prepare ? (Number(scene.one_shoot) * Number(scene.reshoots)) + Number(scene.prepare) : 0,
										camera_card: scene.camera_card ? scene.camera_card : '',
										sound_card: scene.sound_card ? scene.sound_card : '',
										comments: scene.comments ? scene.comments : '',
									}
								})}
								index={sdActive}
							/>
						</CardBody>
					</Card>
					<Card>
						<CardBody className="mr-2">
							<Table
								id={shootingDays[sdActive].id}
								sd={shootingDays[sdActive]}
								headerColor='text-primary'
								index={0}
								fields={['actor_name','characters', 'agency', 'pickup','site', 'end_time', 'hours','extra_hours', 'post_comments']}
								type={TableType.POST_SHOOTING_DAY_ACTORS}
								rows={actorRows[sdActive] ? actorRows[sdActive] : []}
							/>
						</CardBody>
					</Card>
					<Card>
						<CardBody className="mr-2">
							<Table
								id={shootingDays[sdActive].id}
								sd={shootingDays[sdActive]}
								index={0}
								fields={['supplier_name', 'supplier_job_title', 'pickup','site', 'end_time', 'hours','extra_hours', 'post_comments']}
								type={TableType.POST_SHOOTING_DAY_EMPLOYEES}
								rows={employeeRows[sdActive] ? employeeRows[sdActive] : []}
							/>
						</CardBody>
					</Card>
					<Card>
						<CardBody className="mr-2">
							<Table
								headerColor='text-primary'
								index={sdActive}
								fields={['description','price','quantity', 'total', 'comments']}
								type={TableType.POST_SHOOTING_DAY_EXTRA_EXPENSES}
								rows={shootingDays[sdActive] && shootingDays[sdActive].post_shooting_day && shootingDays[sdActive].post_shooting_day.extra_expenses ? shootingDays[sdActive].post_shooting_day.extra_expenses : []}
							/>
						</CardBody>
					</Card>
				</Card>

				<Card>
					<CardBody>
						<div className="font-medium-4 mb-1"><FormattedMessage id="general_comments"/></div>
						<Input
							value={shootingDays[sdActive] ? shootingDays[sdActive].general_comment : ''}
							onChange={(e)=> {dispatch(shootingDaysActions.setShootingDayParameterValue(sdActive, 'general_comments', e.target.value))}}
							onBlur={(e)=> addShootingDay({ project_id:activeEvent.id, project_shooting_day_id: shootingDays[sdActive].id, 'general_comments':  e.target.value })}/>
					</CardBody>
				</Card>
			 </>
			) :null}
		</div>
	);
};

export default Overview;
