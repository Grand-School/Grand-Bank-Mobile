import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

export function ButtonsGroup(props) {
    return (
        <View style={[style.buttonsGroup, props.style]}>
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
                        <IconElement name={props.icon} size={props.iconSize ? props.iconSize : 30} />
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={style.buttonText}>{props.title}</Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    buttonsGroup: {
        padding: 15,
        paddingTop: 0,
        flexWrap: 'wrap', 
        flexDirection: 'row',
        justifyContent: 'center'
    },

    buttonIcon: {
        padding: 5,
        width: 45,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonParrentView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 15,
        width: '20%',
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