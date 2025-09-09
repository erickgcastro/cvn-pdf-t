# API de Geração de PDF - Relatório de Veículos

API para gerar relatórios em PDF a partir de dados de veículos.

## Como Rodar o Projeto

### Opção 1: Docker (Recomendado)

```bash
# Build e executar
docker-compose up --build
```

### Opção 2: Manual

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Preparar banco de dados
npm run db:push

# Build da aplicação
npm run build

# Executar aplicação
npm start
```

## Acessar a Documentação da API

Após executar o projeto, acesse:

- **API**: http://localhost:5000/api
- **Documentação e playground**: http://localhost:5000/reference
