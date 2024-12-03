export default class Word {

	public static addSmartQuote(data: string, db_smart_quote: boolean = true): string {
		let result = "";
		let singleSmartQuote = true;
		let doubleSmartQuote = true;

		for (let i = 0; i < data.length; i++) {
			const char = data[i];

			if (char === "'") {
				if (singleSmartQuote) {
					result += "&#8216;"; // Opening single smart quote: ‘
					singleSmartQuote = false;
				} else {
					result += "&#8217;"; // Closing single smart quote: ’
					singleSmartQuote = true;
				}
			} else if (char === '"' && db_smart_quote) {
				if (doubleSmartQuote) {
					result += "&#8220;"; // Opening double smart quote: “
					doubleSmartQuote = false;
				} else {
					result += "&#8221;"; // Closing double smart quote: ”
					doubleSmartQuote = true;
				}
			} else {
				result += char; // Add non-quote characters as is
			}
		}

		return result;
	}

	public static shorten(word: string, max_length: number, tail: string = "..."): string {
		// Check if the string exceeds the max length
		const is_too_long = word.length > max_length;

		// If the string is short enough, return it after sanitizing
		if (!is_too_long) {
			return word.replace(/<br>/gi, " ").replace(/<\/?[^>]+(>|$)/g, "");
		}

		// Shorten the string and append the tail
		let shortened = word.substring(0, max_length) + tail;

		// Replace certain characters for sanitization
		shortened = shortened
			.replace(/<br>/gi, " ") // Replace <br> tags with spaces
			.replace(/:/g, "&#58;") // Replace colons with their HTML entity
			.replace(/\n/g, " ") // Replace newlines with spaces
			.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags

		// Remove incomplete HTML entities like &#123 or &#xAF that may have been truncated
		shortened = shortened.replace(/&#([0-9A-Fa-f]+)(\.|\s|$)/g, "");

		return shortened;
	}

	public static split(splitter: string, text: string, limit: number = 0) {
		if (!text) return [];

		let s: string[];
		if (limit > 0) {
			s = text.split(splitter, limit);
		} else {
			s = text.split(splitter);
		}

		const result: string[] = [];
		for (let i = 0; i < s.length; i++) {
			const elem = this.clean(s[i]);
			if (elem.length >= 1) {
				result.push(elem); // Only add non-empty cleaned strings
			}
		}

		return result;
	}

	public static clean(text: string) {
		return text.trim();
	}
}