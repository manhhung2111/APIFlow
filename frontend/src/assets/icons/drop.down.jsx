import Icon from "@ant-design/icons";

const DropdownSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
	</svg>
);

export default function DropdownIcon(props){
	return (<Icon component={DropdownSVG} {...props} />);
}