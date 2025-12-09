# Use Node.js base image for Tailwind CLI
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY tailwind.config.js ./

# Install dependencies (Tailwind and any others)
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose port for live server (if using)
EXPOSE 3000

# Default command - change based on your needs
CMD ["npm", "run", "dev"]