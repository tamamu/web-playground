import React from 'react';
import { connect } from 'react-redux';
import Canvas from '../atoms/Canvas'
import Layer from '../atoms/Layer'
import { Text, RenderableText } from '../atoms/Text'

const mapStateToProps = store => ({
    chars: store.text.chars,
    renderedIndex: store.text.renderedIndex,
    show: store.text.show
})

/*
const mapDispatchToProps = dispatch => ({
  updateChars: chars => dispatch({ type: TextAction.change, chars }),
  forward: () => dispatch({ type: TextAction.forward }),
})
*/


const TextLayerBase = props => {
  return (
    <Layer {...props}>
      <RenderableText width={640} height={100} />
    </Layer>
  )
}

const TextLayer = connect(mapStateToProps)(TextLayerBase)

export default TextLayer
