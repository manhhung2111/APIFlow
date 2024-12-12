import "./styles/layout.scss";
import NotFoundImg from "@assets/images/error.404.svg";

export default function NotFoundPage(){

	return (
		<div className="error-page">
			<div className="container">
				<img src={NotFoundImg} alt={"Forbidden image"} className={"error-image"}/>
				<h1>404 not found</h1>
			</div>
		</div>
	);
}