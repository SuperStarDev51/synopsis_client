export interface Summary {
	readonly eventName: string;
	readonly eventDate: string;
	readonly eventDateMeta: string;
	readonly eventAccounts: Account[];
	readonly eventTasks: SummaryTask[];
	readonly eventSuppliers: SummarySuppliers[];
}

export interface Account {
	readonly name: string;
	readonly price: string;
	readonly type: string;
	readonly owners: AccountOwner[];
}

export interface AccountOwner {
	readonly name: string;
	readonly amount: string;
	readonly percentage: string;
	readonly status: string;
}

export interface SummaryTask {
	readonly title: string;
	readonly done: number;
	readonly active: number;
	readonly owners: SummaryTaskOwner[];
}

export interface SummaryTaskOwner {
	readonly name: string;
	readonly doneTasks: number;
	readonly activeTasks: number;
}

export interface SummarySuppliers {
	readonly title: string;
	readonly suppliers: SummarySupplier[];
}

export interface SummarySupplier {
	name: string;
	status: string;
}
