import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import ReactInputMask from "react-input-mask";
import styled from "styled-components";
// import { Container } from './styles';

const StyledInput = styled(ReactInputMask)`
  padding: 0.5em;
  margin: 0.5em;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
function InputMask({ name, label, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <StyledDiv>
      <label htmlFor={name}>{label}:</label>
      <StyledInput ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </StyledDiv>
  );
}

export default InputMask;
