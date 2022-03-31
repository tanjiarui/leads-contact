import axios, { AxiosPromise, AxiosResponse, Method } from "axios";

export class API {
    Image
    Contact
    constructor(baseUrl) {
        const call = (sub) => (method) => (path, data, headers) => {
            const config = {
                baseURL: baseUrl,
                method: method,
                url: sub + (path ? `/${path}` : ''),
                params: method === "GET" ? data : {},
                data: method === "GET" ? {} : data,
                headers: headers ? headers : {}
            };
            return axios(config).then(r => r, err => Promise.reject(err.response));
        };
        const clientFactory = path => new Client(call, path);
        this.Image = () => new Image(clientFactory);
        this.Contact = () => new Contact(clientFactory);
    }
}

class Client {

    constructor(call, sub) {
        this._call = call(sub)
    }

    get get() {
        return this._call("GET")
    }
    get put() {
        return this._call("PUT")
    }
    get post() {
        return this._call("POST")
    }
    get delete() {
        return this._call("DELETE")
    }
}

class Endpoint {
    client
    constructor(url, clientFactory) {
        this.client = clientFactory(url);
    }
}

class Image extends Endpoint {

    constructor(clientFactory) {
        super("images", clientFactory)
    }

    upload(params) {
        return this.client.post(``, params, {'Content-Type': 'application/json'})
    }

    detect(id) {
        return this.client.get(`${id}/detect-text`, {})
    }
}

class Contact extends Endpoint {
    constructor(clientFactory) {
        super("contacts", clientFactory);
    }

    create(imageId, params) {
        return this.client.post(`${imageId}/save-text`, params)
    }

    find(name) {
        return this.client.post(`find-text`, { name })
    }

    delete(imageId) {
        return this.client.delete(`${imageId}/delete-text`, {})
    }

    update(imageId, params) {
        return this.client.put(`${imageId}/update-text`, params)
    }
}

const api = function () {
    return new API(process.env.REACT_APP_API_URL);
}();
export default api;