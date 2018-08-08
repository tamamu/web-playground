import React from 'react';
import Canvas from './Canvas'

const renderImage = (ctx, props) => {
  const { src } = props
  let img = new Image()
  img.src = src
  ctx.drawImage(img, 0, 0);
  console.log("rendered")
}

const RenderableImage = props => {
  const { src } = props
  return (
    <Canvas
      {...props}
      src={src}
      renderFunc={renderImage}
    ></Canvas>
  )
}

const Graphic = RenderableImage

export default Graphic
