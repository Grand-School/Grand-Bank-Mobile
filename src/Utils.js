import DataStorage from './DataStorage';

const getUserCard = user => findCard(user.cardType);

const findCard = codeName => DataStorage.getByKey('creditCardsInfo').filter(info => info.codeName === codeName)[0];

function parseErrorResponse(data) {
    return data.error;
}

function parseToDayMonth(date) {
    const dateTimeFormat = new Intl.DateTimeFormat('ru', { month: 'short', day: '2-digit' }) 
    const [{ value: day },,{ value: month },] = dateTimeFormat.formatToParts(date);
    return `${day} ${month}`;
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

function updateProfileAndGoBack(navigation, updateHistory = true) {
    if (updateHistory) {
        DataStorage.getByKey('updateHistoryList')();
    }
    DataStorage.getByKey('handlers').updateUserProfile()
        .then(() => navigation && navigation.navigate('Главная'));
}

module.exports = {
    getUserCard, parseErrorResponse, findCard, updateProfileAndGoBack, userRoleAsString, parseToDayMonth, parseToTime, parseToDateTime
};