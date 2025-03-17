import TextEditor from "@components/app/editor/text.editor.jsx";
import Request from "@components/request/request.jsx";
import DocumentationTable from "@pages/documentation/display/table.jsx";

export default function DocumentationCollection({collection}){

	const authorizationData = Object.keys(collection.authorization.data).map((key) => ({
		key,
		value: `<${key}>`
	}));

	console.log(authorizationData)
	return (<div className="documentation-collection" id={`collection.${collection._id}`}>
		<h2>{collection.name}</h2>
		<TextEditor value={collection.content} readOnly={true}/>

		{collection.authorization.type !== Request.AUTHORIZATION.NoAuth.value &&
			<DocumentationTable
				title={"Authorization"}
				subtitle={Request.getAuthorization(collection.authorization.type)}
				data={authorizationData}
			/>}
	</div>)
}