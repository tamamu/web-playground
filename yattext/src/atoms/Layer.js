import React from 'react';
import styled from 'styled-components';

const Clipping = styled.div`
  display: block;
  position: absolute;
  overflow: hidden;
  width: ${props => props.width ? props.width+"px" : "10px"};
  height: ${props => props.height ? props.height+"px" : "10px"};
  left: ${props => props.x ? props.x+"px" : 0};
  top: ${props => props.y ? props.y+"px" : 0};
  z-index: ${props => props.zIndex ? props.zIndex : 0};
  border: 1px solid black;
`

// All components are in a Layer
const Layer = props => {
  return (
    <Clipping {...props}>
    {props.children}
      {/*React.Children.map(props.children,
      child => React.cloneElement(child, { x: x, y: y }))*/}
    </Clipping>
  )
}

export default Layer
