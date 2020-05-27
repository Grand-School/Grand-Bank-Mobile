import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const DOT = '•';

export class PinCodeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = { pinCode: '' };

        this.onButton = this.onButton.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onRemoveLast = this.onRemoveLast.bind(this);
    }
    
    onButton(button) {
        let pinCode = this.state.pinCode;

        if (pinCode.length === 4) {
            return;
        }

        pinCode += button;
        this.setState({ pinCode });

        if (pinCode.length === 4) {
            this.props.onPinCode(pinCode);
        }
    }

    onClear() {
        this.setState({ pinCode: '' });
    }

    onRemoveLast() {
        let pinCode = this.state.pinCode;
        pinCode = pinCode.substring(0, pinCode.length - 1);
        this.setState({ pinCode });
    }

    render() {
        let pinCodeBox = this.state.pinCode.split('').map(item => DOT).join('');
        return (
            <Modal isVisible={this.props.isVisible} onBackdropPress={() => this.props.onCloseAsk()}>
                <View style={style.pinCodeView}>
                    <Text style={style.title}>Пожалуйста, введите ваш пин-код</Text>
                    <View style={style.box}>
                        <Text style={style.boxText}>{pinCodeBox}</Text>
                    </View>
                    <View style={style.buttonsGroup}>
                        <PinCodeNumButton num='1' onPress={this.onButton} />
                        <PinCodeNumButton num='2' onPress={this.onButton} />
                        <PinCodeNumButton num='3' onPress={this.onButton} />
                        <PinCodeNumButton num='4' onPress={this.onButton} />
                        <PinCodeNumButton num='5' onPress={this.onButton} />
                        <PinCodeNumButton num='6' onPress={this.onButton} />
                        <PinCodeNumButton num='7' onPress={this.onButton} />
                        <PinCodeNumButton num='8' onPress={this.onButton} />
                        <PinCodeNumButton num='9' onPress={this.onButton} />
                        <PinCodeButton text='clear' onPress={this.onClear} borderColor='#ff3c41' />
                        <PinCodeNumButton num='0' onPress={this.onButton} />
                        <PinCodeButton icon='backspace' onPress={this.onRemoveLast} borderColor='#ff3c41' />
                    </View>
                </View>
            </Modal>
        );
    }
}

const PinCodeNumButton = props => <PinCodeButton text={props.num} onPress={() => props.onPress(props.num)} borderColor='#506CE8' />;

class PinCodeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pressed: false };
    }

    render() {
        let children = this.props.text ? <Text style={style.buttonText}>{this.props.text}</Text>
            : <Icon name={this.props.icon} size={30} />
        let additionalStyle = this.state.pressed ? { borderWidth: 1, borderColor: this.props.borderColor, borderRadius: 50 } : {};
        return (
            <TouchableHighlight style={[style.button, additionalStyle]} onPress={this.props.onPress} underlayColor='transparent'
                    onHideUnderlay={() => this.setState({ pressed: false })} onShowUnderlay={() => this.setState({ pressed: true })}>
                {children}
            </TouchableHighlight>
        );
    }
}

const style = StyleSheet.create({
    pinCodeView: {
        height: 500,
        backgroundColor: 'rgb(237, 237, 237)',
        padding: 30
    },

    title: {
        color: '#6c757d',
        textAlign: 'center',
        fontSize: 16
    },

    box: {
        marginTop: 15,
        marginBottom: 15,
        borderColor: 'rgb(213, 213, 213)',
        borderWidth: 1,
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    boxText: {
        fontSize: 64
    },

    button: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 7,
        marginBottom: 7
    },

    buttonText: {
        color: '#6c757d',
        fontSize: 24
    },

    buttonsGroup: {
        flexWrap: 'wrap', 
        flexDirection: 'row'
    }
});