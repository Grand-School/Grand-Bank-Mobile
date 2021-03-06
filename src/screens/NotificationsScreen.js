import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HistoryTable } from '../elements/HistoryTable';
import RestTemplate from '../RestTemplate';
import { parseToDateTime, parseErrorResponse, updateProfileAndGoBack, printMessage } from '../Utils';
import { PinCodeModal } from '../elements/PinCodeModal';
import DataStorage from '../DataStorage';

export function NotificationsScreen() {
    let [pinCode, setPinCode] = useState(null);
    let [historyTable, setHistoryTable] = useState(null);

    DataStorage.put('updateNotificationsList', () => historyTable.refreshData());
    const getPage = (page, count) => RestTemplate.get(`/rest/profile/notifications?page=${page}&count=${count}`);
    const getDate = data => new Date(Date.parse(data.date));
    const parseToObject = data => parseDataToObject(data, { pinCode, historyTable });
    const empty = (
        <View>
            <Text style={{ textAlign: 'center' }}>У вас нет уведомлений!</Text>
        </View>
    );

    const callbacks = {
        getCount: DataStorage.getByKey('handlers').loadNotificationsCount,
        getPage, getDate, parseToObject, empty
    };
    
    return (
        <>
            <HistoryTable {...callbacks} count={5} showDate={false} ref={item => setHistoryTable(item)} />
            <PinCode ref={item => setPinCode(item)} />
        </>
    );
}

class PinCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.callback = () => null;
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    finish() {
        this.hide();
        this.callback = () => null;
        this.pinCode.clear();
    }

    render() {
        return <PinCodeModal isVisible={this.state.visible} onCloseAsk={this.hide} onPinCode={this.callback} ref={ref => this.pinCode = ref} />
    }
}

function parseDataToObject(data, options) {
    let settings = userNotificationTableTemplate[data.type];
    if (!settings) {
        return (
            <View style={{ borderRadius: 5, borderWidth: 1, padding: 5, marginBottom: 15 }}>
                <Text style={{ textAlign: 'center' }}>Обновите приложение, что бы увидеть это уведомление!</Text>
            </View>
        );
    }

    let printData = settings(data);
    let time = new Date(Date.parse(data.date));

    return (
        <View style={{ borderRadius: 5, borderWidth: 1, padding: 5, marginBottom: 15 }}>
            <View>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{printData.title}</Text>
                <View>
                    {printData.data.map((item, index) => 
                        typeof item === 'string' ? <Text key={index}>{item}</Text> : <View key={index}>{item}</View>
                    )}
                </View>
                <Text style={{ color: 'gray' }}>{parseToDateTime(time)}</Text>
            </View>
            <View style={{ width: '80%', flexDirection: 'row', marginTop: 5 }}>
                {printData.buttons.map((item, index) => (
                    <TouchableOpacity key={item.text} style={[{ width: '40%', borderWidth: 1, padding: 5 }, (index !== printData.buttons.length && { marginRight: 5 })]}
                        onPress={() => item.onPress(data.id, options)}>
                        <Text style={{ textAlign: 'center' }}>{item.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

function getOperationsItemsText(operation) {
    return operation.operationItems
        .reduce((acc, item) => {
            let accItems = acc.filter(filterItem => filterItem.id === item.companyItem.id);
            if (accItems.length === 0) {
                acc.push({
                    id: item.companyItem.id,
                    name: item.companyItem.name,
                    count: 1
                });
            } else {
                accItems[0].count = accItems[0].count + 1;
            }
            return acc;
        }, []).reduce((acc, item) => {
            acc.push(item.count === 1 ? item.name : `${item.name} (x${item.count})`);
            return acc;
        }, []).join(', ');
}

const userNotificationTableTemplate = {
    COMPANY_OPERATION: notification => {
        let operation = notification.companyOperation;
        let price = operation.operationItems.reduce((acc, item) => acc += item.price, 0);
        let itemsName = getOperationsItemsText(operation);

        return {
            title: `Покупка товаров у фирмы ${operation.company.name}`,
            data: [
                <Text>Товары: <Text style={{ fontWeight: '500' }}>{itemsName}</Text>.</Text>, 
                <Text>Сумма: <Text style={{ fontWeight: '500' }}>{price} грандиков</Text>.</Text>
            ],
            buttons: [
                {
                    text: 'Подтвердиь',
                    onPress(notificationId, { pinCode, historyTable }) {
                        pinCode.callback = pinCodeType => {
                            RestTemplate.post(`/rest/profile/company/order?notificationId=${notificationId}&pinCode=${pinCodeType}`)
                                .then(({ data, requestInfo }) => {
                                    printMessage(requestInfo, data, 'Вы успешно подтвердили покупку товаров у фирмы!');
                                    pinCode.finish();
                                    historyTable.refreshData();
                                    updateProfileAndGoBack();
                                });
                        };
                        pinCode.show();
                    }
                },
                {
                    text: 'Отменить',
                    onPress(notificationId, { historyTable }) {
                        RestTemplate.delete(`/rest/profile/company/order?notificationId=${notificationId}`)
                            .then(({ data, requestInfo }) => {
                                printMessage(requestInfo, data, 'Вы успешно отклонили покупку товаров у фирмы!');
                                historyTable.refreshData();
                            });
                    }
                }
            ]
        };
    },
    COMPANY_OPERATION_CANCEL: notification => {
        let cancelOperation = notification.cancelCompanyOperation;
        let operation = cancelOperation.companyOperation;
        let itemsName = getOperationsItemsText(operation);
        let price = operation.operationItems.reduce((acc, item) => acc += item.price, 0);

        return {
            title: `Отмена покупки товаров у фирмы ${operation.company.name}`,
            data: [
                <Text>Товары: <Text style={{ fontWeight: '500' }}>{itemsName}</Text>.</Text>, 
                <Text>Сумма: <Text style={{ fontWeight: '500' }}>{price} грандиков</Text>.</Text>
            ],
            buttons: [
                {
                    text: 'Отменить',
                    onPress(notificationId, { historyTable, pinCode }) {
                        pinCode.callback = pinCodeType => {
                            RestTemplate.post(`/rest/profile/company/order/cancel?notificationId=${notificationId}&pinCode=${pinCodeType}`)
                                .then(({ requestInfo, data }) => {
                                    printMessage(requestInfo, data, 'Вы успешно подтвердили отмену покупки товаров у фирмы!');
                                    pinCode.finish();
                                    historyTable.refreshData();
                                    updateProfileAndGoBack();
                                });
                        };
                        pinCode.show();
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId, { historyTable }) {
                        RestTemplate.delete(`/rest/profile/company/order/cancel?notificationId=${notificationId}`)
                            .then(({ requestInfo, data }) => {
                                printMessage(requestInfo, data, 'Вы успешно отклонили отмену покупки товаров у фирмы!');
                                historyTable.refreshData();
                            });
                    }
                }
            ]
        };
    },
    COMPANY_MEMBER: notification => {
        let companyMember = notification.companyMember;

        return {
            title: `Приглашение в фирму`,
            data: [
                <Text>Вам пришло приглашение на участие в фирме <Text style={{ fontWeight: '600' }}>{companyMember.company.name}</Text>.</Text>
            ],
            buttons: [
                {
                    text: 'Принять',
                    onPress(notificationId, { historyTable }) {
                        RestTemplate.post('/rest/profile/company/member/' + notificationId)
                            .then(({ requestInfo, data }) => {
                                printMessage(requestInfo, data, 'Вы успешно приняли приглашение в фирму!');
                                historyTable.refreshData();
                            });
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId, { historyTable }) {
                        RestTemplate.delete('/rest/profile/company/member/' + notificationId)
                            .then(({ requestInfo, data }) => {
                                printMessage(requestInfo, data, 'Вы успешно отклонили приглашение в фирму!');
                                historyTable.refreshData();
                            });
                    }
                }
            ]
        };
    },
    TRANSLATE_REQUEST: notification => {
        let translateRequest = notification.translateRequest;
        
        let dataArr = [
            <Text>
                Вам пришёл запрос на перевод&nbsp;
                <Text style={{ fontWeight: '600' }}>{translateRequest.price} грандиков</Text>
                &nbsp;от пользователя&nbsp;
                <Text style={{ fontWeight: '600' }}>{translateRequest.author.name} {translateRequest.author.surname}</Text>
            </Text>
        ];

        if (translateRequest.message) {
            dataArr.push(<Text style={{ color: 'grey' }}>{translateRequest.message}</Text>);
        }
        
        return {
            title: 'Запрос на перевод грандиков',
            data: dataArr,
            buttons: [
                {
                    text: 'Подтвердить',
                    onPress(notificationId, { pinCode, historyTable }) {
                        pinCode.callback = typedPinCode => {
                            RestTemplate.post(`/rest/profile/transaction/confirm/${notificationId}`, typedPinCode)
                                .then(({ data, requestInfo }) => {
                                    printMessage(requestInfo, data, 'Вы успешно подтвердили запрос на перевод денег!');
                                    pinCode.finish();
                                    historyTable.refreshData();
                                    updateProfileAndGoBack();
                                });
                        };
                        pinCode.show();
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId, { historyTable }) {
                        RestTemplate.post(`/rest/profile/transaction/decline/${notificationId}`)
                            .then(({ data, requestInfo }) => {
                                printMessage(requestInfo, data, 'Вы успешно отклонили запрос на перевод денег!');
                                historyTable.refreshData();
                            });
                    }
                }
            ]
        };
    }
};