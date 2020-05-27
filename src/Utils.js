import DataStorage from './DataStorage';

const getUserCard = user => findCard(user.cardType);

const findCard = codeName => DataStorage.getByKey('creditCardsInfo').filter(info => info.codeName === codeName)[0];

function parseErrorResponse() {

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

function updateProfileAndGoBack(navigation) {
    DataStorage.getByKey('handlers').updateUserProfile()
        .then(() => navigation.navigate('Главная'));
}

module.exports = {
    getUserCard, parseErrorResponse, findCard, updateProfileAndGoBack, userRoleAsString
};