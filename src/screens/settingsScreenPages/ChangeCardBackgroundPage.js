import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-spinkit';
import { getUserCard, printMessage, updateProfileAndGoBack } from '../../Utils';
import DataStorage from '../../DataStorage';
import RestTemplate from '../../RestTemplate';

export default class ChangeCardBackgroundPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: null
        }

        this.loadImagesUrls();
        DataStorage.onDataChange('user', this.loadImagesUrls.bind(this));
    }
    
    loadImagesUrls() {
        let user = DataStorage.getByKey('user');
        let card = getUserCard(user);
        let url = RestTemplate.getUrl(card.style)
        let that = this;
        fetch(url)
            .then(response => response.json())
            .then(({ images }) => that.setState({ images }))
    }

    updateImage(index) {
        let that = this;
        RestTemplate.post(`/rest/profile/card/image/${index}`)
            .then(({ data, requestInfo }) => {
                printMessage(requestInfo, data, 'Вы успешно изменили фон карты!');
                if (requestInfo.isOk) {
                    updateProfileAndGoBack(that.props.navigation, false);
                }
            });
    }

    componentWillUnmount() {
        DataStorage.removeOnDataChange('user', this.loadImagesUrls)
    }

    render() {
        let currentCard = DataStorage.getByKey('user').cardImage;
        return (
            <ScrollView style={style.parrent}>
                <Text>Выберить фон карты</Text>

                <View style={style.view}>
                    {!this.state.images && <Spinner type='Wave' size={50} />}
                    {this.state.images && this.state.images.map(({ frontImage }, index) => (
                        <TouchableOpacity key={frontImage} onPress={() => this.updateImage(index)}>
                            <Image style={[style.image, index === currentCard ? style.currentCard : {}]} source={{ uri: RestTemplate.getUrl(frontImage) }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    parrent: {
        padding: 5
    },

    view: {
        alignItems: 'center'
    },

    image: {
        marginTop: 10,
        width: 1280 / 3.5,
        height: 960 / 3.5
    },

    currentCard: {
        borderWidth: 2,
        borderColor: '#00bc8c'
    }
});