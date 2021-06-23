import * as React from 'react';
import { RootStore } from '@src/store';
import { useSelector, useDispatch } from 'react-redux';
import {DropzoneProgrammatically} from "@extensions"
import {TabContent, TabPane,Button,  Nav, NavItem, NavLink, Row, Col} from "reactstrap"
import { SupplierWithJob } from '../../helpers/helpers';
import classnames from 'classnames';
import { BreakDown } from '@containers/breakdown';
import { Event } from '@containers/planning/interfaces';
import { FormattedMessage } from "react-intl"
import { SetCallsheets } from './SetCallsheets'
import { ShootingDays } from '@containers/shooting_days'
import * as scenesBreakdownActions from "../../redux/actions/scenes-breakdown"
import * as shootingDaysActions from "../../redux/actions/shooting-days"
import { addScene } from '@containers/scripts/initial-state';
import { useHistory } from "react-router-dom";
import { Icon } from '@components';
import { LimitationsControl } from '@components/limitations-control';
import { config } from '../../config';

export const Scripts: React.FC = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const scripts = useSelector((state: RootStore) => state.scripts)
	const shootingDays = useSelector((state: RootStore) => state.shootingDays)

	const allSuppliers = useSelector((state: RootStore) => state.suppliers)
	const suppliersRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex != 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const suppliers = Array.prototype.concat.apply([], suppliersRootStore);
	const ActorsRootStore: any[] = allSuppliers.map((suppliers, listIndex) => { if (listIndex == 0 && suppliers.suppliers && suppliers.suppliers.default) return suppliers.suppliers.default; else return }).filter(a => a)
	const actors = Array.prototype.concat.apply([], ActorsRootStore);

	const events = useSelector((state: RootStore) => state.events)
	const activeEvent = events.filter((event: Event) => event.preview)[0];
	const [showCallsheetsSettings, SetShowCallsheetsSettings] =  React.useState<boolean>(false);
	let URL = window.location.pathname
	// let activePage:number = Number(URL.split('/script/')[1])
	const [isLimitationsOpen, setLimitationsOpen] = React.useState(false);
	const [active, setActive] =  React.useState<number>( 0);
	const [isHeaderFixed, setHeaderFixed] =  React.useState<boolean>(false);
	// React.useEffect(()=>{ if( activeEvent ) history.push('/'+activeEvent.id+'/script/'+active)},[activeEvent, active])

	const navItems = [
		{name: 'upload_script', enabled: true },
		{name: 'scenes_breakdown', enabled: false},
		{name: 'shooting_days_breakdown', enabled: false}
	];

	if (scripts.length) {
		navItems.find(navItem => navItem.name === 'scenes_breakdown').enabled = true;
	}

	if (shootingDays.length) {
		navItems.find(navItem => navItem.name === 'shooting_days_breakdown').enabled = true;
	}

	window.onscroll = (event:any) => {
		if(window.scrollY > (window.innerHeight*0.2)) setHeaderFixed(true)
		else setHeaderFixed(false)
	}

	const addNew = async (script_index: number, scene_index: number, type:string, scene:any, defaultValue?: string) => {
		// console.log('script_index: ', script_index)
		// console.log('scene_index: ', script_index)
		// console.log('type: ', type)
		// console.log('scene: ', scene)
		// console.log('defaultValue: ', defaultValue)

		let oldTypes = scene[type] ? scene[type] : []
		let data = [...oldTypes, {def: defaultValue ? defaultValue : '', supplier_name:'', supplier_id: null, comments: ''}]
		await dispatch(scenesBreakdownActions.setSceneParameter(scene.chapter_number, scene_index, type, data))
		await dispatch(shootingDaysActions.setShootingDaySceneParameter(script_index, scene_index, type, data))
		return data
	}

	const changeSceneValue = async (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number, script_index: number, scene_time_id: number,  i?: number) => {
		let newScripts = scripts
		let si = newScripts.findIndex((s:any) => s.chapter_number == chapter_number )
		newScripts[si].scenes[scene_index][type][type_index][field] = value

		let supplier = SupplierWithJob(newScripts[si].scenes[scene_index][type][type_index].supplier_job_title, [...suppliers, ...actors])[i ? i : 0]
		let supplier_id = supplier && supplier.id ? supplier.id : null
		let supplier_name = supplier && supplier.supplier_name ? supplier.supplier_name : ''
		newScripts[si].scenes[scene_index][type][type_index]['supplier_id'] = supplier_id
		newScripts[si].scenes[scene_index][type][type_index]['supplier_name'] = supplier_name

		await dispatch(scenesBreakdownActions.setSceneParameter(chapter_number, scene_index, type, newScripts[script_index].scenes[scene_index][type]))

		var newShootingDays = shootingDays
		newShootingDays[script_index].shooting_day.total_scenes[scene_index][type][type_index][field] = value
		newShootingDays[script_index].shooting_day.total_scenes[scene_index][type][type_index]['supplier_id'] = supplier_id
		newShootingDays[script_index].shooting_day.total_scenes[scene_index][type][type_index]['supplier_name'] = supplier_name
		await dispatch(shootingDaysActions.setShootingDaySceneParameter(script_index, scene_index, type, newShootingDays[script_index].shooting_day.total_scenes[scene_index][type]))

		// dispatch(scenesBreakdownActions.setDoubleSceneParameter(
		// 	{chapter_number, scene_index, type, data: newScripts[script_index].scenes[scene_index][type]},
		// 	{script_index, scene_index, type, data: newShootingDays[script_index].shooting_day.scenes[scene_time_id-1][scene_index][type], scene_time_id })
		// )
	};

	const changeSceneValueDB = async (value: any, field: string , type:string, type_index:number, chapter_number:number, scene_index:number,scene_number:number, script_index: number, scene_time_id: number, i?: number) => {
		var data:any = active == 2 ? shootingDays : scripts
		let si = data.findIndex((s:any) => s.chapter_number == chapter_number )

		let supplier = SupplierWithJob(active == 2 ? data[script_index].shooting_day.total_scenes[scene_index][type][type_index].supplier_job_title :  data[si].scenes[scene_index][type][type_index].supplier_job_title , [...suppliers, ...actors])[i ? i : 0]
		let supplier_id = supplier && supplier.id ? supplier.id : null


		if( active == 2 ) {data[script_index].shooting_day.total_scenes[scene_index][type][type_index][field] = value; data[script_index].shooting_day.total_scenes[scene_index][type][type_index]['supplier_id'] = supplier_id}
		else {data[si].scenes[scene_index][type][type_index][field] = value; ; data[si].scenes[scene_index][type][type_index]['supplier_id'] = supplier_id}

		await addScene({chapter_number, project_id:activeEvent.id, scene_number, [type]: active == 2 ?  data[script_index].shooting_day.total_scenes[scene_index][type] : data[si].scenes[scene_index][type] })
	};

	const changeScenePropValue = (value: any, field: string, sceneId: any, modifyAllScenes: boolean) => {
		dispatch(scenesBreakdownActions.setSceneParameter(sceneId, field, value, modifyAllScenes));
		dispatch(shootingDaysActions.setShootingDaySceneParameter(sceneId, field, value, modifyAllScenes));
	}

	const changeScenePropValueDB = (value: any, field: string,scene_number:number, chapter_number: number, modify_all_scenes: boolean) => {
		addScene({chapter_number, project_id:activeEvent.id, scene_number, [field]: value, modify_all_scenes})
	}

	const deleteRow = async (index: number, type:string, chapter_number:number, scene_index:number,scene_number:number, script_index: number, scene_time: number) => {
		var data:any = active == 2 ? shootingDays : scripts
		let si = data.findIndex((s:any) => s.chapter_number == chapter_number )
		if( active == 2 ) {
			data[script_index].shooting_day.total_scenes[scene_index][type].splice(index, 1)
			dispatch(shootingDaysActions.setShootingDaySceneParameter(script_index, scene_index, type, data[script_index].shooting_day.total_scenes[scene_index][type]))
		} else {
			data[si].scenes[scene_index][type].splice(index, 1)
			dispatch(scenesBreakdownActions.setSceneParameter(script_index, scene_index, type, data[script_index].scenes[scene_index][type]))
		}
		await addScene({chapter_number, project_id:activeEvent.id, scene_number, [type]: active == 2 ? data[script_index].shooting_day.total_scenes[scene_index][type] : data[si].scenes[scene_index][type] })

	}

	const AddNewButton = (script_index: number,scene_index: number,type: string, scene:any) =>  (
		<div
		className="btn mr-1 mb-1 text-bold-600"
		onClick={()=>addNew(script_index, scene_index, type , scene)}>
			+ <FormattedMessage id={'add_new'} />
		</div>
	);

	return (
		<div className="mt-1">
		<Row className="pl-3 pt-1 bg-white position-fixed full-width zindex-4">
     	 <div className="d-flex mb-2 float-left justify-content-center">
			 {navItems.map((item: any, index:number)=> (
			 	<>
				 <div key={index} onClick={() => setActive(index)}
				  className={classnames("btn p-05 d-flex align-items-center font-weight no-border-bottom-radius border-bottom-2",{
						'border-bottom': active == index,
						'border-color-primary': active == index,
						'text-primary-imgn': active == index,
						'svg-primary-imgn': active == index,
					  	'opacity-05': !item.enabled,
					  	'cursor-default': !item.enabled,
					  	'pointer-events-none': !item.enabled,
					})}>
					<Icon src={`${config.iconsPath}/script/${item.name}.svg`} className="mr-05"
					style={{height: '1.5rem',width: '1.5rem'}}/>
					 <FormattedMessage id={item.name} />
				 </div>
				{index === active && navItems[index].name === 'shooting_days_breakdown' &&
					<button
						title="Limitations"
						className="btn d-flex align-items-center p-0 ml-2"
						onClick={() => setLimitationsOpen(!isLimitationsOpen)}
					>
						<i className="limitation-icon mr-05"/>
					</button>
				}
			   </>
			))}
			</div>
		</Row>

		<TabContent activeTab={active}>
			{isLimitationsOpen &&
				<LimitationsControl
					closeLimitations={() => setLimitationsOpen(!isLimitationsOpen)}
					activeEvent={activeEvent}
					shootingDays={shootingDays}
					actors={actors}
					suppliers={suppliers}
				/>
			}

			{navItems.map((item:any ,index:number)=> (
			<TabPane tabId={index} key={index}>
			{active == index && (

				item.name == 'upload_script' ?
					<Row>
					<Col >
						<DropzoneProgrammatically  navigateToBreakDownScenes={()=> setActive(1)}/>{" "}
					</Col>
					</Row>
					:
				item.name == 'scenes_breakdown' ?
					<>
					<BreakDown addNew={addNew}
								isHeaderFixed={isHeaderFixed}
							    changeSceneValue={changeSceneValue}
								changeSceneValueDB={changeSceneValueDB}
								changeScenePropValue={changeScenePropValue}
								changeScenePropValueDB={changeScenePropValueDB}
								deleteRow={deleteRow}
								AddNewButton={AddNewButton}/>
					<SetCallsheets isOpen={showCallsheetsSettings}  toogle={SetShowCallsheetsSettings}
									navigateToShootingDaysBreakdown={()=>setActive(2)}/>
					<div className="position-fixed position-bottom-0 width-100-per py-2 bg-light-gray d-flex zindex-4">
						<Button onClick={()=>{setHeaderFixed(false);SetShowCallsheetsSettings(true)}}
										className="width-200 ml-35-per text-bold-500" color="yellow" >
								<FormattedMessage id='settings' />
						</Button>
					</div>
					</>
					:
				item.name == 'shooting_days_breakdown' ?
					<ShootingDays addNew={addNew}
								  changeSceneValue={changeSceneValue}
								  changeSceneValueDB={changeSceneValueDB}
								  changeScenePropValue={changeScenePropValue}
								  changeScenePropValueDB={changeScenePropValueDB}
								  deleteRow={deleteRow}
								  AddNewButton={AddNewButton}/>
					: null
				)}
			</TabPane>
			))}
		</TabContent>
		</div>)
 }
export default Scripts;
