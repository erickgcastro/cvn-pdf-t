FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm db:generate

RUN pnpm build

EXPOSE 5000

CMD ["sh", "-c", "pnpm db:push && node dist/main.js"]
