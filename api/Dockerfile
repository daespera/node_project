FROM node:12.18.1
ENV HOME=/home
WORKDIR $HOME/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "server"]