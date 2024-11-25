# cros_todolist_api

Bem-vindo ao repositório da API RESTful para gerenciamento de TodoLists! Este projeto foi desenvolvido como parte de uma avaliação técnica, implementando funcionalidades essenciais para o gerenciamento de tarefas.

---

## 📚 Funcionalidades Implementadas

1. **Cadastro de usuários**: Um usuário pode criar uma conta com `nome`, `email` e `senha`.
2. **Login de usuários e Registro de usuários (já logado)**: Autenticação JWT para proteger as rotas.
3. **Gerenciamento de tasks**:
   - Criar tasks.
   - Listar todas as tasks do usuário.
   - Editar uma task específica.
   - Deletar uma task específica.
   - Marcar e desmarcar uma task como concluída.
   - Filtrar tasks por status (`concluída` ou `não concluída`).
4. **Hierarquia de tasks**:
   - Uma task pode possuir subtasks.
   - Subtasks podem ter suas próprias subtasks recursivamente.

---

## 🛠️ Requisitos Técnicos

- **Tecnologias utilizadas**:
  - NestJS
  - PostgreSQL
  - Knex.js
  - Autenticação JWT
  - Insomnia para documentação das rotas

- **Validações**: Todos os inputs são validados para evitar inconsistências no banco de dados.

- **Extras**:
  - Organização dos arquivos seguindo princípios de **Clean Code**.
  - Respeito aos princípios **SOLID** na arquitetura do projeto.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão >= 16.x)
- Docker (opcional, caso prefira rodar o banco de dados em container)

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/MatheusDepolito/cros_todolist_ap.git
   cd cros_todolist_api

  - npm install

  - docker compose up -d

  - npm run migrations:all

  - npm run dev -w @cros_todolist/rest

🧪 Testes
  Foi desenvolvido um conjunto de testes para as funcionalidades de Tasks. Para rodá-los, basta executar o seguinte comando:

  - npm run tests

📄 Documentação das Rotas
  A documentação das rotas foi feita utilizando Insomnia, que está incluída no repositório. Embora o Swagger não tenha sido implementado devido a erros técnicos, o arquivo Insomnia contém todas as rotas detalhadas para facilitar os testes.

 - Arquivo Insomnia: ApiCrosToDoListInsomnia
 - Exemplo de JSON: Encontre exemplos no diretório ./json
📋 Observação Importante
  Este projeto foi desenvolvido e testado em um ambiente WSL (Windows Subsystem for Linux). Caso você esteja rodando o projeto em um ambiente Windows nativo, pode ser que alguns resultados apresentem erros relacionados ao ambiente,
  como no caso de caminhos de arquivos ou configurações específicas de banco de dados. Recomenda-se utilizar o WSL ou adaptar o ambiente conforme necessário para garantir que o funcionamento seja adequado.

Se houver qualquer dúvida ou dificuldade para rodar o projeto, entre em contato!

