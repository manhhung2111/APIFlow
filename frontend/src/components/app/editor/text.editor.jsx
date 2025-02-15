import React, {useEffect} from "react";

import { useQuill } from "react-quilljs";

export default function TextEditor({handleChange, value}) {
	const theme = 'snow';
	// const theme = 'bubble';
	const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'indent'];
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ align: [] }],

			[{ list: 'bullet'}, { list: 'ordered' }],
			[{ indent: '-1'}, { indent: '+1' }],
			['link', 'image', 'video'],
		],
	};

	const { quill, quillRef } = useQuill({ placeholder: "Write something...", theme, modules, formats });

	useEffect(() => {
		if (quill) {
			quill.clipboard.dangerouslyPasteHTML(value || '');
		}
		handleChange(quill, quillRef);
	}, [quill]);

	return (
		<div className="text-editor">
			<div ref={quillRef} />
		</div>
	);
};
