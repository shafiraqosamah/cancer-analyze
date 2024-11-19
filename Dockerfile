# Use the official Node.js v22 image with a slim Debian base
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files into the working directory
COPY . .

RUN mkdir tmp

# Expose the desired port (if applicable, e.g., 3000)
EXPOSE 8080

# Specify the entry point to run main.js
ENTRYPOINT ["node", "main.mjs"]
