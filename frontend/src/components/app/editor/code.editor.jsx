import {Editor} from "@monaco-editor/react";
import {useRef} from "react";

export default function CodeEditor(props){
	const editorRef = useRef();

	const onMount = (editor) => {
		editorRef.current = editor;
		// editor.focus();
	}

	const {value, setValue, options} = props;
	return (
		<div className="app-code-editor">
			<Editor
				height={options?.height ?? "200px"}
				theme={options?.theme ?? "light"}
				defaultLanguage={options?.language ?? "javascript"}
				onMount={onMount}
				value={value ?? ""}
				onChange={setValue ? (value) => setValue(value) : undefined}
				options={{
					"wordWrap": "on",
					"smoothScrolling": true,
					"scrollBeyondLastLine": false,
					"minimap": {"enabled": false},
					"fontSize": 12,
					"renderLineHighlight": "none",
					"lineNumbers": options?.lineNumbers ?? "on",
				}}
			/>
		</div>
	)
}