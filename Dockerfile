# base image
FROM node:18-alpine

# create app directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# copy the full source code
COPY . .

# build TypeScript project
RUN npm run build

# expose Fly.io internal port
EXPOSE 8080

# run the compiled app
CMD ["node", "dist/main"]