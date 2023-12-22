FROM node:18-alpine

WORKDIR /src/app
COPY . .
RUN npm ci --production
EXPOSE 7000
CMD ["npm", "run", "start"]