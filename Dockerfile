FROM node:22-alpine
WORKDIR /app
COPY js/package.json ./
COPY js/bin ./bin
RUN chmod +x ./bin/tradytics-mcp.js
ENTRYPOINT ["node", "/app/bin/tradytics-mcp.js"]
