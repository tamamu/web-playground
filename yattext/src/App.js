import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';
import Canvas from './atoms/Canvas'
import Rect from './atoms/Rect'
import Graphic from './atoms/Graphic'
import Layer from './atoms/Layer'
import Stage from './atoms/Stage'
import Text from './atoms/Text'
import createFinalState from './store'
import * as TextAction from './actions/Text'
import logo from './logo.svg';
import tamamu from './tamamu.png';
import './App.css';

const store = createFinalState();


const timeout = ms => new Promise(r => setTimeout(r, ms))

class App extends Component {
  constructor() {
    super()
    this.forwarding = false
  }
  changeText() {
    const _chars = [
      {string:'H'},
      {string:'e'},
      {string:'l'},
      {string:'l'},
      {string:'o'},
      {string:','},
      {string:' '},
      {string:'w'},
      {string:'o'},
      {string:'r'},
      {string:'l'},
      {string:'d'},
      {string:'!'},
      {isNewline:true},
      {string:'あ'},
      {string:'い'},
      {string:'ろ'},
      {string:'あ'}
    ]
    store.dispatch(TextAction.change(_chars));
  }
  toggleForwarding() {
    this.forwarding = !this.forwarding
    if (this.forwarding) this.forwardText.bind(this)()
  }
  async forwardText() {
    if (this.forwarding) {
      store.dispatch(TextAction.forward());
      await timeout(50)
      this.forwardText()
    }
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div>
            <Stage width={640} height={480}>
              <Layer width={320} height={240} x={32} y={48}>
                <Rect color="red" x={12} y={120} width={60} height={60} />
                <Rect color="green" x={42} y={20} width={160} height={90} />
                <Graphic src={tamamu} x={0} y={0} width={100} height={100} />
              </Layer>
              <Layer width={640} height={100} y={380}>
                <Text width={640} height={100} />
              </Layer>
            </Stage>
          </div>
          <button onClick={this.changeText}>Change Text</button>
          <button onClick={this.toggleForwarding.bind(this)}>Forward On/Off</button>
        </div>
      </Provider>
    );
  }
}

/*

<Stage
  width={screenWidth}
  height={screenHeight}
  >
  <Layer
    zIndex={1000}
    x={0}
    y={0}
    width={screenWidth}
    height={screenHeight}
    onClick={forwardEvent}
    />
  <Layer
    zIndex={100}
    x={0}
    y={screenHeight-textHeight}
    width={screenWidth}
    height={textHeight}
    >
    <Text ref={this.text} />
  </Layer>
  <Layer ref={this.mainLayer}
    zIndex={1}
    x={0}
    y={0}
    width={screenWidth}
    height={screenHeight}
    >
  </Layer>
  <Layer
    zIndex={2}
    >
    <Image ref={this.backgroundImage}
      x={0}
      y={0}
      width={screenWidth}
      height={screenHeight}
      />
  </Layer>
</Stage>
*/

export default App;
