import { serverUrl } from '../app.json';
import { refresh } from 'react-native-app-auth';
import { oauth as oauthSettings } from '../app.json';
import { parseAuthorization } from './pages/LoginPage';
import { showMessage } from 'react-native-flash-message';
import { Platform } from 'react-native';

class RestTemplate {
    async get(url, body) {
        return await this.fetch(url, 'GET', body);
    }

    async post(url, body) {
        return await this.fetch(url, 'POST', body);
    }

    async delete(url, body) {
        return await this.fetch(url, 'DELETE', body);
    }

    async fetch(url, method, body = null) {
        let requestInfo;
        let token = await this.getToken();

        const settings = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Native-Application': 'Grand Bank Mobile',
                'Native-Application-Platform': Platform.OS
            },
            method
        };

        if (body !== null) {
            settings.body = JSON.stringify(body);
        }

        return fetch(this.getUrl(url), settings)
            .then(response => {
                requestInfo = { status: response.status, isOk: response.ok };
                return response.text();
            })
            .then(response => {
                try {
                    return JSON.parse(response);
                } catch (e) {
                    return '';
                }
            })
            .then(data => {
                if (!requestInfo.ok && requestInfo.status === 401) {
                    this.logoutHandler();
                }
                return { data, requestInfo };
            });
    }

    async getToken() {
        let expireOn = new Date(this.authorization.expireOn);
        if (expireOn >= new Date()) {
            return this.authorization.token;
        } else {
            await this.updateToken();
            return this.authorization.token;
        }
    }

    getUrl(url) {
        return serverUrl + url;
    }

    async updateToken() {
        const that = this;
        refresh(oauthSettings, { refreshToken: this.authorization.refreshToken })
            .then(response => that.refreshHandler(parseAuthorization(response)))
            .catch(error => {
                showMessage({
                    message: 'Ошибка!',
                    description: 'Ошибка обновления токена: ' + error.message,
                    type: 'danger'
                });
                this.logoutHandler();
            });
    }

    setAuthorization(authorization) {
        this.authorization = authorization;
    }

    setLogoutHandler(logoutHandler) {
        this.logoutHandler = logoutHandler;
    }

    setRefreshHandler(refreshHandler) {
        this.refreshHandler = refreshHandler;
    }
}

const INSTANCE = new RestTemplate();
export default INSTANCE;