# PD Hours Control

## 🛠️ Stack utilizada

**Backend:**

- .NET Core 10;
- PostgreSQL;
- Dapper como Micro-ORM e acesso ao banco de dados;
- FluentValidation para validação.

**Frontend:**

- Angular 21;
- Tailwind CSS;
- Feather Icons;

## 🏗️ Arquitetura

- API REST;
- Arquitetura limpa e separação de camadas e responsabilidades.

## ▶️ Como rodar o projeto

### ⚡ Quick start com Docker

Tendo o Docker instalado, na raiz do projeto rode o comando:

```bash
docker compose up -d --build
```
O docker compose fará o build dos containeres e cada projeto ficará disponível para teste:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:7282`
- PgAdmin: `http://localhost:5050`

> ‼️**IMPORTANTE:** para usar o PGAdmin, pode ser necessário fazer o login com usuário `admin@admin.com` e senha `admin`. Para se conectar ao banco, clique em **Add server** e preencha os seguintes dados: `Host => db; Username => pdadmin; Password: SecureP4ss!` Essas foram as credenciais criadas no `docker-compose`.
> É legal ter o PgAdmin para poder editar registros de Report direto no banco para mudar a data de criação e testar o filtro de data do endpoint `GET /squad/{id}` de detalhes de uma squad.


### 👨‍💻 Como desenvolvedor

Para rodar o ambiente de desenvolvimento, instale:

- Node.js e npm para o frontend;
- SDK do .NET Core 10 para o backend;
- Docker para o banco de dados.

Para rodar apenas o front, na pasta **HoursPlatform** rode `npm start`. A aplicação ficará disponível na porta 4200.

Para rodar apenas o backend, na pasta **Backend** rode `dotnet run`. A aplicação ficará disponível na porta 5234 para o perfil `http` e na porta 7282 para o perfil `https`.

Para rodar apenas o banco de dados, vai ser necessário ignorar os containers do back e do front. Rode na raiz do projeto o comando `docker compose up -d db pgadmin`. Mas provavelmente será necessário alterar a ConnectionString no projeto backend.

## 🗃️ Documentação das rotas

Para acessar as rotas disponíveis, com o projeto rodando, acesse o projeto backend na url `http://localhost:7282/scalar` para ter acesso à documentação no formato OpenAPI e testar requisições (similar ao Swagger).

## 💡 Considerações gerais

### Organização de pastas e projetos

- No backend, segui uma espécie de arquitetura limpa, porém sem separar cada camada em seu respectivo projeto. Tomei essa decisão para simplificar o desenvolvimento e gastar menos tempo ao reduzir complexidade desnecessária. Em um projeto real que evolui com o tempo, convém separar cada camada em seu projeto.
- No frontend segui o padrão geralmente adotado em projetos Angular pela comunidade, separando componentes, layout, páginas e serviços.

### Map de Requests e Responses

- Criei DTO de responses mesmo que, em sua maior parte, sejam iguais às entidades que representam. Não convém retornar diretamente a entidade, e no futuro se quiser omitir algo ou retornar algum campo em formato específico, já tem o DTO apropriado.

### Error handling

- Duas middlewares criadas: uma para erros de validação, retorna Bad Request 400; outra para capturar exceções desconhecidas, retorna Internal Server Error 500.

### Segurança

- Estou ciente de que colocar a Connection String do banco de dados no `appsettings.json` não é boa prática, mas foi o mais conveniente para uma solução local. Em ambiente de produção, é necessário fazer uso de variável de ambiente ou user secrets, provavelmente definidos num fluxo de CI/CD.

## ⚠️ Problemas conhecidos

- (Back) A data de criação de um registro de horas trabalhadas (Report) é salva no banco no formato UTC. Logo, ao obter os reports para um determinado período, há um bug caso o registro tenha sido feito das 21h às 0h, pois o horário de Brasília é GMT-3, logo há três horas de diferença com relação ao horário UTC. Devido ao tempo, optei por deixar passar, mas o correto é criar um helper para converter as datas para o horário do Brasil, ou criar um helper que identifique e converta a timezone automaticamente.
- (Back) O caso de uso de criação de Report não valida se já teve cadastro naquele dia para o usuário, algo que é crucial validar.

## Possíveis melhorias futuras

- [ ] (Front) Na modal de criação do Employee, tornar o campo de Squad dinâmico, seja listando todas as squads ou buscando pelo nome.
- [ ] (Front) Na modal de criação de Report, tornar o campo de Funcionário dinâmico com busca, em vez de digitar manualmente o ID.
- [ ] (Back) Adicionar cache para endpoints de leitura e cache evict para endpoints de escrita.

