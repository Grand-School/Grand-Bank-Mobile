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

function ignoreOperations() {
    let result = {};
    [...arguments].forEach(item => {
        result[item] = {
            show: () => false
        }
    });
    return result;
}