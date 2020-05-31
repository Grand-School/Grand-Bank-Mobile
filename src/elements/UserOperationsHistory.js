import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { HistoryTable } from './HistoryTable';
import { parseToTime } from '../Utils';
import RestTemplate from '../RestTemplate';
import DataStorage from '../DataStorage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';

export function UserOperationsHistory(props) {
    const [historyTable, setHistoryTable] = useState(null);
    DataStorage.put('updateHistoryList', () => historyTable.refreshData());

    const getCount = () => RestTemplate.get('/rest/profile/history/count');
    const getPage = (page, count) => RestTemplate.get(`/rest/profile/history?page=${page}&count=${count}`);
    const getDate = data => new Date(Date.parse(data.time));
    const parseToObject = data => {
        let filteredTemplatesArray = historyTableTemplate.filter(item => item.codeName === data.type);
        if (filteredTemplatesArray.length === 0) {
            return (
                <View style={{ marginBottom: 10, marginTop: 5, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 15 }}>
                    <Text style={{ textAlign: 'center' }}>Обновите приложение, что бы увидеть эту операцию!</Text>
                </View>
            )
        }

        let settings = filteredTemplatesArray[0];
        let date = new Date(Date.parse(data.time));
        let from = settings.from ? settings.from(data) : null;

        let message = settings.message(data);
        if (message === '') {
            message = null
        }

        return (
            <View style={{ marginBottom: 5 }}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                    <View style={{ borderRadius: 50, borderWidth: 1, padding: 5, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        {settings.icon(data)}
                    </View>
                    <View style={{ marginLeft: 5, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '600' }}>{settings.title(data)}</Text>
                        <Text style={{ color: 'grey' }}>{settings.showTime && parseToTime(date)}{from && settings.showTime ? ', ' + from : from}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', width: '100%', height: '100%', position: 'absolute' }}>
                        <Text style={{ fontWeight: '600', fontSize: 20, textAlign: 'right', marginRight: 5 }}>{settings.sign(data) + data.price}</Text>
                    </View>
                </View>
                {message && (
                    <View style={{ marginLeft: 45 }}>
                        <Text style={{ color: 'grey' }}>{message}</Text>
                    </View>
                )}
            </View>
        );
    };
    
    const callbacks = { getCount, getPage, getDate, parseToObject };
    return <HistoryTable title='История' {...callbacks} count={5} ref={el => setHistoryTable(el)} />;
}

const historyTableTemplate = [
    {
        codeName: 'SALARY',
        title: () => 'Зарплата',
        showTime: false,
        sign: () => '+',
        message: () => null,
        from: () => null,
        icon: () => <Icon name='money' size={24} />
    },
    {
        codeName: 'FINES',
        title: () => 'Штраф',
        showTime: true,
        sign: () => '-',
        message: operation => operation.message,
        from: operation => operation.from.name + ' ' + operation.from.surname,
        icon: () => <FeatherIcons name='minus' size={24} />
    },
    {
        codeName: 'AWARD',
        title: () => 'Премия',
        showTime: true,
        sign: () => '+',
        message: operation => operation.message,
        from: operation => operation.from.name + ' ' + operation.from.surname,
        icon: () => <FeatherIcons name='award' size={24} />
    },
    {
        codeName: 'PURCHASE',
        title: () => 'Покупка',
        showTime: true,
        sign: () => '-',
        message: () => null,
        icon: () => <Icon name='shopping-cart' size={24} />
    },
    {
        codeName: 'TRANSLATE',
        title: operation => operation.from.id === DataStorage.getByKey('user').id ? 'Перевод' : 'Получение',
        showTime: true,
        sign: operation => operation.from.id === DataStorage.getByKey('user').id ? '-' : '+',
        message: operation => operation.message,
        from: operation => operation.from.id === DataStorage.getByKey('user').id 
                ? operation.to.name + ' ' + operation.to.surname
                : operation.from.name + ' ' + operation.from.surname,
        icon: () => <Icon name='exchange' size={24} />
    },
    {
        codeName: 'COUPON',
        title: () => 'Купон',
        showTime: true,
        sign: () => '+',
        message: () => null,
        icon: () => <Icon name='ticket' size={24} />
    },
    {
        codeName: 'CARD_UPDATE',
        title: () => 'Покупка карты',
        showTime: true,
        sign: () => '-',
        message: () => null,
        icon: () => <Icon name='credit-card' size={24} />
    },
    {
        codeName: 'CARD_SERVICE',
        title: () => 'Обслуживание карты',
        showTime: false,
        sign: () => '-',
        message: () => null,
        icon: () => <Icon name='calendar' size={24} />
    },
    {
        codeName: 'CARD_COSTS',
        title: () => 'Минимальные расходы карты',
        showTime: false,
        sign: () => '-',
        message: () => null,
        icon: () => <Icon name='percent' size={24} />
    },
    {
        codeName: 'UPDATE_CARD_NUMBER',
        title: () => 'Изменение номера карты',
        showTime: true,
        sign: () => '-',
        message: () => null,
        icon: () => <MaterialCommunityIcons name='numeric' size={24} />
    },
    {
        codeName: 'BUY_LICENSE',
        title: () => 'Покупка лицензии',
        showTime: true,
        sign: () => '-',
        message: () => null,
        icon: () => <Icon name='drivers-license-o' size={24} />
    },
    {
        codeName: 'COMPANY_OPERATION_RECEIVE',
        title: () => 'Продажа товаров в фирме',
        showTime: true,
        sign: () => '+',
        message: () => null,
        from: operation => operation.to.name + ' ' + operation.to.surname,
        icon: () => <Icon name='dollar' size={24} />
    },
    {
        codeName: 'COMPANY_OPERATION',
        title: () => 'Покупка товаров в фирме',
        showTime: true,
        sign: () => '-',
        message: () => null,
        from: operation => operation.companyOperation.company.name,
        icon: () => <Icon name='shopping-cart' size={24} />
    }
];