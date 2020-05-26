import DataStorage from './DataStorage';

const getUserCard = user => findCard(user.cardType);

const findCard = codeName => DataStorage.getByKey('creditCardsInfo').filter(info => info.codeName === codeName)[0];

function parseErrorResponse() {

}

function updateProfileAndGoBack(navigation) {
    DataStorage.getByKey('handlers').updateUserProfile()
        .then(() => navigation.navigate('Главная'));
}

module.exports = {
    getUserCard, parseErrorResponse, findCard, updateProfileAndGoBack
};