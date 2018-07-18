import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled, {css, keyframes} from 'styled-components'

const Root = styled.div`
  display: block;
  position: absolute;
`

const ContentArea = styled.div`
  position: absolute;
  display: block;
  width: 300px;
  height: 120px;
  background-color: lightgreen;
  font-family: monospace;
`

class InputPosition extends Component {
  constructor(props) {
    super(props)
    this.textarea = React.createRef()
  }
  render() {
    const css = {
      display: "absolute",
      width: 0,
      height: 0,
      opacity: 0,
      margin: 0,
      padding: 0,
      paddingX: -2,
    }
    const {value, compositionStart, compositionUpdate, compositionEnd, change, keydown} = this.props
    return (
      <textarea
        ref={this.textarea}
        value={value}
        style={css}
        onCompositionStart={compositionStart}
        onCompositionUpdate={compositionUpdate}
        onCompositionEnd={compositionEnd}
        onChange={change}
        onKeyDown={keydown}
      >
      </textarea>
    )
  }
}

const Line = styled.div`
  position: relative;
  display: inline-block;
  width: 300px;
  overflow-x: hidden;
  white-space: pre;
`

const Composition = styled.span`
  position: relative;
  width: 100%;
  font-family: monospace;
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
`

const CaretAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Caret = styled.span`
  position: absolute;
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0;
  padding: 0;
  visibility: ${props => props.visible ? "visible" : "hidden"};
  background-color: rgba(0, 0, 0, 0.9);
  animation: ${CaretAnimation} .7s linear infinite alternate;
`

const Trasparent = styled.span`
  position: relative;
  font-family: monospace;
  color: rgba(0,0,0,0);
`

const Monospace = styled.span`
  display: inline;
  font-family: monospace;
  white-space: pre;
`

const Pad = props => {
  return (
    <Trasparent>{props.content}</Trasparent>
  )
}

const Text = props => {
  return (
    <Monospace>{props.content}</Monospace>
  )
}

const LineContainer = styled.div`
  position: absolute;
`

class App extends Component {
  constructor() {
    super()
    this.inputPosition = React.createRef()
    this.state = {
      compositing: false,
      editValue: "",
      composition: "",
      content: [""],
      coordinate: {x: 0, y: 0},
      focused: false,
      selection: {x: 0, y: 0},
    }
  }
  focusInputPosition() {
    if (this.inputPosition.current) {
      console.log(this.inputPosition.current)
      this.setState({focused: true})
      this.inputPosition.current.textarea.current.focus()
    }
  }
  moveCaret() {
    const idx = this.state.coordinate.x
    let sel = window.getSelection()
    if (sel.rangeCount > 0) {
      let textNode = sel.focusNode
      sel.collapse(textNode, Math.min(textNode.length, idx))
    }
    console.log(this.state)
  }
  moveCaretLeft() {
    let x = Math.max(this.state.coordinate.x-1, 0)
    let coordinate = Object.assign(this.state.coordinate, {x})
    this.setState({coordinate})
    this.moveCaret()
  }
  moveCaretRight() {
    let y = this.state.coordinate.y
    let max = this.state.content[y].length
    let x = Math.min(this.state.coordinate.x+1, max)
    let coordinate = Object.assign(this.state.coordinate, {x})
    this.setState({coordinate})
    this.moveCaret()
  }
  insertText(str) {
    let count = this.state.coordinate.x
    let y = this.state.coordinate.y
    let content = this.state.content.concat()
    let line = content[y]
    let before = line.slice(0, count)
    let after = line.slice(count)
    let coordinate = Object.assign(this.state.coordinate, {x: this.state.coordinate.x+str.length})
    content[y] = before+str+after
    this.setState({content, coordinate})
  }
  deleteText() {
    let x = this.state.coordinate.x
    let y = this.state.coordinate.y
    let content = this.state.content
    let line = content[y]
    if (x >= 1) {
      let before = line.slice(0, x-1)
      let after = line.slice(x)
      let coordinate = Object.assign(this.state.coordinate, {x: x-1})
      content[y] = before+after
      this.setState({content, coordinate})
    }
  }
  breakLine() {
    let x = this.state.coordinate.x
    let y = this.state.coordinate.y
    let coordinate = Object.assign(this.state.coordinate, {x: 0, y: y+1})
    let content = this.state.content
    content.splice(y+1, 0, "")
    this.setState({content, coordinate})
  }
  handleKeyDown(e) {
    console.log(e.key)
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        return this.moveCaretLeft()
      case 'ArrowRight':
        e.preventDefault()
        return this.moveCaretRight()
      case 'Backspace':
        e.preventDefault()
        return this.deleteText()
      case 'Enter':
        e.preventDefault()
        return this.breakLine()
      default:
        /*
        if (e.key.length === 1) {
          this.insertText(e.key)
        }
        */
        return
    }
  }
  handleCompositionStart(e) {
    console.log(e.data)
    this.setState({compositing: true, composition: e.data})
  }
  handleCompositionUpdate(e) {
    console.log(e.data)
    this.setState({compositing: true, composition: e.data})
  }
  handleCompositionEnd(e) {
    console.log(e.data)
    this.setState({compositing: false, composition: ""})
    this.insertText(this.state.editValue)
    this.setState({editValue: ""})
  }
  handleChange(e) {
    let s = e.target.value
    if (this.state.compositing) {
      this.setState({editValue: s})
    } else {
      this.setState({editValue: ""})
      this.insertText(s)
    }
  }
  render() {
    let {content, coordinate, composition, focused, editValue} = this.state
    let onCaret = content[coordinate.y]
    let caretLeft = onCaret.slice(0, coordinate.x);
    let caretRight = onCaret.slice(coordinate.x);
    let caretUpper = content.slice(0, coordinate.y) || []
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Root>
          <ContentArea onClick={this.focusInputPosition.bind(this)}></ContentArea>
          <LineContainer>
          {caretUpper.map((s, i) => <Line key={i}><Text content={s} /></Line>)}
          <Line>
            <Text content={caretLeft} />
            <Composition>{composition}</Composition>
            <Caret visible={focused} coordinate={coordinate} />
            <InputPosition ref={this.inputPosition} value={editValue}
              compositionStart={this.handleCompositionStart.bind(this)}
              compositionUpdate={this.handleCompositionUpdate.bind(this)}
              compositionEnd={this.handleCompositionEnd.bind(this)}
              change={this.handleChange.bind(this)}
              keydown={this.handleKeyDown.bind(this)}
            >
            </InputPosition>
            <Text content={caretRight} />
          </Line>
          </LineContainer>
        </Root>
      </div>
    );
  }
}

export default App;
