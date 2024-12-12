import * as React from "react";
import {useForm} from "react-hook-form";


type FormData = {
	email: string,
	password: string,
	first_name?: string
	last_name?: string
}


export default function RegisterPage(){
	const {register, setValue, handleSubmit, formState: {errors}} = useForm<FormData>();

	const onSubmit = handleSubmit((data) => console.log(data));


	return (
		<form onSubmit={onSubmit}>
			<label>First Name</label>
			<input {...register("first_name")} />
			<label>Last Name</label>
			<input {...register("last_name")} />
			<button
				type="button"
				onClick={() => {
					setValue("first_name", "luo"); // ✅
					setValue("last_name", ""); // ❌: true is not string
				}}
			>
				SetValue
			</button>
		</form>
	);
}