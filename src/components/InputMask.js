import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import ReactInputMask from "react-input-mask";
// import { Container } from './styles';

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
    <div>
      <label htmlFor={name}>{label}:</label>
      <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </div>
  );
}

export default InputMask;
