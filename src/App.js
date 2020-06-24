import React, { useEffect, useRef } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import Input from "./components/Input";
import InputMask from "./components/InputMask";
import ImageInput from "./components/ImageInput";
import * as Yup from "yup";

function App() {
  const formRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/cadastros/1")
      .then((response) => response.json())
      .then((cadastro) =>
        formRef.current.setData({
          nome: cadastro.nome,
          endereco: {
            rua: cadastro.endereco.rua,
            numero: cadastro.endereco.numero,
          },
          email: cadastro.email,
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
    <div>
      <h1>Meu Formulário</h1>
      <Form ref={formRef} onSubmit={handleSubmit}>
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
        <button type="submit">Enviar</button>
        <button onClick={handleReset}>Limpar</button>
      </Form>
    </div>
  );
}

export default App;
