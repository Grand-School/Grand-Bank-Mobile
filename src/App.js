import React from 'react';
import { LoginPage } from './LoginPage';
import Pages from './MainPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorization: null
    };
  }

  render() {
      return this.state.authorization ? <Pages /> 
          : <LoginPage onData={authorization => this.setState({ authorization })} />;
  }
}

export default App;
