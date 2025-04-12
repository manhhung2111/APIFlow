import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from "monaco-editor";
import Request from "@components/request/request.jsx";

export default function PostResponseEditor(props) {
	const { value, setValue, options } = props;
	const editorRef = useRef();

	const postResponseSnippets = Request.postResponseSnippets();

	const onMount = (editor) => {
		editorRef.current = editor;
	};

	// ✅ Smart snippet insertion (Fixed Version)
	const insertSnippet = (snippet) => {
		const editor = editorRef.current;
		if (!editor) return;

		editor.focus();
		const position = editor.getPosition();
		const model = editor.getModel();

		if (!position || !model) return;

		// ✅ Get the current line content and its leading whitespace
		const currentLine = model.getLineContent(position.lineNumber);
		const leadingWhitespace = currentLine.match(/^\s*/)?.[0] || "";

		// ✅ Check if the line is empty or not
		const isEmptyLine = currentLine.trim().length === 0;
		const insertAtLine = isEmptyLine ? position.lineNumber : position.lineNumber + 1;

		// ✅ Format snippet with correct indentation
		const formattedSnippet = snippet
			.split("\n")
			.map((line, index) => (index === 0 ? line : leadingWhitespace + line)) // Keep indentation
			.join("\n");

		// ✅ Insert snippet and move cursor
		editor.executeEdits("", [
			{
				range: new monaco.Range(insertAtLine, 1, insertAtLine, 1),
				text: formattedSnippet + "\n",
				forceMoveMarkers: true,
			}
		]);

		// ✅ Move cursor to the end of the inserted snippet
		const newPosition = new monaco.Position(insertAtLine + snippet.split("\n").length, 1);
		editor.setPosition(newPosition);
	};

	return (
		<div className="request-code-editor post-response-editor">
			<Editor
				height={options?.height ?? "300px"}
				theme={options?.theme ?? "light"}
				defaultLanguage="javascript"
				onMount={onMount}
				value={value ?? ""}
				onChange={setValue ? (val) => setValue(val) : undefined}
				options={{
					wordWrap: "on",
					smoothScrolling: true,
					scrollBeyondLastLine: true,
					minimap: {enabled: false},
					fontSize: 12,
					renderLineHighlight: "none",
					lineNumbers: options?.lineNumbers ?? "on",
					readOnly: options?.readOnly ?? false,
				}}
			/>
			<div className="snippet-list">
				<h3>Snippets</h3>
				{postResponseSnippets.map((snippet, index) => (
					<button key={index} onClick={() => insertSnippet(snippet.value)}>{snippet.name}</button>
				))}
			</div>
		</div>
	);
}
