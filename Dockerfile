FROM node:21-alpine3.18 AS builder
# Add a work directory
ENV NODE_ENV production

WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install --production

# Copy app files
COPY . .
# Build the app
RUN yarn build

FROM caddy:2.4.5-alpine AS production
# Bundle static assets with caddy
COPY --from=builder /app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]