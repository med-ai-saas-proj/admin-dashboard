FROM node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .

RUN --mount=type=cache,id=med-ai-saas-pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=admin-dashboard --prod /prod/admin-dashboard --legacy

# New Stage for Exporting
FROM scratch AS export-stage
COPY --from=builder /prod/admin-dashboard/dist /
