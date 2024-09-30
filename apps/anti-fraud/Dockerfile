# Start building app
FROM node:20 AS builder

# Create workspace
WORKDIR /usr/src/app

# Copy configuration
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build -- anti-fraud

# Create final image
FROM node:20-alpine

# Create directory
WORKDIR /usr/src/app

# Copy production files from builder image
COPY --from=builder /usr/src/app/dist/apps/anti-fraud ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Comands
CMD ["node", "dist/main"]