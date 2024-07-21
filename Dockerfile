# Stage 1: Build the TypeScript code
FROM node:20 AS builder

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the source files
COPY . .

# Build the TypeScript code
RUN sed -i "1 i\import 'module-alias/register'" /usr/src/app/src/index.ts
RUN npm run build

# Stage 2: Run the production server
FROM node:20-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy the build output and node_modules from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Start the server
CMD ["node", "dist/index.js"]
