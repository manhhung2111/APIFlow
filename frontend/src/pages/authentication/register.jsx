import SignUpImg from "@assets/images/sign.up.svg";
import useDocumentTitle from "@hooks/use.document.title";
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Form, Input, Typography} from "antd";
import {GithubOutlined, GoogleOutlined} from "@ant-design/icons";
import "./styles/register.scss";
import {NavLink} from "react-router";
import * as React from "react";

const {Paragraph, Text} = Typography;

export default function RegisterPage() {
    useDocumentTitle("APIFlow - Sign Up");

    async function onSubmit(values) {


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

            <Form
                name="trigger"
                layout="vertical"
                autoComplete="off"
                onFinish={onSubmit}
                className="register-form right-section"
                requiredMark={false}
            >
                <h1>Create APIFlow account</h1>
                <Form.Item
                    hasFeedback
                    label="Email"
                    name="email"
                    validateTrigger="onBlur"
                    className="form-input"
                    rules={[{
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter valid email address"
                    },]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    hasFeedback
                    label="Password"
                    name="password"
                    validateTrigger="onBlur"
                    className="form-input"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your password"
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    hasFeedback
                    label="Confirm Password"
                    name="confirm_password"
                    validateTrigger="onBlur"
                    dependencies={["password"]}
                    className="form-input"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your password"
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" className="form-input-footer">
                    <Checkbox>Stay signed in</Checkbox>
                </Form.Item>
                <button className="submit-btn" type="submit">Sign Up</button>
                <Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
                <Button className={"btn"} icon={<GoogleOutlined/>} iconPosition={"start"}>
                    Sign Up with Google
                </Button>
                <Button className={"btn"} icon={<GithubOutlined/>} iconPosition={"start"}>
                    Sign Up with Github
                </Button>
                <p className="signup-message">Already have an account? <NavLink to="/login" className='link'>Sign in</NavLink></p>
            </Form>
        </div>
    );
}