import * as React from 'react';
import * as moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '@src/store';
import { CalendarComponent, NotificationsComponent, SearchBar } from '@components';
import { Event } from '@containers/planning/interfaces';
import { EventActionTypes } from '@containers/planning/enum';
import { Expense, ExpenseGroup, IncomeGroup, Income } from '@containers/budget/interfaces';
import { addProject } from '@containers/planning/initial-state';
import { Progress, Col,NavItem  } from 'reactstrap';
import Flatpickr from "react-flatpickr";

import './index.scss';
import { FormattedMessage, useIntl } from 'react-intl';

export const NavbarProjectDetails: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const { formatMessage } = useIntl();
	const state = useSelector((state: RootStore) => state);
	const income = useSelector((state: RootStore) => state.income);
	const expenses = state.expenses;
	const activeEvent = state.events.filter((event: Event) => event.preview)[0];
	const eventBudget = activeEvent ? activeEvent.budget : 0;
	const [calculatedIncomeValue, setCalculatedIncomeValue] = React.useState<number>(0);
	const [calculatedExpenses, setCalculatedExpenses] = React.useState<number>(0);
	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
	const [dates, setDates] = React.useState([ new Date(activeEvent.date) ,new Date(activeEvent.date_end)]);
	const [notificationPopupOpen, setNotificationPopupOpen] = React.useState<boolean>(false);
	const [searchBar, setSearchBar ] = React.useState<string>('');
	const [searchBarOpen, setSearchBarOpen ] = React.useState<boolean>(false);
	const user = state.user
	//const calculatedIncome = activeEvent.budget;



	React.useEffect(() => {
		const calculatedIncome = income.reduce((acc: number, item: IncomeGroup) => {
			const subTotal = item.rows.reduce((sub: number, subrow: Income) => {
				return sub + Number(subrow['total-income']);
			}, 0);

			return acc + subTotal;
		}, 0);

		setCalculatedIncomeValue(calculatedIncome);
	}),
		[
			income.map((rows: any) => {
				rows.rows.map((row: any) => {
					return row['total-income'];
				});
			})
		];

		React.useEffect(() => {
			const calculatedExpenses = expenses && expenses.length ? expenses.reduce((acc: number, data: ExpenseGroup) => {
				const subTotal = data.budgets && data.budgets.default ? data.budgets.default.reduce((sub: number, subrow: Expense) => {
					return sub + Number(subrow.price);
				}, 0): 0;

				return acc + subTotal;
			}, 0): 0;

			setCalculatedExpenses(calculatedExpenses);
		},[state]);


	return activeEvent ? (
		<ul className="nav navbar-nav navbar-nav-user margin-rl-auto">
<NavItem lg="4" md="12">
	<Col className="mb-1"
		//onClick={(): void => setIsCalendarOpen(activeEvent ? !isCalendarOpen : false)}

	>
		<div className="text-center">
						<CalendarComponent
								flatpickr
								range
								className="bg-transparent border-0 text-bold-700 font-medium-1"
								onChange={(dates: any): void => {
									setDates(dates)
									let start_date = dates[0] ? dates[0] : ''
									let date_end = dates[1] ? dates[1] : ''
									if( start_date || date_end  ) {
										addProject({user_id: user.id, company_id: user.company_id, project_id: activeEvent.id, date: start_date, date_end})
										dispatch({
											type: EventActionTypes.SET_EVENTS,
											payload: [
												{
													...activeEvent,
													date: start_date,
													date_end: date_end
												}
											]
										});
									}
								}}
								onOutsideClick={() => {
									setIsCalendarOpen(false);
								}}
								// placeholder={activeEvent.date? `${activeEvent.date ? moment(new Date(activeEvent.date)).format('DD/MM/YYYY') : null}-${activeEvent.date_end ? moment(new Date(activeEvent.date_end)).format('DD/MM/YYYY'): null}` : `${formatMessage({id: 'select'})} ${formatMessage({id: 'date'})}`}
								date={dates}
						/>
						{/* {activeEvent.date ?
							<>
							<span className="user-status">{moment(new Date(activeEvent.date)).format('DD/MM/YYYY')}</span>-
							<span className="user-status">{moment(new Date(activeEvent.date)).format('DD/MM/YYYY')}</span>
							</>
						:
						<FormattedMessage id='set_date'/>
						} */}
					</div>
	</Col>
	<Col >
     <Progress
			className="width-200 progress-sm"
			color={'black'}
			// animated
            value={50}
         />
	</Col>

	{/* <Col sm="4">
					{activeEvent.date && moment(activeEvent.date, 'DD/MM/YYYY').fromNow()}
	</Col> */}
</NavItem>


	<NavItem sm="4" xs="12">
	<Col className="mb-1" style={{lineHeight: 'initial'}}>
		<div className="d-flex justify-content-center align-items-center">
			<div className="text-bold-700 font-medium-1">${calculatedExpenses}</div>/
			<div className="text-bold-700 font-medium-1">${eventBudget === 0 ? calculatedIncomeValue.toFixed(2) : eventBudget}</div>
		</div>
	</Col>
	<Col>
     <Progress
			className="width-200 progress-sm"
			color={'black'}//calculatedExpenses > eventBudget ? 'danger' : 'success'}
			animated
            value={((eventBudget === 0 ? calculatedIncomeValue : eventBudget) * calculatedExpenses)/100}
         />
	</Col>
		{/* <input
						onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
							//change event budget
							let value:any = Number(event.target.value.replace(/\D/g, ""))
							let budget = parseInt(value)
							addProject({company_id: user.company_id,project_id: activeEvent.id, budget})

							dispatch({
								type: EventActionTypes.SET_EVENTS,
								payload: [
									{
										...activeEvent,
										budget
									}
								]
							});

						}}
						type="text"
						placeholder="Enter title..."
						value={`$${eventBudget === 0 ? calculatedIncomeValue.toFixed(2) : eventBudget}`}
					/> */}
	</NavItem>

{/*
				<div className="c-header__notifications" onClick={()=> setNotificationPopupOpen(!notificationPopupOpen)}>
							<SVG src="/assets//assets/images/notifications.svg"  />
					</div>

				{notificationPopupOpen && (
					<NotificationsComponent
							onOutsideClick={(): void => setNotificationPopupOpen(false)}
						/>
				)} */}
		</ul>
	) :null;
};


export default NavbarProjectDetails;
