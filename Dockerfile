# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /home/app

# add `/home/app/node_modules/.bin` to $PATH
ENV PATH /home/app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm install

# add app
COPY . ./

EXPOSE 3000 9856

# start app
CMD ["npm", "start"]  