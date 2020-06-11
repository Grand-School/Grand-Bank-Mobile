import SocketJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import RestTemplate from './RestTemplate';
import { showMessage } from 'react-native-flash-message';
import { OperationInfo } from './OperationsInfo';
import DataStorage from './DataStorage';
import { set } from 'react-native-reanimated';

export default async function subscribe() {
    let token = await RestTemplate.getToken();
    let url = RestTemplate.getUrl(`/rest/websocket?access_token=${token}`);
    let socket = new SocketJS(url);
    let stompClient = Stomp.over(socket);
    let headers = await getConnectHeaders();

    stompClient.connect(headers, frame => {
        console.log(OperationInfo)
        stompClient.subscribe('/user/queue/operation', info => {
            const operation = JSON.parse(info.body);
            const settings = OperationInfo[operation.type];
            DataStorage.getByKey('updateHistoryList')();

            if (settings === undefined) {
                showMessage({
                    message: 'Ошибка',
                    description: 'Вам пришла неизвестная операция. Обновите приложение, что бы увидеть эту операцию!',
                    type: 'danger'
                });
                return;
            }

            if (!settings.show(operation)) {
                return;
            }

            showMessage({
                message: settings.title(operation),
                description: settings.info(operation),
                type: 'info'
            });
        });
    });
}

async function getConnectHeaders() {
    return RestTemplate.get('/rest/profile/csrf')
        .then(({ data }) => {
            let headers = {
                // 'Authorization': 'Bearer ' + token,
            };
            headers[data.headerName] = data.token;
            return headers;
        });
}