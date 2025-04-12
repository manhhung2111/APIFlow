import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AppCodeBlock({language, code, showLineNumbers = false}){
	return <div className="app-code-block">
		<SyntaxHighlighter language={language} style={oneLight} showLineNumbers={showLineNumbers} wrapLongLines={true}
						   wrapLines={true}>
			{code}
		</SyntaxHighlighter>
	</div>
}