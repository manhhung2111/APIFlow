import UserService from "@services/user.js";
import {toast} from "react-toastify";
import "./styles/password.scss";
import {Button, Form, Input} from "antd";
import {NavLink} from "react-router";
import * as React from "react";
import {omitUndefinedAndEmptyArr} from "@ant-design/pro-components";
import {useState} from "react";

export default function ForgotPasswordPage(){
	const [message, setMessage] = useState("");

	async function onSubmit(values){
		const response = await UserService.forgotPassword(values["email"]);

		if(response.code === 0){
			setMessage(response.message);
		} else {
			toast.error(response.message);
		}
	}

	return (<div className="forgot-password-page">
		<Form
			name="trigger"
			layout="vertical"
			autoComplete="off"
			onFinish={onSubmit}
			className="login-form"
			requiredMark={false}
		>
			<h2>Forgot Password</h2>
			<p className="sub">Enter your email, and we'll give you reset instruction</p>
			{message && <p className="message">
				{message}
			</p>}
			<Form.Item
				hasFeedback
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
			<button className="submit-btn" type="submit">Reset</button>
			<NavLink to={'/login'} className="link">Back to login</NavLink>
		</Form>
	</div>)
}