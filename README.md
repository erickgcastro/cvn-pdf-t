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

# Build da aplicação
npm run build

# Preparar banco de dados
npm run db:push

# Executar aplicação
npm start
```

## Acessar a Documentação da API

Após executar o projeto, acesse:

- **API**: http://localhost:5000/api
- **Documentação e playground**: http://localhost:5000/reference

## Sobre

### Por que PDFKit?

Escolhi o **PDFKit** porque:

- **Performance**: Geração rápida de PDFs
- **Controle Total**: Layout e formatação precisos
- **Leve**: Biblioteca pequena e eficiente
- **Flexibilidade**: Layouts complexos e personalizados
- **Estabilidade**: Biblioteca madura e bem mantida

## Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Fastify** - Framework web
- **PDFKit** - Geração de PDFs
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Zod** - Validação de schemas
- **Docker** - Containerização

## Endpoints

- `POST /generate-pdf` - Gerar PDF a partir de JSON
- `GET /generate-pdf/:id` - Gerar PDF a partir de ID
- `GET /reports` - Listar todos os relatórios
