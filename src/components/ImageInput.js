import React, { useEffect, useRef, useCallback, useState } from "react";
import { useField } from "@unform/core";
// import { Container } from './styles';

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
    });
  }, [fieldName, registerField]);

  return (
    <div>
      {preview && <img src={preview} alt="Preview" width={250} />}
      <br />
      <label htmlFor={name}>{label}:</label>
      <input ref={inputRef} type="file" onChange={handlePreview} {...rest} />
      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </div>
  );
}

export default ImageInput;
