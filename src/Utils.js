const getUserCard = (user, creditCardsInfo) => creditCardsInfo.filter(info => info.codeName === user.cardType)[0];

function parseErrorResponse() {

}

module.exports = {
    getUserCard, parseErrorResponse
};