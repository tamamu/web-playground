import React from 'react';
import Canvas from './Canvas'

const renderRect = (ctx, props) => {
  const { width, height, color } = props
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

const RenderableRect = props => {
  return (
    <Canvas
      {...props}
      renderFunc={renderRect}>
    </Canvas>
  )
}

const Rect = RenderableRect

export default Rect
