# Use an official Node.js image as the base image
FROM node:latest

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 3000

# Command to start the Node.js application
CMD ["node", "server.js"]

