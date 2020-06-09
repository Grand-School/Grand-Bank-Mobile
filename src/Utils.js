import DataStorage from './DataStorage';
import { showMessage } from 'react-native-flash-message';

const ERROR_TYPES_TRANSLATE = {
    APP_ERROR: 'Ошибка приложения',
    DATA_NOT_FOUND: 'Не найденно',
    DATA_ERROR: 'Ошибка данных',
    VALIDATION_ERROR: 'Ошибка проверки данных',
    WRONG_REQUEST: 'Неверный запрос',
    TOO_MANY_BROWSER_NOTIFICATIONS: 'Добавленно cлишком много уведомлений браузера',
    INCORRECT_PIN_CODE: 'Неверный пин-код',
    PIN_CODE_UNSET: 'Пин-код не добавлен',
    TOO_MANY_PIN_CODE_INCORRECT_TRIES: 'Ошибка пин-кода'
};

const getUserCard = user => findCard(user.cardType);

const findCard = codeName => DataStorage.getByKey('creditCardsInfo').filter(info => info.codeName === codeName)[0];

function parseErrorResponse(data) {
    let details = '';
    if (data.details) {
        details += data.details.join(', ');
    }

    let fieldsInfo = '';
    if (data.fields) {
        for (let field in data.fields) {
            fieldsInfo += `${field} - ${data.fields[field].join(',')}\n`;
        }
    }
    let type = data.type ? `[${data.type}] ` : '';

    return `${type}${details}\n${fieldsInfo}`;
}

function parseToDayMonth(date, withWords = true) {
    const dateTimeFormat = new Intl.DateTimeFormat('ru', { month: 'short', day: '2-digit' }) 
    const [{ value: day },,{ value: month },] = dateTimeFormat.formatToParts(date);
    let result = `${day} ${month}`;

    if (withWords) {
        const today = parseToDayMonth(new Date(), false);
        if (result === today) {
            return 'Сегодня';
        }

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = parseToDayMonth(yesterdayDate, false);
        if (result === yesterday) {
            return 'Вчера';
        }
    }

    return result;
}

function parseToTime(date) {
    const dateTimeFormat = new Intl.DateTimeFormat('ru', { minute: '2-digit', hour: '2-digit' }) 
    const [{ value: hour },,{ value: minute },] = dateTimeFormat.formatToParts(date);
    return `${hour}:${minute}`;
}

function parseToDateTime(date) {
    const dateTimeFormat = new Intl.DateTimeFormat('ru', { minute: '2-digit', hour: '2-digit', month: '2-digit', day: '2-digit', year: 'numeric' });
    return dateTimeFormat.formatToParts(date).map(item => item.value).join('').replace(',', '');
}

function userRoleAsString(userRole) {
    switch(userRole) {
        case 'ROLE_ADMIN': return 'Администратор';
        case 'ROLE_RESPONSIBLE': return 'Ответсвенный';
        case 'ROLE_TEACHER': return 'Учитель';
        case 'ROLE_BARMEN': return 'Бармен';
        case 'ROLE_USER': return 'Пользователь';
        default: return userRole;
    }
}

function getTypeMessage(data) {
    return ERROR_TYPES_TRANSLATE[data.type] ? ERROR_TYPES_TRANSLATE[data.type] : 'Ошибка';
}

function updateProfileAndGoBack(navigation, updateHistory = true) {
    if (updateHistory) {
        DataStorage.getByKey('updateHistoryList')();
    }
    DataStorage.getByKey('handlers').updateUserProfile()
        .then(() => navigation && navigation.navigate('Главная'));
}

function printMessage(requestInfo, data, message) {
    showMessage({
        message: requestInfo.isOk ? 'Успех!' : getTypeMessage(data),
        description: requestInfo.isOk ? message : parseErrorResponse(data),
        type: requestInfo.isOk ? 'success' : 'danger'
    });
}

module.exports = {
    getUserCard, parseErrorResponse, findCard, updateProfileAndGoBack, userRoleAsString, parseToDayMonth, parseToTime, parseToDateTime, printMessage
};