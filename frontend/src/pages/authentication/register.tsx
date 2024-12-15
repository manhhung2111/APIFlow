import * as React from "react";
import SignUpImg from "@assets/images/sign.up.svg";
import useDocumentTitle from "@hooks/use.document.title";
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Input, Typography} from "antd";
import {GithubOutlined, GoogleOutlined} from "@ant-design/icons";
import './styles/register.scss';

const {Title, Paragraph, Text, Link} = Typography;

export default function RegisterPage() {
    useDocumentTitle("APIFlow - Sign Up");

    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault(); // Prevent performing normal submission

    }

    return (
        <div className="register-page">
            <div className="left-section">
                <img src={LogoBrandImg} alt={"Logo brand image"} className={"lb-image"}/>
                <h2>Why sign up?</h2>
                <Paragraph>
                    <ul>
                        <li>
                            <Text>Effortlessly organize all your API development in dedicated Workspaces.</Text>
                        </li>
                        <li>
                            <Text>Collaborate seamlessly with your team in one unified platform.</Text>
                        </li>
                        <li>
                            <Text>Best of all, it’s completely free!</Text>
                        </li>
                    </ul>
                </Paragraph>
                <img src={SignUpImg} alt={"Sign up image"} className={"signup-img"}/>
            </div>
            <form onSubmit={onSubmit} className="register-form right-section">
                <h1>Create APIFlow account</h1>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <Input name="email" type="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <Input.Password name="password"/>
                </div>
                <div className="form-input">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <Input.Password name="confirm_password"/>
                </div>
                <div className="form-input-footer">
                    <Checkbox name="signed_in">Stay signed in</Checkbox>
                </div>
                <button className="submit-btn" type="submit">Sign Up</button>
                <Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
                <Button className={"btn"} icon={<GoogleOutlined/>} iconPosition={"start"}>
                    Sign Up with Google
                </Button>
                <Button className={"btn"} icon={<GithubOutlined/>} iconPosition={"start"}>
                    Sign Up with Github
                </Button>
            </form>
        </div>
    );
}