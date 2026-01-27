# Stage 1: Build the React Client
FROM node:20-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Node Server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy server source
COPY server/. .

# Copy built client assets from Stage 1
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
