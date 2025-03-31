import DocumentIcon from "@assets/icons/document.jsx";
import {CloseOutlined, SendOutlined} from "@ant-design/icons";
import RestartAltIcon from "@assets/icons/restart.alt.jsx";
import {Input} from "antd";
import '../styles/chat.scss';
import {useContext, useEffect, useRef, useState} from "react";
import Markdown from "react-markdown";

import {toast} from "react-toastify";
import GeminiModel from "@configs/gemini.js";
import CollectionService from "@services/collection.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import _ from "lodash";

export default function DocumentationChat({open, setOpen, documentJSON}){
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const chatEndRef = useRef(null);
	const {activeCollection} = useContext(WorkspaceContext);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [history, open]);

	const handleSubmit = async() => {
		try {
			if(!question.trim()) return;

			// Add user message to history
			let tempQuestion = _.cloneDeep(question);
			const newHistory = [...history, {role: "user", parts: [{text: tempQuestion}]}];
			setHistory(newHistory);
			setLoading(true);
			setQuestion("");

			// const gemini = new GeminiModel(documentJSON);
			// const chat = gemini.model.startChat({
			// 	history: [...history]
			// });
			//
			// const result = await chat.sendMessageStream(question);
			//
			// let accumulatedText = "";
			// for await (const chunk of result.stream) {
			// 	const chunkText = chunk.text();
			// 	accumulatedText += chunkText;
			//
			// 	setAnswer(accumulatedText);
			// }
			const result = await CollectionService.searchRequests(activeCollection, tempQuestion);
			if (result.code == 0) {
				setHistory((prev) => [...prev, {role: "model", parts: [{text: result.data.request}]}]);
			} else {
				setHistory((prev) => [...prev, {role: "model", parts: [{text: result.message}]}]);
			}

			// setAnswer("")
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}

	const handleClearHistory = () => {
		setHistory([])
	}

	if(!open){
		return "";
	}

	return (<div className="documentation-chat">
		<div className="chat-header">
			<div className="left">
				<DocumentIcon/>
				<span>Flowbot</span>
			</div>
			<div className="right">
				<RestartAltIcon onClick={handleClearHistory}/>
				<CloseOutlined onClick={() => setOpen(false)}/>
			</div>
		</div>
		<div className="chat-main">
			{!history || history.length === 0 && <div className='empty-message'>
				<div className="icon">
					<DocumentIcon/>
				</div>
				<div className="messages">
					<p>Hi! I'm your API assistant.</p>
					<p>Just type your question, and I’ll do my best to assist you</p>
				</div>
			</div>}
			{history && history.length > 0 && history.map((msg, index) => {
				return (
					<div key={index} className={`chat-message ${msg.role}`}>
						{msg.role === "model" ? <Markdown>{msg.parts[0].text}</Markdown> : <p>{msg.parts[0].text}</p>}
					</div>
				)
			})}
			{history && history.length > 0 && loading && (
				<div className="chat-message model loader">
					<p>Working on it <span className="dots"></span></p>

				</div>
			)}
			{history && history.length > 0 && !loading && answer && <div className="chat-message model">
				<Markdown>{answer}</Markdown>
			</div>}
			<div ref={chatEndRef}/>
		</div>
		<div className="chat-input">
			<Input placeholder={"Your message goes here..."} value={question}
				   onChange={(e) => setQuestion(e.target.value)}
				   onPressEnter={handleSubmit}
			/>
			<button onClick={handleSubmit}>
				<SendOutlined/>
			</button>
		</div>
	</div>)
}