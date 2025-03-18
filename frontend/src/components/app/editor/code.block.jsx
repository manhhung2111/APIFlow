import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AppCodeBlock({language, code}){

	return <div className="app-code-block">
		<SyntaxHighlighter language={language} style={oneLight} showLineNumbers={false} wrapLongLines={true}>
			{code}
		</SyntaxHighlighter>
	</div>
}