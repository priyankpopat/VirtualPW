# Use Node.js 16 Alpine (lightweight)
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port (Cloud Run uses $PORT env var)
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start server - listen on port from env or default 5000
CMD ["node", "server.js"]
