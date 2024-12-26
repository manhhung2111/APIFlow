export const collections = [
	{id: 1, name: "Collection 1", content: "This is collection 1"},
	{id: 2, name: "Collection 2", content: "This is collection 2"},
	{id: 3, name: "Collection 3", content: "This is collection 3"},
]

export const folders = [
	{id: 1, collection_id: 1, name: "Folder 1", content: "This is folder 1"},
	{id: 2, collection_id: 1, name: "Folder 2", content: "This is folder 2"},
	{id: 3, collection_id: 1, name: "Folder 3", content: "This is folder 3"},
	{id: 4, collection_id: 2, name: "Folder 1", content: "This is folder 1"},
	{id: 5, collection_id: 2, name: "Folder 2", content: "This is folder 2"},
	{id: 6, collection_id: 2, name: "Folder 3", content: "This is folder 3"},
	{id: 7, collection_id: 3, name: "Folder 1", content: "This is folder 1"},
	{id: 8, collection_id: 3, name: "Folder 2", content: "This is folder 2"},
	{id: 9, collection_id: 3, name: "Folder 3", content: "This is folder 3"},
]

export const requests = [
	{id: 1, folder_id: 1, collection_id: 1, name: "Request 1", content: "This is request 1"},
	{id: 2, folder_id: 1, collection_id: 1, name: "Request 2", content: "This is request 2"},
	{id: 3, folder_id: 2, collection_id: 1, name: "Request 1", content: "This is request 1"},
	{id: 4, folder_id: 2, collection_id: 2, name: "Request 2", content: "This is request 2"},
	{id: 5, folder_id: 4, collection_id: 2, name: "Request 1", content: "This is request 1"},
	{id: 6, folder_id: 5, collection_id: 2, name: "Request 1", content: "This is request 1"},
	{id: 7, folder_id: 6, collection_id: 3, name: "Request 1", content: "This is request 1"},
	{id: 8, folder_id: 6, collection_id: 3, name: "Request 2", content: "This is request 2"},
	{id: 9, folder_id: 7, collection_id: 3, name: "Request 1", content: "This is request 1"},
];

export const examples = [
	{id: 1, request_id: 1, folder_id: 1, collection_id: 1, name: "Example 1", content: "This is example 1"},
	{id: 2, request_id: 1, folder_id: 1, collection_id: 1, name: "Example 2", content: "This is example 2"},
	{id: 3, request_id: 3, folder_id: 2, collection_id: 1, name: "Example 1", content: "This is example 1"},
	{id: 4, request_id: 4, folder_id: 2, collection_id: 2, name: "Example 2", content: "This is example 2"},
	{id: 5, request_id: 5, folder_id: 4, collection_id: 2, name: "Example 1", content: "This is example 1"},
	{id: 6, request_id: 6, folder_id: 5, collection_id: 2, name: "Example 1", content: "This is example 1"},
	{id: 7, request_id: 7, folder_id: 6, collection_id: 3, name: "Example 1", content: "This is example 1"},
	{id: 8, request_id: 9, folder_id: 7, collection_id: 3, name: "Example 2", content: "This is example 2"},
	{id: 9, request_id: 9, folder_id: 7, collection_id: 3, name: "Example 1", content: "This is example 1"},
];

export const environments = [
	{id: 1, name: 'Globals', scope: 0},
	{id: 2, name: "Environment 1", scope: 1},
	{id: 3, name: "Environment 2", scope: 1},
	{id: 4, name: "Environment 3", scope: 1}
]