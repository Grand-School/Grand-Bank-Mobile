import DataStorage from './DataStorage';

export const OperationInfo = {
    AWARD: {
        title: () => 'Премия',
        info: ({ price, from }) => `+${price} грандиков от ${from.name} ${from.surname}`,
        show: () => true
    },
    
    FINES: {
        title: () => 'Штраф',
        info: ({ price, from }) => `-${price} грандиков от ${from.name} ${from.surname}`,
        show: () => true
    },

    SALARY: {
        title: () => 'Премия',
        info: ({ price }) => `+${price} грандиков`,
        show: () => true
    },

    PURCHASE: {
        title: () => 'Покупка',
        info: ({ price }) => `Покупка товаров в баре за ${price} грандиков`,
        show: () => true
    },

    TRANSLATE: {
        title: () => 'Получение',
        info: ({ from, price }) => `Вы получили ${price} грандиков от ${from.name} ${from.surname}`,
        show: ({ from }) => from.id !== DataStorage.getByKey('user').id
    },

    CARD_SERVICE: {
        title: () => 'Обслуживание карты',
        info: ({ price }) => `Вы оплатили обслуживание карты за ${price} грандиков`,
        show: () => true
    },

    CARD_COSTS: {
        title: () => 'Минимальные расходы карты',
        info: ({ price }) => `Вы оплатили минимальные расходы карты за ${price} грандиков`,
        show: () => true
    },

    COMPANY_OPERATION_RECEIVE: {
        title: () => 'Продажа товаров',
        info: ({ price, to, companyOperation }) => `Ваша фирма ${companyOperation.company.name} продала товары пользователю ${to.name} ${to.surname} за ${price} грандиков`,
        show: () => true
    },

    ...ignoreOperations('COUPON', 'CARD_UPDATE', 'UPDATE_CARD_NUMBER', 'BUY_LICENSE', 'COMPANY_OPERATION')
};

export const NotificationsInfo = {
    COMPANY_OPERATION: {
        title: () => 'Новая операция',
        info: ({ companyOperation: { company } }) => `Вам пришла новая операция от фирмы "${company.name}".\nПодтвердите её на странице уведомлений.`
    },
    
    COMPANY_OPERATION_CANCEL: {
        title: () => 'Запрос на отмену операции',
        info: ({ cancelCompanyOperation: { companyOperation: { company } } }) => `Вам пришёл запрос на отмену операции от фирмы "${company.name}".\nПодтвердите его на странице уведомлений.`
    },
    
    COMPANY_MEMBER: {
        title: () => 'Приглашение в фирму',
        info: ({ companyMember: { company } }) => `Вам пришло приглащение в фирму "${company.name}".\nПодтвердите его на странице уведомлений.`
    },
    
    TRANSLATE_REQUEST: {
        title: () => 'Запрос на перевод',
        info: ({ translateRequest: { author, price } }) => `Вам пришёл запрос на перевод денег от пользователя ${author.name} ${author.surname} за ${price} грандиков.\nПодтвердите его на странице уведомлений.`
    }
};

function ignoreOperations() {
    let result = {};
    [...arguments].forEach(item => {
        result[item] = {
            show: () => false
        }
    });
    return result;
}