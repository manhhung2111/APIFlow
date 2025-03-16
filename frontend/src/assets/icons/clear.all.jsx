import Icon from "@ant-design/icons";

const ClearAllSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path d="M120-280v-80h560v80H120Zm80-160v-80h560v80H200Zm80-160v-80h560v80H280Z"/>
	</svg>
);

export default function ClearAllIcon(props){
	return (<Icon component={ClearAllSVG} {...props} />);
}