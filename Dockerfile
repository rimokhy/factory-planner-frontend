FROM node:20.11.1 as build

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

RUN yarn global add @angular/cli

COPY . .

RUN yarn ng build --configuration=production

FROM nginx:latest

#COPY nginx.conf /etc/nginx
COPY --from=build app/dist/factory-planner/browser/* /usr/share/nginx/html

EXPOSE 80
