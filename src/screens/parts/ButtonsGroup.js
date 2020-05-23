import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export function ButtonsGroup(props) {
    return (
        <View style={style.buttonsGroup}>
            {props.children}
        </View>
    );
}

export function Button(props) {
    return (
        <View style={style.buttonParrentView}>
            <View style={style.buttonChildrenView}>
                <TouchableHighlight onPress={props.onPress} style={style.buttonIcon}>
                    <Icon name={props.icon} size={props.iconSize ? props.iconSize : 30} />
                </TouchableHighlight>
                <Text style={style.buttonText}>{props.title}</Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    buttonsGroup: {
        backgroundColor: '#d0d9d9',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: '100%',
        padding: 15,
        flexDirection: 'row'
    },

    buttonIcon: {
        padding: 5,
        backgroundColor: 'green',
        width: 45,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonParrentView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 5,
        marginRight: 15
    },

    buttonChildrenView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        textAlign: 'center',
        marginTop: 2,
        maxWidth: 100
    }
});