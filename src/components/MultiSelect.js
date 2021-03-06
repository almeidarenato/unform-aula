import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import Select from "react-select";
import styled from "styled-components";
// import { Container } from './styles';
const StyledSelect = styled(Select)`
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

function MultiSelect({ name, label, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
      clearValue(ref) {
        ref.state.value = "";
      },
      getValue: (ref) => {
        if (ref.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option) => option.value);
        }
        if (!ref.state.value) {
          return "";
        }
        return ref.state.value.value;
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <StyledDiv>
      <label htmlFor={name}>{label}:</label>
      <StyledSelect
        ref={inputRef}
        defaultValue={defaultValue}
        classNamePrefix="react-select"
        {...rest}
      />

      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </StyledDiv>
  );
}

export default MultiSelect;
