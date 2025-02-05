import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Button, Tag} from "antd";
import BookmarkAddIcon from "@assets/icons/bookmark.add.jsx";

export default function RequestResponseSide() {
	let {response} = useContext(RequestContext);

	const statusHTML = () => {
		if (!response) return "";

		let status = response.status;
		let statusText = response.statusText;

		let tagStyles = {"color": "#004080", "backgroundColor": "#d9edf7"};
		if (status >= 200 && status <= 299) {
			tagStyles = {"color": "rgb(0, 127, 49)", "backgroundColor": "#E5FFF1"};
		} else if (statusText >= 300 && status <= 399) {
			tagStyles = {"color": "#8a6d3b", "backgroundColor": "#fcf8e3"};
		} else if (statusText >= 400) {
			tagStyles = {"color": "rgb(142, 26, 16)", "backgroundColor": "#FFEBE7"};
		}

		return <Tag bordered={false} style={tagStyles}>{`${status} ${statusText}`}</Tag>;
	};


	const timeHTML = () => {
		if (!response) return "";

		let time = response.time;
		if (time >= 1000) {
			return <span className="time">{`${(time / 1000).toFixed(0)} s`}</span>; // Convert to seconds with 2 decimal places
		}
		return <span className="time">{`${time.toFixed(0)} ms`}</span>;
	}

	const sizeHTML = () => {
		if (!response) return "";

		let totalSize = response.response_size.body + response.response_size.headers;
		if (totalSize === 0) {
			return '0 B';
		}

		// Define units
		const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const k = 1000; // Use 1000 for decimal units or 1024 for binary units
		const i = Math.floor(Math.log(totalSize) / Math.log(k));

		// Calculate the size and floor it to the nearest whole number
		return <span className="size">{Math.floor(totalSize / Math.pow(k, i)) + ' ' + units[i]}</span>;
	}


	return (
		<div className="request-response-side">
			{statusHTML()}
			{timeHTML()}
			{sizeHTML()}
			<Button icon={<BookmarkAddIcon />} type="text" size={"small"} className="save-btn">Save Response</Button>
		</div>
	)
}