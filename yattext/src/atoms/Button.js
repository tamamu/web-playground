import React from 'react';
import styled from 'styled-components';
import Layer from './Layer';

const RenderableButton = styled.button`
  width: ${props => props.width ? props.width+"px" : "100%"};
  height: ${props => props.height ? props.height+"px" : "100%"};
`

const Button = props => {
  const { x, y, width, height, label, onClick } = props
  return (
    <Layer x={x} y={y} width={width} height={height}>
      <RenderableButton
        width={width}
        height={height}
        onClick={onClick}>
    {label}
      </RenderableButton>
    </Layer>
  )
}

export default Button
