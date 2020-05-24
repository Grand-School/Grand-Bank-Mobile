import { serverUrl } from '../app.json';
import { refresh } from 'react-native-app-auth';
import { oauth as oauthSettings } from '../app.json';
import { Alert } from 'react-native';
import { parseAuthorization } from './LoginPage';

class RestTemplate {
    async get(url) {
        let requestInfo;
        let token = await this.getToken();
        return fetch(this.getUrl(url), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                requestInfo = { status: response.status, isOk: response.ok };
                return response.json();
            })
            .then(data => {
                if (!requestInfo.ok && requestInfo.status === 401) {
                    this.logoutHandler();
                }
                return data;
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
                Alert.alert('Ошибка перезагрзки токена', error.message);
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