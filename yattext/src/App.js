import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';
import Canvas from './atoms/Canvas'
import Rect from './atoms/Rect'
import Button from './atoms/Button'
import Graphic from './atoms/Graphic'
import Layer from './atoms/Layer'
import TextLayer from './containers/TextLayer'
import Stage from './atoms/Stage'
import Text from './atoms/Text'
import createFinalState from './store'
import * as TextAction from './actions/Text'
import * as ScriptAction from './actions/Script'
import logo from './logo.svg';
import tamamu from './image.jpg';
import './App.css';
import Parser from 'script-parser'

const store = createFinalState();

const timeout = ms => new Promise(r => setTimeout(r, ms))

const rawCommands = Parser.parse(`
*start
クリックでスタート[l][cm]
Hello, world![r]
テストです
次へ進むにはクリックしてください[l]
クリックされました[l]
テキストレイヤーに指定した行数を越えるとエラーメッセージ[cm]
クリックしてください[l][cm]
以上です
`);

console.log(rawCommands)

/*
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
*/

function stringToChars(str) {
  let chars = []
  for (let ch of str) {
    if (ch === '\n') {
      chars.push({isNewline: true})
    } else {
      chars.push({string: ch})
    }
  }
  chars.push({isNewline: true})
  return chars
}

function commandToAction(com) {
  switch (com.name) {
    case 'l':
      return ScriptAction.stop()
    case 'cm':
      return TextAction.clear()
    default:
      return null
  }
}

class App extends Component {
  constructor() {
    super()
    this.actions = [];
    this.actionIndex = 0;
    for (let com of rawCommands) {
      switch (com.type) {
        case 'text':
          let content = com.content
          this.actions.push(TextAction.push(stringToChars(content)))
          for (let i = 0; i <= content.length; i++) {
            this.actions.push(TextAction.forward())
          }
          break
        case 'command':
          let act = commandToAction(com)
          if (act) {
            this.actions.push(act)
          }
          break
        default:
          break
      }
    }
    console.log(this.actions)
    store.dispatch(ScriptAction.click())
    this.processAction.bind(this)()
  }
  async processAction() {
    const script = store.getState().script
    if (script.forwarding) {
      store.dispatch(this.actions[this.actionIndex])
      this.actionIndex += 1
    }
    await timeout(50)
    if (this.actionIndex < this.actions.length) {
      this.processAction()
    }
  }
  toggleForwarding() {
    const script = store.getState().script
    if (script.forwarding) {
      store.dispatch(ScriptAction.stop())
    } else {
      store.dispatch(ScriptAction.click())
    }
  }
  defaultClickAction(e) {
    console.log(e)
    store.dispatch(ScriptAction.click())
  }
  pushed(e) {
    console.log("pushed Button component")
    e.stopPropagation()
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div>
            <Stage width={640} height={480} onClick={this.defaultClickAction}>
              <Layer width={320} height={240} x={32} y={48}>
                <Rect color="red" x={12} y={120} width={60} height={60} />
                <Rect color="green" x={42} y={20} width={160} height={90} />
                <Graphic src={tamamu} x={0} y={0} width={100} height={100} />
                <Button label="push me" x={120} y={180} width={200} height={64} onClick={this.pushed} />
              </Layer>
              <TextLayer width={640} height={100} y={380} />
            </Stage>
          </div>
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
