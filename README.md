# Unform

Biblioteca feita pela RocketSeat para criação e manipulação de dados de formulários de forma performática para o React e React-Native.
O unform expõe o hook `useField` permitindo a criação de qualquer input para ser criado dentro do unform.

Esse tutorial foi completamente baseado na documentação oficial do unform.

_Documentação oficial : [https://unform.dev/](https://unform.dev/)_

_Repositório do projeto: [https://github.com/Rocketseat/unform](https://github.com/Rocketseat/unform)_

**1- Instalação do Unform no React**

1.1 Criar o projeto react com o boiler template do react

```bash
create-react-app meu-projeto
```

ou com o template typescript

```bash
create-react-app meu-projeto  --template typescript
```

1.2- limpar os arquivos e referencias que não iremos utilizar:

- src/App.test.js
- src/index.css
- src/app.css
- src/logo.svg
- src/serviceWorker.js
- src/setupTests.js
- Limpar o conteúdo do return de dentro do App.js e as referencias ao app.css
- Limpar o serviceWorker e index.css de dentro do Index.js

  1.3 Instalar o unform no projeto

```bash
yarn add @unform/core @unform/web
```

para o typescript o unform já vem com as definições portanto não é necessário fazer importações extras para o unform

**2- Criando o componente `<Input/>`**

3.1 Criar na pasta src/components o arquivo Input.js

3.2 Importar {useEffect , useRef} do `react` e {useField} do `@unform/core`

3.3 Declarar o inputRef com o hook `useRef(null)`

3.4 Desestruturar o hook `useField(name)`{fieldName,defaultValue,registerField,error}

3.5 construir um `useEffect` para usar o `registerField`

3.6 construir o componente de input no retorno com os valores expostos pelo `useField(name)`

seu `Input.js` vai ficar assim :

```jsx
import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
// import { Container } from './styles';

function Input({ name, label, ...rest }) {
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
      <label htmlFor={name}>{label}</label>
      <input ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error && <span style={{ color: "#ff0000" }}>{error}</span>}
    </div>
  );
}
```

**3- Construção do formulário:**

3.1 -No `App.js`vamos utilizar o {Form} do `@unform/web`

3.2 - Para manipular o form precisamos de uma função que ocorre na ação de onSubmit

3.3 - importar o componente `Input.js`que criamos para poder construir nosso formulário

3.4 - Montar os componentes Input com as props name , type e label

3.5 - Se um componente precisar estar dentro de um objeto , é possivel usar o componente Scope com a props 'path'.

Seu `App.js` ficará da seguinte forma:

```jsx
import React from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import Input from "./components/Input";
function App() {
  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      Meu Formulário
      <Form onSubmit={handleSubmit}>
        <Input name="nome" type="text" label="Nome Completo" />
        <Input name="telefone" type="text" label="Telefone" />
        <Input name="email" type="email" label="E-mail" />
        <Input name="password" type="password" label="Senha" />
        <Scope path="endereco">
          <Input name="rua" type="text" label="Rua" />
          <Input name="numero" type="text" label="Número" />
        </Scope>
        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;
```

**4- Manipulando os dados do formulário de forma mais eficaz:**

Com o useRef é possível manipular de forma muito melhor os dados do formulário

Exemplo:

4**.1 - Inicializando o Form já com informações:**

4.1.1 - importar o `useEffect`, `useRef` a partir do React de dentro do seu App.js

4.1.2- Vamos utilizar o json server para criar uma api fake

Documentação do Json-server [https://github.com/typicode/json-server](https://github.com/typicode/json-server)

para instalar o json server globalmente (pode abrir um terminal a parte.

```bash
npm install -g json-server
```

Vamos utilizar o seguinte json para nosso teste `cadastro.json`:

```json
{
  "cadastros": [
    {
      "id": 1,
      "nome": "Renato Ameida",
      "endereco": {
        "rua": "Rua Prof Laercio Neves",
        "numero": 998
      },
      "email": "renatoam@gmail.com"
    }
  ]
}
```

para executar o json-server executar o comando de acordo com o caminho do seu json

```bash
json-server --watch cadastro.json
```

Isso irá criar uma api fake. No meu caso foi criado no endereço:

[http://localhost:3000](http://localhost:3000/)/cadastros

4.1.3 - Vamos criar um useRef para o formulario como formRef .

```jsx
const formRef = useRef(null);
```

4.1.4 - No formulário vincular o formRef criado como ref

```jsx
<Form ref={formRef} onSubmit={handleSubmit}>
```

4.1.4 - Utilizar o fetch de dentro do useEffect para chamar os dados da api que criamos

```jsx
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
```

Seu `App.js` ficará assim:

```jsx
import React, { useEffect, useRef } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import Input from "./components/Input";
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
  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Meu Formulário</h1>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="nome" type="text" label="Nome Completo" />
        <Input name="telefone" type="text" label="Telefone" />
        <Input name="email" type="email" label="E-mail" />
        <Input name="password" type="password" label="Senha" />
        <Scope path="endereco">
          <Input name="rua" type="text" label="Rua" />
          <Input name="numero" type="text" label="Número" />
        </Scope>
        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;
```

Também existe outra forma que é possível utilizar os dados iniciais. Porém dessa forma não é possível utilizar uma chamada via api . é com a prop `initialData` do componente `<Form>`.

Ex.:

```jsx
<Form initialData={{ email: "test@example.com" }}>
  <Input name="email" /> //o value do input será 'test@example.com'
</Form>
```

4.2 - Limpar os dados do Form\*\*

4.2.1 - Iremos criar um novo button para resetar os dados do formulário

4.2.2 - Esse button com a função onClick irá executar o `handleReset`

4.2.3 - através do formRef.current.reset(); conseguimos realizar a limpeza do form completo.

```jsx
const handleReset = (evt) => {
    evt.preventDefault();
    formRef.current.reset();
  };

return(
<Form ...>
	...
	<button onClick={handleReset}>Limpar</button>
</Form>
)
```

**5- Validação de Dados com Yup**

O Yup nos permite validar os dados antes de serem enviados em nosso formulário de forma bem simples.

5.1- Para usar o Yup basta instalar ele no nosso projeto com o código

```jsx
yarn add yup
```

e importar ele na nosso `App.js`

```jsx
import * as Yup from "yup";
```

5.2 - Iremos aplicar a validação em nosso handleSubmit que seria o responsável por enviar os dados depois do submit. Como o yup nos retorna uma promessa quando inicia a validação precisamos tornar nossa função assincrona.

5.3 - A validação do yup ficará em volta de um "try-catch" assim na ocorrência do erro podemos tomar uma ação com os nossos inputs que podem avisar o usuário

```jsx
const handleSubmit = async (data) => {
  try {
    console.log(data);
  } catch (error) {}
};
```

5.4 Para utilizar o Yup primeiro construimos um "schema" e validamos os campos que estamos utilizando através da prop "name".

```jsx
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
```

5.5 Depois de montar o schema é só chamar o método validate passando os dados que serão validados no nosso caso `data`

```jsx
await schema.validate(data, {
  abortEarly: false,
});
```

Ao ser identificado o erro ele cairá automaticamente em nosso `catch(error)` onde iremos informar para os Inputs quais erros foram capturados.
o `setErrors` permite informar um objeto com todos os erros de cada Input. mostrando pro usuário qual erro foi capturado.

```jsx
catch (error) {
      const validationErrors = {};

      if (error instanceof Yup.ValidationError) {
        error.inner.map((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
```

pra finalizar podemos colocar no nosso handleReset uma função para limpar os erros também.

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_11.47.51.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_11.47.51.png)

Ao clicar em enviar o sistema valida quais campos devem estar preenchidos.

nosso `App.js` ficou da seguinte forma:

```jsx
import React, { useEffect, useRef } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import Input from "./components/Input";
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
        <Input name="telefone" type="text" label="Telefone" />
        <Input name="email" type="email" label="E-mail" />
        <Input name="password" type="password" label="Senha" />
        <Scope path="endereco">
          <Input name="rua" type="text" label="Rua" />
          <Input name="numero" type="text" label="Número" />
        </Scope>
        <button type="submit">Enviar</button>
        <button onClick={handleReset}>Limpar</button>
      </Form>
    </div>
  );
}

export default App;
```

**6- Incluíndo Mascaras nos campos**

O pessoal por trás do Unform recomenda a utilização do componente `react-input-mask` como solução de mascaras.
Mascaras são úteis quando precisamos que o usuário informe os dados e determinado padrão.

Repositório : [https://github.com/sanniassin/react-input-mask](https://github.com/sanniassin/react-input-mask)

Ex.: CPF: 354.992.088-76 (para evitar que o usuário tenha dúvidas se realiza a colocação de pontos e traços deixamos uma mascara que complementa os pontos e traços automaticamente.

Vamos colocar uma máscara no nosso campo de telefone . para isso:

6.1- vamos instalar o react-input-mask no nosso projeto

```bash
yarn add react-input-mask@next
```

6.2 - Na nossa pasta src/components vamos criar um novo componente chamado InputMask.js

Porém ele basicamente vai conter o mesmo conteúdo do nosso component Input então vamos copiar e colar , fazendo apenas a troca do nome dele e da exportação para InputMask

6.3 - Agora vampos importar o ReactInputMask de dentro do nosso componente InputMask

```jsx
import ReactInputMask from "react-input-mask";
```

6.4 - Depois simplesmente vamos modificar a nossa tag `<input>` para `<ReactInputMask>` dessa forma:

```jsx
<ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest} />
```

6.5 -Agora vamos no nosso `App.js` importar o nosso novo component

```jsx
import InputMask from "./components/InputMask";
```

6.6 - Por fim vamos trocar o nosso Input do telefone por InputMask e colocar a mascara que desejamos.

No nosso caso mask = '(99)99999-9999'

```jsx
<InputMask name="telefone" type="text" label="Telefone" mask="(99)99999-9999" />
```

Agora o campo automaticamente mostra a máscara conforme digitamos os números do telefone.

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_18.09.22.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_18.09.22.png)

**7 - File Input**

O file input permite que o usuário faça o upload de um document ou imagem e até consiga pré visualizar.

7.1 Para isso vamos seguir a mesma linha do InputMask e copiar o nosso componente Input Original e criar um novo chamado FileInput

7.2 Vamos importar mais alguns items do 'react' :
useCallback,useState,ChangeEvent

7.3 Vamos criar um state para controlar o nosso preview :

```jsx
const [preview, setPreview] = useState(defaultValue);
```

7.4 - Agora precisamos criar uma função que vai pegar o arquivo de preview e mostrar pro usuário a handlePreview:

```jsx
const handlePreview = useCallback((evt) => {
  const image = evt.target.files[0];

  if (image === false) {
    setPreview(null);
  }
  const previewURL = URL.createObjectURL(image);
  setPreview(previewURL);
}, []);
```

7.5 No useEffect precisamos trocar o path para files[0]

```jsx
useEffect(() => {
  registerField({
    name: fieldName,
    ref: inputRef.current,
    path: "files[0]",
  });
}, [fieldName, registerField]);
```

7.6 Por fim precisamos mostrar a imagem em nosso componente no retorno e adicionar em nosso input a propriedade onChange para utilizar o handlePreview

```jsx
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
```

7.7 - Pronto agora basta chamar o nosso componente do `App.js` e teremos um upload de arquivos de imagem com preview.

```jsx
import ImageInput from "./components/ImageInput";

...

function App() {
...

	return (
	...
	<ImageInput name="avatar" label="Avatar" />

	)
}
```

Resultado:

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_17.56.12.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_17.56.12.png)

**8** - Outros componentes importantes para um formulário e podem ser usados muito bem com o Unform\*\*

**React** **Date Picker**

Seguindo a mesma linha do InputMask temos o ReactDatePicker que permite além da formatação da data a escolha da data em si de uma forma bastante interativa .

Documentação :[https://reactdatepicker.com/](https://reactdatepicker.com/)

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.07.58.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.07.58.png)

**React** **Select**

Aqui vai uma opção que substitui o <select> tradicional para a lista de opções pré determinadas. Ele vai um pouco mais além do select tradicional e nos permite inclusive colocar selects com multiplas opções .

Documentação: [https://react-select.com/home](https://react-select.com/home)

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.12.23.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.12.23.png)

![Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.13.39.png](Unform%20da466f768b7f42dd869c52f2f175552c/Screen_Shot_2020-06-24_at_14.13.39.png)

**Renato Almeida**

Linkedin: [https://www.linkedin.com/in/renato-mareque/](https://www.linkedin.com/in/renato-mareque/)
Github: [https://github.com/almeidarenato](https://github.com/almeidarenato)
