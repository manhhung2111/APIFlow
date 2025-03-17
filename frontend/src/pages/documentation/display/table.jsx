import CodeEditor from "@components/app/editor/code.editor.jsx";

export default function DocumentationTable({title, subtitle, data, type = "table"}) {

	return (<div className="documentation-table">
		<div className="header">
			<h4>{title}</h4>
			<p>{subtitle}</p>
		</div>
		<div className="main">
			{type === "table" && data.map((row, index) => {
				return <div className="row" key={index}>
					<p className="key">{row.key}</p>
					{row.type && row.type === "file" && <p className="value">{row.value.name}</p>}
					{row.type != null || row.type !== "file" && <p className="value">{row.value}</p>}
				</div>;
			})}
			{type === "raw" && <CodeEditor
				value={data}
				options={{
					"readOnly": true,
					"language": "JSON",
					"height": "15vh"
				}}
			/>}
			{type === "message" && <div className="message">{data}</div>}
		</div>
	</div>)
}