import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

export function ButtonsGroup(props) {
    return (
        <View style={style.bittonsGroupParrent}>
            <View style={style.buttonGroupButton}></View>
            <View style={style.buttonsGroup}>
                {props.children}
            </View>
        </View>
    );
}

export function Button(props) {
    const IconElement = props.iconElement ? props.iconElement : Icon;
    return (
        <View style={style.buttonParrentView}>
            <View style={style.buttonChildrenView}>
                <TouchableOpacity onPress={props.onPress}>
                    <LinearGradient colors={props.colors} style={style.buttonIcon}>
                        <IconElement name={props.icon} size={props.iconSize ? props.iconSize : 40} />
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={style.buttonText}>{props.title}</Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    bittonsGroupParrent: {
        backgroundColor: '#d0d9d9',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },

    buttonsGroup: {
        padding: 15,
        paddingTop: 0,
        flexWrap: 'wrap', 
        flexDirection: 'row',
        justifyContent: 'center'
    },

    buttonGroupButton: {
        backgroundColor: 'white',
        height: 5,
        width: '40%',
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 15
    },

    buttonIcon: {
        padding: 5,
        width: 60,
        height: 60,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonParrentView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginRight: 15,
        width: 100,
        alignItems: 'center'
    },

    buttonChildrenView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        textAlign: 'center',
        marginTop: 2
    }
});