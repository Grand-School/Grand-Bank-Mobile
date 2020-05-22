import { serverUrl } from '../app.json';

class RestTemplate {
    async get(url) {
        let token = await this.getToken();
        return fetch(this.getUrl(url), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json());
    }

    async getToken() {
        return this.authorization.token;
    }

    setAuthorization(authorization) {
        this.authorization = authorization;
    }

    getUrl(url) {
        return serverUrl + url;
    }
}

const INSTANCE = new RestTemplate();
export default INSTANCE;