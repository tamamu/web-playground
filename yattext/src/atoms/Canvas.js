import React, { Component } from 'react';

export default class Canvas extends Component {
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
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.renderFunc(this.state.ctx, this.props);
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

