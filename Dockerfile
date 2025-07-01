# Use a Node.js base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (use legacy-peer-deps if needed)
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the app port inside the container (3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
