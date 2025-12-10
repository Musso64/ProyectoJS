FROM node:18-alpine
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY tailwind.config.js ./

# Install ALL dependencies
RUN npm install

# Copy the rest
COPY . .

# Build Tailwind once initially
RUN npx tailwindcss -i ./src/input.css -o ./src/output.css

EXPOSE 3000

# Use the dev script from package.json
CMD ["npm", "run", "dev"]