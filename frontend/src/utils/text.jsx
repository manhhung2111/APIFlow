export function BaseLabel(props) {
	const {icon, title} = props;

	return (
		<div className='base-label'>
			{icon}
			<div className='title'>{title}</div>
		</div>
	)
}