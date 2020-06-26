import React, { useEffect, useRef, useCallback, useState } from "react";
import { useField } from "@unform/core";
import styled from "styled-components";

const StyledInput = styled.input`
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

function ImageInput({ name, label, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [preview, setPreview] = useState(defaultValue);

  const handlePreview = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
    }
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "files[0]",
      clearValue(ref) {
        ref.value = "";
        setPreview(null);
      },
      setValue(_, value) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <StyledDiv>
      {preview && <img src={preview} alt="Preview" width={250} />}
      <br />
      <label htmlFor={name}>{label}:</label>
      <StyledInput
        ref={inputRef}
        type="file"
        onChange={handlePreview}
        {...rest}
        accept="image/*"
      />
      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </StyledDiv>
  );
}

export default ImageInput;
