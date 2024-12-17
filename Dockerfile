# Step 1: Use the official Node.js image to build the Vue.js app
FROM node:18 AS build

# Step 2: Set working directory and copy package.json
WORKDIR /app
COPY package*.json ./

# Step 3: Install dependencies
RUN npm install

# Step 4: Copy the rest of the frontend application files
COPY . .

# Step 5: Build the Vue.js application for production
RUN npm run build

# Step 6: Use Nginx to serve the built app
FROM nginx:alpine

# Step 7: Copy the built app to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 8: Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 8: Expose port 80
EXPOSE 80

# Step 9: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
