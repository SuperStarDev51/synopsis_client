import { Summary } from './interfaces';

export const overviewInitialState: Summary[] = [
	{
		eventName: 'Imegine Festival',
		eventDate: '20/06/2020',
		eventDateMeta: '11 days to go',
		eventAccounts: [
			{
				name: 'Incomes',
				price: '350,000',
				type: 'income',
				owners: [
					{
						name: 'Eventer',
						amount: '150,000',
						percentage: '42%',
						status: 'yellow'
					},
					{
						name: 'Tix',
						amount: '130,000',
						percentage: '38%',
						status: 'blue'
					},
					{
						name: 'Vendors',
						amount: '70,000',
						percentage: '12%',
						status: 'green'
					},
					{
						name: 'Others',
						amount: '30',
						percentage: '1%',
						status: 'orange'
					}
				]
			},
			{
				name: 'Expenses',
				price: '200,000',
				type: 'expenses',
				owners: [
					{
						name: 'Marketing',
						amount: '200,000',
						percentage: '42%',
						status: 'yellow'
					},
					{
						name: 'Artists',
						amount: '50,000',
						percentage: '38%',
						status: 'blue'
					},
					{
						name: 'Authorities',
						amount: '70,000',
						percentage: '12%',
						status: 'green'
					},
					{
						name: 'Others',
						amount: '30',
						percentage: '1%',
						status: 'orange'
					}
				]
			},
			{
				name: 'P/L',
				price: '150,000',
				type: 'profit-loss',
				owners: [
					{
						name: 't-120',
						amount: '735',
						percentage: '',
						status: ''
					},
					{
						name: 't-150',
						amount: '434',
						percentage: '',
						status: ''
					},
					{
						name: 'Bar license',
						amount: '70,000',
						percentage: '',
						status: ''
					},
					{
						name: 'Food',
						amount: '70,000',
						percentage: '',
						status: ''
					}
				]
			}
		],
		eventTasks: [
			{
				title: 'Tasks',
				done: 32,
				active: 75,
				owners: [
					{
						name: 'Yaron',
						doneTasks: 4,
						activeTasks: 25
					},
					{
						name: 'Liat',
						doneTasks: 20,
						activeTasks: 31
					},
					{
						name: 'Shmulik',
						doneTasks: 8,
						activeTasks: 19
					}
				]
			}
		],
		eventSuppliers: [
			{
				title: 'Supplier Status',
				suppliers: [
					{
						name: 'Company.inc',
						status: 'Approved'
					},
					{
						name: 'Milk.inc',
						status: 'Paid'
					},
					{
						name: 'Food.inc',
						status: 'Paid'
					},
					{
						name: 'Service.inc',
						status: 'Invoice received'
					}
				]
			}
		]
	},
	{
		eventName: 'Party Festival',
		eventDate: '20/06/2020',
		eventDateMeta: '11 days to go',
		eventAccounts: [
			{
				name: 'Incomes',
				price: '350,000',
				type: 'income',
				owners: [
					{
						name: 'Eventer',
						amount: '150,000',
						percentage: '42%',
						status: 'yellow'
					},
					{
						name: 'Tix',
						amount: '130,000',
						percentage: '38%',
						status: 'blue'
					},
					{
						name: 'Vendors',
						amount: '70,000',
						percentage: '12%',
						status: 'green'
					},
					{
						name: 'Others',
						amount: '30',
						percentage: '1%',
						status: 'orange'
					}
				]
			},
			{
				name: 'Expenses',
				price: '200,000',
				type: 'expenses',
				owners: [
					{
						name: 'Marketing',
						amount: '200,000',
						percentage: '42%',
						status: 'yellow'
					},
					{
						name: 'Artists',
						amount: '50,000',
						percentage: '38%',
						status: 'blue'
					},
					{
						name: 'Authorities',
						amount: '70,000',
						percentage: '12%',
						status: 'green'
					},
					{
						name: 'Others',
						amount: '30',
						percentage: '1%',
						status: 'orange'
					}
				]
			},
			{
				name: 'P/L',
				price: '150,000',
				type: 'profit-loss',
				owners: [
					{
						name: 't-120',
						amount: '735',
						percentage: '',
						status: ''
					},
					{
						name: 't-150',
						amount: '434',
						percentage: '',
						status: ''
					},
					{
						name: 'Bar license',
						amount: '70,000',
						percentage: '',
						status: ''
					},
					{
						name: 'Food',
						amount: '70,000',
						percentage: '',
						status: ''
					}
				]
			}
		],
		eventTasks: [
			{
				title: 'Tasks',
				done: 32,
				active: 75,
				owners: [
					{
						name: 'Yaron',
						doneTasks: 4,
						activeTasks: 25
					},
					{
						name: 'Liat',
						doneTasks: 20,
						activeTasks: 31
					},
					{
						name: 'Shmulik',
						doneTasks: 8,
						activeTasks: 19
					}
				]
			}
		],
		eventSuppliers: [
			{
				title: 'Supplier Status',
				suppliers: [
					{
						name: 'Company.inc',
						status: 'Approved'
					},
					{
						name: 'Milk.inc',
						status: 'Paid'
					},
					{
						name: 'Food.inc',
						status: 'Paid'
					},
					{
						name: 'Service.inc',
						status: 'Invoice received'
					}
				]
			}
		]
	}
];
