import DocumentIcon from "@assets/icons/document.jsx";
import {CloseOutlined, SendOutlined} from "@ant-design/icons";
import RestartAltIcon from "@assets/icons/restart.alt.jsx";
import {Input} from "antd";
import '../styles/chat.scss';

export default function DocumentationChat({open, setOpen}) {

	if (!open) {
		return "";
	}

	return (<div className="documentation-chat">
		<div className="chat-header">
			<div className="left">
				<DocumentIcon />
				<span>Flowbot</span>
			</div>
			<div className="right">
				<RestartAltIcon />
				<CloseOutlined onClick={() => setOpen(false)} />
			</div>
		</div>
		<div className="chat-main">
			This is main chat outlined
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>
			<p>dasdasdasdas</p>

		</div>
		<div className="chat-input">
			<Input placeholder={"Your message goes here..."}/>
			<button>
				<SendOutlined />
			</button>
		</div>
	</div>)
}