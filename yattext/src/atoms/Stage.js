import styled from 'styled-components';

const Stage = styled.div`
  position: relative;
  overflow: hidden;
  width: ${props => props.width ? props.width+"px" : "800px"};
  height: ${props => props.height ? props.height+"px" : "600px"};
  border: 1px solid black;
`

export default Stage
