import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InputItem = props => (
    <View style={style.itemView}>
        {typeof props.title === 'string' ? <Text>{props.title}</Text> : props.title}
        <View style={[style.itemInput, props.style ? props.style : {}]}>{props.children}</View>
    </View>
);

const style = StyleSheet.create({
    itemView: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        alignSelf: 'center'
    },

    itemInput: {
        width: '100%',
        height: 40,
        marginTop: 5
    }
})

export { InputItem };