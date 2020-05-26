import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

export function ButtonsGroup(props) {
    return (
        <View style={style.buttonsGroup}>
            {props.children}
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
    buttonsGroup: {
        backgroundColor: '#d0d9d9',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: '100%',
        padding: 15,
        flexWrap: 'wrap', 
        flexDirection: 'row',
        justifyContent: 'center'
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