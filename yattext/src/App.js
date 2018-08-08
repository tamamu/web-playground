import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';
import Canvas from './atoms/Canvas'
import Rect from './atoms/Rect'
import Button from './atoms/Button'
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

const rawCommands = [
  {type: 'text', content: 'Hello, world!'},
  {type: 'text', content: 'テストです'},
  {type: 'text', content: '次へ進むにはクリックしてください'},
  {type: 'command', name: 'l', args: {}},
  {type: 'text', content: 'クリックされました'},
  {type: 'text', content: 'テキストレイヤーに指定した行数を超えると自動で改ページされます'},
  {type: 'text', content: 'クリックしてください'},
  {type: 'command', name: 'l', args: {}},
  {type: 'command', name: 'cm', args: {}},
  {type: 'text', content: '以上です'}
]

function stringToChars(str) {
  let chars = []
  for (let ch of str) {
    if (ch === '\n') {
      chars.push({isNewline: true})
    } else {
      chars.push({string: ch})
    }
  }
  return chars
}

function commandToAction(com) {
  switch (com.name) {
    case 'l':
      break;
    case 'cm':
      break;
  }
}

class App extends Component {
  constructor() {
    super()
    this.forwarding = false
    this.actions = [];
    for (let com of rawCommands) {
      switch (com.type) {
        case 'text':
          let content = com.content
          this.actions.push(TextAction.change(stringToChars(content)))
          for (let i = 0; i < content.length; i++) {
            this.actions.push(TextAction.forward())
          }
        case 'command':
          this.actions.push(commandToAction(com))
          break
        default:
          break
      }
    }
    console.log(this.actions)
  }
  changeText() {
    const _chars = [
      {string:'H', color: 'red'},
      {string:'e', color: 'orange'},
      {string:'l', color: 'yellow'},
      {string:'l', color: 'lightgreen'},
      {string:'o', color: 'green'},
      {string:',', color: 'lightblue'},
      {string:' '},
      {string:'w', color: 'blue'},
      {string:'o', color: 'purple'},
      {string:'r', color: 'black'},
      {string:'l', color: 'rgba(0,0,0,0.9)'},
      {string:'d', color: 'rgba(0,0,0,0.8)'},
      {string:'!', color: 'rgba(0,0,0,0.7)'},
      {isNewline:true},
      {string:'あ', color: 'rgba(0,0,0,0.6)'},
      {string:'い', color: 'rgba(0,0,0,0.5)'},
      {string:'ろ', color: 'rgba(0,0,0,0.4)'},
      {string:'あ', color: 'rgba(0,0,0,0.3)'}
    ]
    store.dispatch(TextAction.change(_chars));
  }
  toggleForwarding() {
    this.forwarding = !this.forwarding
    if (this.forwarding) this.forwardText.bind(this)()
  }
  pushed() {
    console.log("pushed Button component")
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
                <Button label="push me" x={120} y={180} width={200} height={64} onClick={this.pushed} />
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
