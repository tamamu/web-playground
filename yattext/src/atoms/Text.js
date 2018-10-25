import React from 'react';
import { connect } from 'react-redux';
import Canvas from './Canvas'
//import * as TextAction from '../actions/Text'

const mapStateToProps = store => {
  console.log(store)
  return {
    chars: store.text.chars,
    renderedIndex: store.text.renderedIndex,
    show: store.text.show
  }
}

/*
const mapDispatchToProps = dispatch => ({
  updateChars: chars => dispatch({ type: TextAction.change, chars }),
  forward: () => dispatch({ type: TextAction.forward }),
})
*/

const renderChar = (ctx, char, x, y) => {
  if (char.color) ctx.fillStyle = char.color
  ctx.fillText(char.string, x, y)
  return ctx.measureText(char.string).width
}

const renderText = (ctx, props) => {
  console.log("render text")
  const { width, height, chars, renderedIndex, show } = props
  console.log(chars)
  if (chars && show) {
    const fontSize = 24;
    ctx.font = '' + fontSize + 'px sans'
    ctx.textBaseline = "top"
    ctx.clearRect(0, 0, width, height)
    //ctx.fillStyle = 'black'
    //ctx.fillRect(0, 0, width, height)
    let x = 0, y = 0;
    /*
     * { string: String,
     *   isNewline: Bool
     * }
     */
    for (let i = 0; i < renderedIndex; i++) {
      if (chars[i].isNewline) {
        x = 0;
        y += fontSize;
        if (y > height) {
          console.error('テキストがレイヤーをはみ出しています。')
        }
      } else {
        x += renderChar(ctx, chars[i], x, y);
      }
    }
  }
}

export const Text = props => {
  const {width, height, chars, show} = props
  return (
    <Canvas
      {...props}
      width={width?width:100}
      height={height?height:24}
      renderFunc={renderText}
      chars={chars}
      show={show}>
    </Canvas>
  )
}

const RenderableFactory = Com => {
  return props => (
    <Com
      {...props}
      renderedIndex={props.renderedIndex}>
    </Com>
  )
}

export const RenderableText = connect(mapStateToProps)(RenderableFactory(Text))

/*
const RenderableText = props => {
  const {width, height} = props
  return (
    <Canvas
      {...props}
      width={width?width:100}
      height={height?height:24}
      renderFunc={renderText}
      chars={chars}>
    </Canvas>
  )
}
*/

//const Text = connect(mapStateToProps/*, mapDispatchToProps*/)(RenderableText)

