import {useEffect, useState} from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AppPDFViewer({data}) {

	const [pdfUrl, setPdfUrl] = useState(null);

	useEffect(() => {
		if (data) {
			// Convert raw data to an ArrayBuffer
			const byteArray = new Uint8Array(data.split("").map(char => char.charCodeAt(0)));
			const blob = new Blob([byteArray], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);

			// Cleanup URL on unmount
			return () => URL.revokeObjectURL(url);
		}
	}, [data]);


	return pdfUrl ? (
		<Document file={pdfUrl}>
			<Page pageNumber={1} />
		</Document>
	) : (
		<p>Loading PDF...</p>
	);
}