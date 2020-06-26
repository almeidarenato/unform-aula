import React, { useEffect, useRef } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import Input from "./components/Input";
import InputMask from "./components/InputMask";
import ImageInput from "./components/ImageInput";
import Select from "./components/Select";
import MultiSelect from "./components/MultiSelect";
import * as Yup from "yup";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital@1&display=swap');
  body {
    font-family: 'Ubuntu', sans-serif;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledForm = styled(Form)`
  padding: 20px;
  width: 400px;
  border-radius: 11px 11px 11px 11px;
  -moz-border-radius: 11px 11px 11px 11px;
  -webkit-border-radius: 11px 11px 11px 11px;
  border: 2px dashed #919191;
`;
const StyledButton = styled.button`
  box-shadow: inset 0px 1px 0px 0px #ffffff;
  background: linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
  background-color: #ededed;
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  display: inline-block;
  cursor: pointer;
  color: #777777;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #ffffff;
  margin-left: 15px;
`;

function App() {
  const formRef = useRef(null);
  const optionsTec = [
    { value: "angular", label: "Angular" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "NodeJs" },
    { value: "php", label: "PHP" },
    { value: "laravel", label: "Laravel" },
    { value: "vuejs", label: "VueJs" },
  ];
  useEffect(() => {
    fetch("http://localhost:3001/cadastros/1")
      .then((response) => response.json())
      .then((cadastro) =>
        formRef.current.setData({
          nome: cadastro.nome,
          endereco: {
            rua: cadastro.endereco.rua,
            numero: cadastro.endereco.numero,
          },
          email: cadastro.email,
          sexo: cadastro.sexo,
          data_nascimento: cadastro.data_nascimento,
        })
      );
  }, []);
  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().required("o Campo Nome é obrigatório"),
        telefone: Yup.string().required("o campo telefone é obrigatório"),
        endereco: Yup.object().shape({
          rua: Yup.string().required("O campo Rua é obrigatória"),
        }),
        email: Yup.string()
          .email("Informe um email valido")
          .required("O campo e-mail é obrigatório"),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      console.log(data);
      formRef.current.setErrors({});
    } catch (error) {
      const validationErrors = {};

      if (error instanceof Yup.ValidationError) {
        error.inner.map((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  };
  const handleReset = (evt) => {
    evt.preventDefault();
    formRef.current.reset();
    formRef.current.setErrors({});
  };

  return (
    <StyledContainer>
      <GlobalStyle />
      <h1>Meu Formulário</h1>
      <StyledForm ref={formRef} onSubmit={handleSubmit}>
        <Input name="nome" type="text" label="Nome Completo" />
        <InputMask
          name="telefone"
          type="text"
          label="Telefone"
          mask="(99)99999-9999"
        />
        <Input name="email" type="email" label="E-mail" />
        <Input name="password" type="password" label="Senha" />
        <Scope path="endereco">
          <Input name="rua" type="text" label="Rua" />
          <Input name="numero" type="text" label="Número" />
        </Scope>
        <ImageInput name="avatar" label="Avatar" />
        <Select name="sexo" label="Sexo">
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
        </Select>
        <Input name="data_nascimento" type="date" label="Data de Nascimento" />
        <MultiSelect
          name="tecnologia"
          label="Tecnologia(s)"
          options={optionsTec}
          isMulti
        />
        <StyledButton type="submit">Enviar</StyledButton>
        <StyledButton onClick={handleReset}>Limpar</StyledButton>
      </StyledForm>
    </StyledContainer>
  );
}

export default App;
