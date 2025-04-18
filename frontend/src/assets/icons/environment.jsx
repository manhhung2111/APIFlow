import Icon from "@ant-design/icons";

const EnvironmentSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
		<path
			d="M576-192v-72h84q15.3 0 25.65-10.35Q696-284.7 696-300v-72q0-41 27.5-70.5T792-477v-4q-41-8-68.5-37T696-588v-72q0-15.3-10.35-25.65Q675.3-696 660-696h-84v-72h84q45 0 76.5 31.5T768-660v72q0 15.3 10.35 25.65Q788.7-552 804-552h60v144h-60q-15.3 0-25.65 10.35Q768-387.3 768-372v72q0 45-31.5 76.5T660-192h-84Zm-276 0q-45 0-76.5-31.5T192-300v-72q0-15.3-10.35-25.65Q171.3-408 156-408H96v-144h60q15.3 0 25.65-10.35Q192-572.7 192-588v-72q0-45 31.5-76.5T300-768h84v72h-84q-15.3 0-25.65 10.35Q264-675.3 264-660v72q0 42-27.5 71.5T168-482v4.15Q209-474 236.5-444t27.5 72v72q0 15.3 10.35 25.65Q284.7-264 300-264h84v72h-84Z"/>
	</svg>
);

export default function EnvironmentIcon(props){
	return (<Icon component={EnvironmentSVG} {...props} />);
}