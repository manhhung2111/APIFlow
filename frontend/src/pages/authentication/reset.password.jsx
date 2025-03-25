import UserService from "@services/user.js";
import {toast} from "react-toastify";
import "./styles/password.scss";
import {Form, Input} from "antd";
import {NavLink, useNavigate, useSearchParams} from "react-router";

export default function ResetPasswordPage(){
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	async function onSubmit(values){
		const response = await UserService.resetPassword(values["password"], searchParams.get("token"));

		if(response.code === 0){
			toast.success(response.message);
			navigate("/login");
		} else {
			toast.error(response.message);
		}
	}


	return (<div className="reset-password-page">
		<Form
			name="trigger"
			layout="vertical"
			autoComplete="off"
			onFinish={onSubmit}
			className="login-form"
			requiredMark={false}
		>
			<h2>Reset account password</h2>
			<p className="sub">Please choose your new password</p>
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
			<button className="submit-btn" type="submit">Save New Password</button>
			<NavLink to={'/login'} className="link">Back to login</NavLink>
		</Form>
	</div>)

}