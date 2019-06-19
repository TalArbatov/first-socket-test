import React, {useState} from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
    position:absolute;
    width:100vw;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background: #171751;
`

const Login = props => {

    const[getNickname, setNickname] = useState('');

    const onType = text => {
        setNickname(text);
    }
    const onSubmit = () => {
        props.enter(getNickname)
    }

  return (
    <Wrapper>
      <input onChange={(e) => onType(e.target.value)} type="text" placeholder="Enter nickname..." />
      <button onClick={() => onSubmit()}>Enter</button>
    </Wrapper>
  );
};

export default Login;