# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for workspaces
RUN npm install

# Copy source code
COPY . .

# Build the client
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]