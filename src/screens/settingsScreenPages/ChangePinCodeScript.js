import React from 'react';
import { PinCodeModal } from '../../elements/PinCodeModal';
import { printMessage } from '../../Utils';
import RestTemplate from '../../RestTemplate';

export class ChangePinCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            state: 0,
            pinCodeInputs: {
                oldPinCode: '',
                newPinCode: '',
                confirmPinCode: ''
            }
        };

        this.start = this.start.bind(this);
        this.pinCodeCallback = this.pinCodeCallback.bind(this);
        this.updatePinCode = this.updatePinCode.bind(this);
    }

    start() {
        const that = this;
        RestTemplate.get('/rest/profile/pinCode/contains')
            .then(({ requestInfo, data }) => {
                console.log(data);
                if (requestInfo.isOk) {
                    that.setState({ isVisible: true, state: data ? 0 : 1, pinCodeInputs: {} }); 
                } else {
                    printMessage(requestInfo, data);
                }
            });
    }

    pinCodeCallback(pinCode) {
        switch (this.state.state) {
            case 0: // old pinCode
                this.state.pinCodeInputs.oldPinCode = pinCode;
                this.pinCodeModal.clear();
                this.setState({ state: 1 });
                break;

            case 1: // new pinCode
                this.state.pinCodeInputs.newPinCode = pinCode;
                this.pinCodeModal.clear();
                this.setState({ state: 2 });
                break;

            case 2: // confirm new pinCode
                this.state.pinCodeInputs.confirmPinCode = pinCode;
                this.updatePinCode();
                break;
        }
    }

    updatePinCode() {
        const that = this;
        RestTemplate.post('/rest/profile/pinCode', this.state.pinCodeInputs)
            .then(({ data, requestInfo }) => {
                that.setState({ isVisible: false });
                that.pinCodeModal.clear();
                printMessage(requestInfo, data, 'Вы успешно изменили пин-код!');
            });
    }

    render() {
        let title;
        switch (this.state.state) {
            case 0: title = 'Пожалуйста, введите старый пин-код'; break;
            case 1: title = 'Пожалуйста, введите новый пин-код'; break;
            case 2: title = 'Пожалуйста, подтвердите новый пин-код'; break;
        }

        return <PinCodeModal title={title} onPinCode={this.pinCodeCallback} ref={ref => this.pinCodeModal = ref}
                isVisible={this.state.isVisible} onCloseAsk={() => this.setState({ isVisible: false })} />
    }
}