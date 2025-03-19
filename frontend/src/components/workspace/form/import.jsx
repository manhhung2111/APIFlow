import "../styles/form.scss"
import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Button, Modal} from "antd";
import {DeleteOutlined, FileTextOutlined, ImportOutlined} from "@ant-design/icons";

export default function WorkspaceImportForm({open, setOpen}){
	const [file, setFile] = useState(null);

	const onDrop = useCallback(acceptedFiles => {
		acceptedFiles.forEach(file => {
			setFile(file);
		})
	}, [])

	const {getRootProps, acceptedFiles, getInputProps, isDragActive} = useDropzone({
		onDrop,
		multiple: false, // Allow only one file
		accept: {"application/json": [".json"]} // This helps, but we still validate manually
	});

	const handleSubmit = () => {

	}

	const handleCancel = () => {
		setOpen(false);
		setFile(null);
	}

	return <Modal className="workspace-import-form" title={"Import collection"} open={open} onOk={handleSubmit}
				  onCancel={handleCancel} footer={[
		<Button key="cancel"  color="default" className="cancel-btn" variant={"filled"} onClick={handleCancel}>
			Cancel
		</Button>,
		<Button
			key="submit"
			className="submit-btn"
			color="default"
			variant={"filled"}
			disabled={file === null}
			onClick={handleSubmit}
		>
			Import
		</Button>,
	]}>
		<section className="container">
			<div className="zone">
				<div className="drop-zone" {...getRootProps()}>
					<input {...getInputProps()} />
					{isDragActive ? (
						<div className="drop-files">
							<ImportOutlined/> <p>Drop anywhere to import</p>
						</div>
					) : (
						<div className="drag-files">
							<div className="left">
								<ImportOutlined/>
							</div>
							<div className="right">
								<h3>Drop anywhere to import</h3>
								<p>Or click to select a <span>JSON file</span> (Only .json files allowed)</p>
							</div>
						</div>
					)}
				</div>
			</div>
			{file && <div className="file-display">
				<p><FileTextOutlined/>{file.name}</p>
				<div className="action">
					<DeleteOutlined onClick={() => setFile(null)}/>
				</div>
			</div>}
		</section>
	</Modal>
}