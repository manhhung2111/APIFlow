import Request from "@components/request/request.jsx";
import TextEditor from "@components/app/editor/text.editor.jsx";
import DocumentationTable from "@pages/documentation/display/table.jsx";
import {FolderOutlined} from "@ant-design/icons";
import DocumentationRequest from "@pages/documentation/display/request.jsx";

export default function DocumentationFolder({folder, collection}){

	const getInheritAuthMessage = () => {
		if(folder != null && folder.authorization.type === Request.AUTHORIZATION.InheritAuth.value){
			if(collection?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
				return {
					type: Request.AUTHORIZATION.BasicAuth.label,
					message: <div>This request is using Basic Auth from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
				return {
					type: Request.AUTHORIZATION.BearerToken.label,
					message: <div>This request is using Bearer Token from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.JWTBearer.value){
				return {
					type: Request.AUTHORIZATION.JWTBearer.label,
					message: <div>This request is using JWT Token from collection <b>{collection.name}</b></div>
				}
			}

			return null;
		}
	}

	const authorizationData = Object.keys(collection.authorization.data).map((key) => ({
		key,
		value: `<${key}>`
	}));

	const authorizationInherit = getInheritAuthMessage();

	return (<div className="documentation-folder" id={`folder.${folder._id}`}>
		<h3><FolderOutlined/>{folder.name}</h3>
		{folder.content.length > 0 && <TextEditor value={folder.content} readOnly={true}/>}
		{folder.content.length === 0 && <p className="empty-desc">This collection does not have any description...</p>}
		{(folder.authorization.type === Request.AUTHORIZATION.BasicAuth.value || folder.authorization.type === Request.AUTHORIZATION.BearerToken.value) &&
			<DocumentationTable
				title={"Authorization"}
				subtitle={Request.getAuthorization(collection.authorization.type)}
				data={authorizationData}
			/>}
		{folder.authorization.type === Request.AUTHORIZATION.InheritAuth.value && authorizationInherit !== null &&
			<DocumentationTable
				title={"Authorization"}
				subtitle={authorizationInherit.type}
				data={authorizationInherit.message}
				type={"message"}
			/>}
		{folder.children && folder.children.length > 0 && <div className="folder-requests">
			{folder.children.map((item, index) => {
				return <DocumentationRequest request={item} key={index} collection={collection} folder={folder}/>
			})}
		</div>}
	</div>)
}