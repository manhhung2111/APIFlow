import ForbiddenImg from "@assets/images/error.403.svg";
import "./styles/layout.scss";
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {NavLink} from "react-router";

export default function ForbiddenPage() {

    return (
        <div className="error-page">
            <img src={LogoBrandImg || ""} alt={"Logo brand image"} className={"lb-image"}/>
            <div className="container">
                <img src={ForbiddenImg || ""} alt={"Forbidden image"} className={"error-image"}/>
                <p>You are not allowed to access this resource</p>
                <NavLink to="/">Back to home</NavLink>
            </div>
        </div>
    );
}