import React from 'react';
import { LoginPage } from './LoginPage';
import { MainPage } from './MainPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorization: null
    };
  }

  render() {
      return this.state.authorization 
          ? <MainPage authorization={this.state.authorization} /> 
          : <LoginPage onData={authorization => this.setState({ authorization })} />;
  }
}

export default App;
