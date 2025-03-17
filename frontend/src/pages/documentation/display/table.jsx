import CodeEditor from "@components/app/editor/code.editor.jsx";
import JsonView from '@uiw/react-json-view';

export default function DocumentationTable({title, subtitle, data, type = "table", isFile = false}){

	const incompleteJson = '{"name": "John", "age":';

	return (<div className="documentation-table">
		<div className="header">
			<h4>{title}</h4>
			{subtitle && <p>{subtitle}</p>}
		</div>
		<div className="main">
			{type === "table" && data.map((row, index) => {
				return <div className="row" key={index}>
					<p className="key">{row.key}</p>
					{isFile && row.type === "file" && <p className="value">{row.value.name}</p>}
					{isFile && row.type === "text" && <p className="value">{row.value}</p>}
					{!isFile && <p className="value">{row.value}</p>}
				</div>;
			})}
			{/*{type === "raw" && <JsonView value={JSON.parse(data)} displayDataTypes={false} displayObjectSize={false} collapsed={1}/>}*/}
			{type === "raw" && <CodeEditor
				value={data}
				options={{
					"readOnly": true,
					"language": "json",
					"height": "15vh",
					"lineNumbers": "off"
				}}
			/>}
			{type === "message" && <div className="message">{data}</div>}
		</div>
	</div>)
}