## RODAR A API
- Entre na pasta api e rode um : `npm install`
- Copie os dados do arquivo `.env.example` para um `.env`
- Em seguida, suba o container do postgres com `docker-compose up -d`
- Rode um `npm run migrate` para criar as tabelas do banco de dados
- E por fim, um `npm run dev` para rodar a aplicação

## DECISÃO DE ARQUITETURA
- As decisões tomadas foram guiadas pelo conhecimento do desenvedor e pelo tamanho da api
- A arquitetura começou a ser desenhada para seguir a arquitetura limpa. Porém, ficou faltando qubrar em usecases e criar entidades.
- Foi escolhido o query builder knex para trazer mais abstração do que usando os drives nativos e não ter a complexidade de um orm

## LISTA DE BIBLIOTECAS USADAS
- bcryptjs, dotenv, express, jsonwebtoken, knex, pg, zod, jest, supertest, ts-node-dev, typescript.

## O QUE EU MELHORARIA SE TIVESSE MAIS TEMPO
- Criaria os usecases para separar a regra de negócio da controller.
- Criaria as entidades User e Student para poder fazer melhor uso da tipagem do typescript na hora de lidar com as entidades.
- Adicionaria lógica de filtros e paginação

## QUAIS REQUISITOS OBRIGATÓRIOS NÃO FORAM ENTREGUES?
- Acabei deixando o RA autogerável começando em 2025001