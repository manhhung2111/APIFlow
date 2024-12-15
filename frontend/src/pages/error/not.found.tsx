import "./styles/layout.scss";
import NotFoundImg from "@assets/images/error.404.svg";
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {NavLink} from "react-router";

export default function NotFoundPage() {

    return (
        <div className="error-page">
            <img src={LogoBrandImg} alt={"Logo brand image"} className={"lb-image"}/>
            <div className="container">
                <img src={NotFoundImg} alt={"Forbidden image"} className={"error-image"}/>
                <p>
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <NavLink to="/">
                    Back to home
                </NavLink>
            </div>
        </div>
    );
}