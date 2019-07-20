import { request, handleResponse } from "./request";

export const todoService = {
    getItems,
    addItem,
    deleteItem,
    changeStatus
};

function getItems(callback) {
    
    let url = '/load/list';
    fetch(url, request.GET).then(response => response.json()).then(callback);
}

function addItem(text, detail, callback) {
    const req = {
        ...request.POST,
        body: JSON.stringify({
            text: text,
            detail: detail
        })
    };
    
    let url = '/add/list';
    return fetch(url, req).then(handleResponse).then(callback);
}

function deleteItem(uuid) {
    let url = '/delete/' + uuid;
    fetch(url, request.DELETE).then(handleResponse);
}

function changeStatus(uuid) {
    
    let url = '/update/' + uuid;
    fetch(url, request.PUT).then(handleResponse);
}
