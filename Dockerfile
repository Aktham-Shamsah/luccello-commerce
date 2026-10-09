FROM node:22-bookworm-slim
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
RUN corepack enable
COPY . .
RUN corepack pnpm install --frozen-lockfile
ARG NEXT_PUBLIC_API_URL=/backend
ENV NEXT_PUBLIC_API_URL=¤{NEXT_PUBLIC_API_URL}
RUN corepack pnpm build
ENV NODE_ENV=production
EXPOSE 3000 3001 4000
