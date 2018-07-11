import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';
import createFinalState from './store'
import * as TextAction from './actions/Text'
import logo from './logo.svg';
import './App.css';

const store = createFinalState();

////// Rect
const RenderableRect = props => {
  const renderRect = ctx => {
    const { width, height, color } = props
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
  }
  return (
    <Renderable
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      renderFunc={renderRect}>
    </Renderable>
  )
}

const Rect = RenderableRect
//////

////// Text
const mapStateToProps = state => {
  return {
    text: state.text.text,
    renderedIndex: state.text.renderedIndex,
    show: state.text.show
  }
}

const RenderableText = props => {
  const renderText = ctx => {
    const { text, renderedIndex, show } = store.getState().text
    const renderingText = text.slice(0, renderedIndex)
    ctx.font = '24px sans'
    const tm = ctx.measureText(text)
    ctx.textBaseline = "top"
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, tm.width, 24)
    ctx.fillStyle = 'white'
    ctx.fillText(renderingText, 0, 0)
  }
  const {x, y, width, height} = props
  return (
    <Renderable
      x={x}
      y={y}
      width={width?width:100}
      height={height?height:24}
      renderFunc={renderText}>
    </Renderable>
  )
}

const Text = connect(mapStateToProps)(RenderableText)
//////

////// Primitive
// All components are Renderable
const Renderable = props => {
  return (
    <Canvas x={props.x}
            y={props.y}
            width={props.width}
            height={props.height}
            renderFunc={props.renderFunc}>
    </Canvas>
  )
}

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.renderFunc = props.renderFunc
    this.canvas = React.createRef()
    this.state = { ctx: null }
  }
  componentDidMount(prevProps) {
    if (this.canvas) {
      let ctx = this.canvas.current.getContext('2d');
      this.setState((prev, props) => {
        return {ctx: ctx}
      })
      this.renderFunc(ctx)
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("updated");
    this.renderFunc(this.state.ctx);
  }
  render() {
    const {x, y, width, height} = this.props
    return (
      <canvas
        ref={this.canvas}
        width={width?width+"px":"10px"}
        height={height?height+"px":"10px"}
        style={{position: "absolute",
                left: x?x+"px":0,
                top: y?y+"px":0}}>
      </canvas>
    )
  }
}

const Clipping = styled.div`
  display: block;
  position: absolute;
  overflow: hidden;
  width: ${props => props.width ? props.width+"px" : "10px"};
  height: ${props => props.height ? props.height+"px" : "10px"};
  left: ${props => props.x ? props.x+"px" : 0};
  top: ${props => props.y ? props.y+"px" : 0};
  border: 1px solid black;
`

// All components are in a Layer
const Layer = props => {
  const {x, y, width, height} = props
  return (
    <Clipping x={x} y={y} width={width} height={height}>
    {props.children}
      {/*React.Children.map(props.children,
      child => React.cloneElement(child, { x: x, y: y }))*/}
    </Clipping>
  )
}

// The root of App
const Stage = styled.div`
  position: relative;
  overflow: hidden;
  width: ${props => props.width ? props.width+"px" : "800px"};
  height: ${props => props.height ? props.height+"px" : "600px"};
  border: 1px solid black;
`
//////


const timeout = ms => new Promise(r => setTimeout(r, ms))

class App extends Component {
  constructor() {
    super()
    this.forwarding = false
  }
  changeText() {
    store.dispatch(TextAction.change("Hello world!"));
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

export default App;
