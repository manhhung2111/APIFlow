import {formatDistanceToNow} from "date-fns";

export default class TimeUtils {
	static formatDate(isoTimestamp) {
		const date = new Date(isoTimestamp);

		// Get day, month, year, hours, minutes
		const day = date.getUTCDate().toString().padStart(2, '0'); // Ensures 2-digit day
		const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
		const year = date.getUTCFullYear();
		let hours = date.getUTCHours();
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';

		// Convert 24-hour time to 12-hour format
		hours = hours % 12 || 12; // Ensures 12-hour format

		return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
	}


	static formatDateAgo(isoTimestamp) {
		return formatDistanceToNow(new Date(isoTimestamp), {addSuffix: true});
	}
}