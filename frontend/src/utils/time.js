import {formatDistanceToNow} from "date-fns";

export default class TimeUtils {
	static formatDate(isoTimestamp) {
		const date = new Date(isoTimestamp);

		// Get day, month, year, hours, minutes in local time
		const day = date.getDate().toString().padStart(2, '0'); // Local day
		const month = date.toLocaleString('en-US', { month: 'short' }); // Local month
		const year = date.getFullYear();
		let hours = date.getHours(); // Local hours
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';

		// Convert 24-hour time to 12-hour format
		hours = hours % 12 || 12;

		return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
	}


	static formatDateAgo(isoTimestamp) {
		return formatDistanceToNow(new Date(isoTimestamp), {addSuffix: true});
	}
}