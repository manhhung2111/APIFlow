import MDEditor, {commands} from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function AppMarkdownEditor({theme, value, onChange, readOnly = false, height}){

	return (<div className="app-markdown-editor" data-color-mode={theme || "light"}>
		{!readOnly &&
			<MDEditor
				value={value}
				onChange={onChange}
				preview={"edit"}
				previewOptions={{
					rehypePlugins: [[rehypeSanitize]],
				}}
				// commands={[
				// 	commands.codeEdit, commands.codePreview
				// ]}
				extraCommands={[commands.codeEdit, commands.codePreview]}
				height={height || 200}
				visibleDragbar={false}
			/>
		}
		{readOnly && <MarkdownPreview className="markdown-preview" source={value} rehypePlugins={[rehypeSanitize]} height={height || 200}/>}
	</div>)
}