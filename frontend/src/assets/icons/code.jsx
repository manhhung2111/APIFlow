import Icon from "@ant-design/icons";

const CodeSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path
			d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/>
	</svg>
);

export default function CodeIcon(props){
	return (<Icon component={CodeSVG} {...props} />);
}