import Icon from "@ant-design/icons";

const NorthEastSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z"/>
	</svg>
);

export default function NorthEastIcon(props){
	return (<Icon component={NorthEastSVG} {...props} />);
}