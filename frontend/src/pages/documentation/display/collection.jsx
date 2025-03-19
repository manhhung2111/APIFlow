import Request from "@components/request/request.jsx";
import DocumentationTable from "@pages/documentation/display/table.jsx";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";

export default function DocumentationCollection({collection}){

	const authorizationData = Object.keys(collection.authorization.data).map((key) => ({
		key,
		value: `<${key}>`
	}));

	return (<div className="documentation-collection" id={`collection-${collection._id}`}>
		<h2>{collection.name}</h2>
		{/*{collection.content.length > 0 && <TextEditor value={collection.content} readOnly={true}/>}*/}
		{collection.content.length === 0 && <p className="empty-desc">This collection does not have any description...</p>}
		{collection.content.length > 0 && <AppMarkdownEditor value={collection.content} readOnly={true}/>}

		{(collection.authorization.type === Request.AUTHORIZATION.BasicAuth.value || collection.authorization.type === Request.AUTHORIZATION.BearerToken.value) &&
			<DocumentationTable
				title={"Authorization"}
				subtitle={Request.getAuthorization(collection.authorization.type)}
				data={authorizationData}
			/>}
		{(collection.authorization.type === Request.AUTHORIZATION.JWTBearer.value) &&
			<DocumentationTable
				title={"Authorization"}
				subtitle={Request.getAuthorization(collection.authorization.type)}
				data={null}
			/>}
	</div>)
}