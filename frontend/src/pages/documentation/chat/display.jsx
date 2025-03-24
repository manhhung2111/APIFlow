import DocumentIcon from "@assets/icons/document.jsx";
import {CloseOutlined, SendOutlined} from "@ant-design/icons";
import RestartAltIcon from "@assets/icons/restart.alt.jsx";
import {Input} from "antd";
import '../styles/chat.scss';
import {useEffect, useRef, useState} from "react";
import Markdown from "react-markdown";

import {toast} from "react-toastify";
import GeminiModel from "@configs/gemini.js";

export default function DocumentationChat({open, setOpen, documentJSON}){
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const chatEndRef = useRef(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [history, open]);

	const handleSubmit = async() => {
		try {
			if(!question.trim()) return;

			// Add user message to history
			const newHistory = [...history, {role: "user", parts: [{text: question}]}];
			setHistory(newHistory);
			setQuestion("");
			setLoading(true);

			const gemini = new GeminiModel(documentJSON);
			const chat = gemini.model.startChat({
				history: [...history]
			});

			const result = await chat.sendMessageStream(question);

			let accumulatedText = "";
			for await (const chunk of result.stream) {
				const chunkText = chunk.text();
				accumulatedText += chunkText;

				setAnswer(accumulatedText);
			}

			setHistory((prev) => [...prev, {role: "model", parts: [{text: accumulatedText}]}]);
			setAnswer("")
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
			{history.map((msg, index) => {
				return (
					<div key={index} className={`chat-message ${msg.role}`}>
						{msg.role === "model" ? <Markdown>{msg.parts[0].text}</Markdown> : <p>{msg.parts[0].text}</p>}
					</div>
				)
			})}
			{loading && (
				<div className="chat-message model loader">
					<p>Working on it <span className="dots"></span></p>

				</div>
			)}
			{!loading && answer && <div className="chat-message model">
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