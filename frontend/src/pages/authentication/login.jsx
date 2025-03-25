import * as React from "react";
import {useContext} from "react";
import './styles/login.scss';
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Form, Input} from 'antd';
import {NavLink, useNavigate} from "react-router";
import {GithubOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import useDocumentTitle from "@hooks/use.document.title";
import {toast} from "react-toastify";
import UserService from "@services/user.js";
import {AppContext} from "@contexts/app.jsx";
import {useGoogleLogin} from "@react-oauth/google";
import GoogleSVG from "@assets/images/google.icon.svg";
import GithubSVG from "@assets/images/github.icon.svg";

export default function LoginPage(){
	useDocumentTitle("APIFlow - Sign In");
	const navigate = useNavigate();
	const {user, setUser, setUsers, setWorkspaces} = useContext(AppContext);

	async function onSubmit(values){
		const response = await UserService.login(values);

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
	}

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
		<div className="login-page">
			<img src={LogoBrandImg} alt={"Logo brand image"} className={"lb-image"}/>
			<Form
				name="trigger"
				layout="vertical"
				autoComplete="off"
				onFinish={onSubmit}
				className="login-form"
				requiredMark={false}
			>
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
				<Form.Item className="form-input-footer">
					<Form.Item name="remember" valuePropName="checked" noStyle>
						<Checkbox>Stay signed in</Checkbox>
					</Form.Item>
					<NavLink to="/forgot-password" className='link'>Forgot password?</NavLink>
				</Form.Item>
				<button className="submit-btn" type="submit">Sign In</button>
				<Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
				<Button className={"btn"} onClick={() => login()}>
					<img src={GoogleSVG} alt={"Google icon"}/>Continue with Google
				</Button>
				<p className="signup-message">Don’t have an account? <NavLink to="/register" className='link'>Get
					started now!</NavLink></p>
			</Form>
		</div>
	);
}