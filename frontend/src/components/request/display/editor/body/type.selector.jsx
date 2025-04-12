export default function RequestBodyTypeSelector({bodyType, checked}) {

	return (
		<div className="body-type-selector" key={`body-type-${bodyType.value}`}>
			<input type='radio' id={`body-type-${bodyType.value}`} value={bodyType.value} name="body-type" defaultChecked={checked}/>
			<label htmlFor={`body-type-${bodyType.value}`}>&nbsp;{bodyType.label}</label>
		</div>
	);
}