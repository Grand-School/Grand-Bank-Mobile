import SocketJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import RestTemplate from './RestTemplate';
import { showMessage } from 'react-native-flash-message';
import { OperationInfo, NotificationsInfo } from './OperationsInfo';
import DataStorage from './DataStorage';

export default async function subscribe() {
    let token = await RestTemplate.getToken();
    let url = RestTemplate.getUrl(`/rest/websocket?access_token=${token}`);
    let socket = new SocketJS(url);
    let stompClient = Stomp.over(socket);
    let headers = await getConnectHeaders();

    stompClient.connect(headers, frame => {
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

        stompClient.subscribe('/user/queue/notifications', info => {
            const notification = JSON.parse(info.body);
            const settings = NotificationsInfo[notification.type];

            const lostNotificationsListCallback = DataStorage.getByKey('updateNotificationsList');
            if (!lostNotificationsListCallback) {
                DataStorage.getByKey('handlers').loadNotificationsCount();
            } else {
                lostNotificationsListCallback();
            }

            if (settings === undefined) {
                showMessage({
                    message: 'Ошибка',
                    description: 'Вам пришло неизвестное уведомление. Обновите приложение, что бы увидеть эту операцию!',
                    type: 'danger'
                });
                return;
            }

            showMessage({
                message: settings.title(notification),
                description: settings.info(notification),
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