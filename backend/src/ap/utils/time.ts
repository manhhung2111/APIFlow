export default class TimeUtils {
	public static getCurrentDateTime() {
		const today = new Date();
		const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		return date + ' ' + time;
	}

	public static getCurrentDate(){
		const today = new Date();
		const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		return date;
	}
}