import {useState} from "react";
import {Select, Tag} from "antd";
import BookmarkIcon from "@assets/icons/bookmark.jsx";
import {CopyOutlined} from "@ant-design/icons";
import AppCodeBlock from "@components/app/editor/code.block.jsx";
import Request from "@components/request/request.jsx"

export default function DocumentationExample({examples}){
	const [activeExample, setActiveExample] = useState(examples[0]._id);

	const options = examples.map((item) => {
		return {
			value: item._id,
			label: item.name,
		}
	});

	const example = examples.find(example => example._id == activeExample) || null;

	const statusHTML = (statusText) => {
		if (!statusText) return "";

		let status = Number(statusText.split(" ")[0])

		let tagStyles = {"color": "#004080", "backgroundColor": "#d9edf7"};
		if (status >= 200 && status <= 299) {
			tagStyles = {"color": "rgb(0, 127, 49)", "backgroundColor": "#E5FFF1"};
		} else if (status >= 300 && status <= 399) {
			tagStyles = {"color": "#8a6d3b", "backgroundColor": "#fcf8e3"};
		} else if (status >= 400) {
			tagStyles = {"color": "rgb(142, 26, 16)", "backgroundColor": "#FFEBE7"};
		}

		return <Tag bordered={false} style={{...tagStyles, margin: 0}}>{`${statusText}`}</Tag>;
	};

	return (<div className="documentation-example">
		<div className="example-header">
			<h4>Example</h4>
			<Select
				prefix={<BookmarkIcon style={{fontSize: 14, marginTop: 4}}/>}
				defaultValue={examples[0]._id}
				value={activeExample}
				options={options}
				onChange={(value) => setActiveExample(value)}
				variant={"borderless"}
				style={{width: 180}}
			/>
		</div>
		<div className="example-main">
			<div className="request code-block">
				<div className="header">
					<h5>Request</h5>
					<CopyOutlined/>
				</div>
				<div className="main">
					{example && <AppCodeBlock
						language="javascript"
						code={Request.generateCurlFromRequest(example.request)}
					/>}
				</div>
			</div>
			<div className="response code-block">
				<div className="header">
					<h5>Response</h5>
					{statusHTML(example?.response?.status)}
				</div>
				<div className="main">
					{example && <AppCodeBlock
						language="json"
						code={example.response.body.length > 0 ? example.response.body : "This request doesn't return any response body."}
					/>}
				</div>
			</div>
		</div>
	</div>)
}