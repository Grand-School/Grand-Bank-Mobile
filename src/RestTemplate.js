import { serverUrl } from '../app.json';

class RestTemplate {
    async get(url) {
        let token = await this.getToken();
        return fetch(serverUrl + url, {
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
}

const INSTANCE = new RestTemplate();
export default INSTANCE;