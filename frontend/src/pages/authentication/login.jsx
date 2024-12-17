import * as React from "react";
import './styles/login.scss';
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Input} from 'antd';
import {NavLink} from "react-router";
import {GithubOutlined, GoogleOutlined} from "@ant-design/icons";
import useDocumentTitle from "@hooks/use.document.title";

export default function LoginPage() {
    useDocumentTitle("APIFlow - Sign In");

    async function onSubmit(event) {
        event.preventDefault(); // Prevent performing normal submission

    }

    return (
        <div className="login-page">
            <img src={LogoBrandImg} alt={"Logo brand image"} className={"lb-image"}/>
            <form onSubmit={onSubmit} className="login-form">
                <h1>Sign in to APIFlow</h1>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <Input name="email" type="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <Input.Password name="password"/>
                </div>
                <div className="form-input-footer">
                    <Checkbox name="signed_in">Stay signed in</Checkbox>
                    <NavLink to="/reset-password" className='link'>Forgot password?</NavLink>
                </div>
                <button className="submit-btn" type="submit">Sign In</button>
                <Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
                <Button className={"btn"} icon={<GoogleOutlined/>} iconPosition={"start"}>
                    Sign In with Google
                </Button>
                <Button className={"btn"} icon={<GithubOutlined/>} iconPosition={"start"}>
                    Sign In with Github
                </Button>
            </form>
        </div>
    );
}