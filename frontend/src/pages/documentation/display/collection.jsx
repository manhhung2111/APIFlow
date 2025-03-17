import TextEditor from "@components/app/editor/text.editor.jsx";

export default function DocumentationCollection({collection}){

	return (<div className="documentation-collection">
		<h2>{collection.name}</h2>
		<TextEditor value={collection.content} readOnly={true}/>
	</div>)
}