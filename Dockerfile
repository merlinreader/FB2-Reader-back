FROM node:18-alpine

WORKDIR /src/app
COPY . .
RUN npm ci --production
CMD ["npm", "run", "start"]