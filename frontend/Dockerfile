FROM node:17-alpine

WORKDIR /app

#Copy the dependencies file
COPY ./package*.json ./

#Install dependencies
RUN npm install

# #Copy remaining files
COPY ./ ./

EXPOSE 80
#Default command
CMD npm start