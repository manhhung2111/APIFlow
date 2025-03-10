import * as React from "react";
import {useContext} from "react";
import './styles/login.scss';
import LogoBrandImg from "@assets/images/logo.brand.svg";
import {Button, Checkbox, Divider, Form, Input} from 'antd';
import {NavLink, useNavigate} from "react-router";
import {GithubOutlined, GoogleOutlined} from "@ant-design/icons";
import useDocumentTitle from "@hooks/use.document.title";
import {toast} from "react-toastify";
import UserService from "@services/user.js";
import {AppContext} from "@contexts/app.jsx";

export default function LoginPage(){
	useDocumentTitle("APIFlow - Sign In");
	const navigate = useNavigate();
	const {user, setUser, setUsers, setWorkspaces} = useContext(AppContext);

	async function onSubmit(values){
		const response = await UserService.login(values["email"], values["password"]);

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
					<NavLink to="/reset-password" className='link'>Forgot password?</NavLink>
				</Form.Item>
				<button className="submit-btn" type="submit">Sign In</button>
				<Divider style={{color: "#6b6b6b", fontSize: "12px"}} plain>Or</Divider>
				<Button className={"btn"} icon={<GoogleOutlined/>} iconPosition={"start"}>
					Sign In with Google
				</Button>
				<Button className={"btn"} icon={<GithubOutlined/>} iconPosition={"start"}>
					Sign In with Github
				</Button>
				<p className="signup-message">Don’t have an account? <NavLink to="/register" className='link'>Get
					started now!</NavLink></p>
			</Form>
		</div>
	);
}