import * as moment from 'moment';

export const filteredOptions = (options: any[], field: string, filter: string | null) => {
    if( filter && filter.length ) return options.filter((o:any)=> o[field].includes(filter.toLowerCase().trim()))
    else return options
}

export function timeStringToNumber(sd_date: string,time:string) {
    let hours = Number(`${time[0]}${time[1]}`)
    let minutes = Number(`${time[3]}${time[4]}`)
    let date:number = new Date(sd_date).setHours(hours, minutes, 0, 0)
    return date
}
export 	function durationBetweenDates(firstDate: Date, endDate: Date) {
    var now = moment(firstDate);
    var end = moment(endDate);
    var duration = moment.duration(now.diff(end));
    var days = duration.asMilliseconds();
    return Math.abs(days)
}

export function SupplierWithJob(supplier_job_title: string, SupplierNActors:any) {
    if (!supplier_job_title || !SupplierNActors) return ''
    return SupplierNActors.filter((x: any) => { if (x['supplier_job_title'] == supplier_job_title) { return x } })
}

export const eighthsFormat = num => {
	const first = num/8 > 0 ? Math.floor(num/8) : null;
	const last = num%8 > 0 ? num%8 + '/8' : null;
	const plus = first && last ? ' + ' : null

	return (first + plus + last).toString().replace(/^0+/, '');
};
