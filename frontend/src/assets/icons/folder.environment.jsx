import Icon from "@ant-design/icons";

const FolderEnvironmentSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path
			d="M160-240v-480 520-40Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v200h-80v-200H447l-80-80H160v480h200v80H160ZM584-56 440-200l144-144 56 57-87 87 87 87-56 57Zm192 0-56-57 87-87-87-87 56-57 144 144L776-56Z"/>
	</svg>
);

export default function FolderEnvironmentIcon(props){
	return (<Icon component={FolderEnvironmentSVG} {...props} />);
}