import DataStorage from './DataStorage';

const getUserCard = (user, creditCardsInfo) => findCard(user.cardType, creditCardsInfo);

const findCard = (codeName, creditCardsInfo) => creditCardsInfo.filter(info => info.codeName === codeName)[0];

function parseErrorResponse() {

}

function updateProfileAndGoBack(navigation) {
    DataStorage.getByKey('handlers').updateUserProfile()
        .then(() => navigation.navigate('Главная'));
}

module.exports = {
    getUserCard, parseErrorResponse, findCard, updateProfileAndGoBack
};