import Icon from "@ant-design/icons";

const RequestSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<g transform="rotate(135, 480, -480)">
			<path
				d="M288-168 96-360l192-192 51 51-105 105h294v72H234l105 105-51 51Zm384-240-51-51 105-105H432v-72h294L621-741l51-51 192 192-192 192Z"/>
		</g>
	</svg>
);

export default function RequestIcon(props){
	return (<Icon component={RequestSVG} {...props} />);
}