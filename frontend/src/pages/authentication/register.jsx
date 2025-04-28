import SignUpImg from "@assets/images/sign.up.svg";
import useDocumentTitle from "@hooks/use.document.title";
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Form, Input, Typography} from "antd";
import {GithubOutlined, GoogleOutlined} from "@ant-design/icons";
import "./styles/register.scss";
import {NavLink, useNavigate} from "react-router";
import * as React from "react";
import UserService from "@services/user.js";
import {toast} from "react-toastify";
import {useGoogleLogin} from "@react-oauth/google";
import GoogleSVG from "@assets/images/google.icon.svg";
import {AppContext} from "@contexts/app.jsx";
import {useContext, useState} from "react";

const {Paragraph, Text} = Typography;

export default function RegisterPage() {
    useDocumentTitle("APIFlow - Sign Up");
    const navigate = useNavigate();
    const {user, setUser, setUsers, setWorkspaces} = useContext(AppContext);

    const [verifyingEmail, setVerifyingEmail] = useState(false);

    async function onSubmit(values) {
        const response = await UserService.register(values["email"], values["password"]);

        if (response.code === 0){
            // toast.success(response.message);
            setVerifyingEmail(true);
        } else {
            toast.error(response.message);
        }
    }

    // async function onVerify(values) {
    //     const response = await UserService.verifyEmail(values["code"]);

    //     if (response.code === 0){
    //         toast.success(response.message);
    //         navigate("/login")
    //     } else {
    //         toast.error(response.message);
    //     }
    // }

    const login = useGoogleLogin({
        onSuccess: async(credentialResponse) => {
            try {
                console.log(credentialResponse);

                const response = await UserService.googleAuth(credentialResponse.access_token);

                if(response.code === 0){
                    toast.success(response.message);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    setUser(response.data.user);
                    setUsers(response.data.users);
                    setWorkspaces(response.data.workspaces);
                    navigate("/");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        },
        onError: async(error) => {
            toast.error(error?.message ?? "Something went wrong");
        },
        flow: "implicit"
    });

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

            {verifyingEmail === false && <Form
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
                    <Input placeholder={"Email address"}/>
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
                    <Input.Password placeholder={"Password"}/>
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
                    <Input.Password placeholder={"Confirm Password"}/>
                </Form.Item>
                <button className="submit-btn" type="submit">Sign Up</button>
                <Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
                <Button className={"btn"} onClick={() => login()}>
                    <img src={GoogleSVG} alt={"Google icon"}/>Continue with Google
                </Button>
                <p className="signup-message">Already have an account? <NavLink to="/login" className='link'>Sign in</NavLink></p>
            </Form>}
            {verifyingEmail === true && <div className="right-section register-form">
                <div className="successful-msg">Check your email to complete registration. An verify email was sent to your email ✅</div>
            </div>}
        </div>
    );
}