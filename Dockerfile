# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

RUN npm install -g pnpm

# Copy dependencies files
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/.output ./.output

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]