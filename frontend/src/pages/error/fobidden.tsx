import ForbiddenImg from "@assets/images/error.403.svg";
import "./styles/layout.scss";

export default function ForbiddenPage(){

	return (
		<div className="error-page">
			<div className="container">
				<img src={ForbiddenImg} alt={"Forbidden image"} className={"error-image"}/>
				<h1>You are not allowed to access this resource</h1>
			</div>
		</div>
	);
}