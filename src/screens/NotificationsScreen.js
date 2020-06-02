import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HistoryTable } from '../elements/HistoryTable';
import RestTemplate from '../RestTemplate';
import { parseToDateTime } from '../Utils';

export class NotificationsScreen extends React.Component {
    render() {
        const getCount = () => RestTemplate.get('/rest/profile/notifications/count');
        const getPage = (page, count) => RestTemplate.get(`/rest/profile/notifications?page=${page}&count=${count}`);
        const getDate = data => new Date(Date.parse(data.date));

        const callbacks = { getCount, getPage, getDate, parseToObject: parseDataToObject };
        return <HistoryTable {...callbacks} count={5} showDate={false} />
    }
}

function parseDataToObject(data) {
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
                    {printData.data.map(item => 
                        typeof item === 'string' ? <Text>{item}</Text> : item
                    )}
                </View>
                <Text style={{ color: 'gray' }}>{parseToDateTime(time)}</Text>
            </View>
            <View style={{ width: '80%', flexDirection: 'row', marginTop: 5 }}>
                {printData.buttons.map((item, index) => (
                    <TouchableOpacity style={[{ width: '40%', borderWidth: 1, padding: 5 }, (index !== printData.buttons.length && { marginRight: 5 })]}
                        onPress={() => item.onPress(data.id)}>
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
            data: [`Товары: ${itemsName}.`, `Сумма: ${price} грандиков.`],
            buttons: [
                {
                    text: 'Подтвердиь',
                    onPress(notificationId) {

                    }
                },
                {
                    text: 'Отменить',
                    onPress(notificationId) {
                        
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
            data: [`Товары: ${itemsName}.`, `Сумма: ${price} грандиков.`],
            buttons: [
                {
                    text: 'Отменить',
                    onPress(notificationId) {
                        
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId) {
                        
                    }
                }
            ]
        };
    },
    COMPANY_MEMBER: notification => {
        let companyMember = notification.companyMember;

        return {
            title: `Приглашение в фирму ${companyMember.company.name}`,
            data: [`Вам пришло приглашение на участие в фирме ${companyMember.company.name}.`],
            buttons: [
                {
                    text: 'Принять',
                    onPress(notificationId) {
                        
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId) {
                        
                    }
                }
            ]
        };
    },
    TRANSLATE_REQUEST: notification => {
        let translateRequest = notification.translateRequest;
        
        let dataArr = [`Вам пришёл запрос на перевод ${translateRequest.price} грандиков от пользователя ${translateRequest.author.name} ${translateRequest.author.surname}`];
        if (translateRequest.message) {
            dataArr.push(<Text style={{ color: 'grey' }}>{message}</Text>);
        }
        
        return {
            title: 'Запрос на перевод грандиков',
            data: dataArr,
            buttons: [
                {
                    text: 'Подтвердить',
                    onPress(notificationId) {
                        
                    }
                },
                {
                    text: 'Отклонить',
                    onPress(notificationId) {
                        
                    }
                }
            ]
        };
    }
};