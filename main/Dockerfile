# Stage 1: Build Angular app
FROM node:18.17.1  as build

WORKDIR /app

COPY . /app

RUN npm install -g @angular/cli

RUN npm install

#RUN ng build --configuration=production

CMD ["ng", "serve", "--host", "0.0.0.0","--configuration=production"]
EXPOSE 4200

## Stage 2: Setup Nginx to serve Angular app
#
#FROM nginx:stable-alpine
#
#COPY --from=build /app/dist/garkclub-front /usr/share/nginx/html
#
#RUN rm /etc/nginx/conf.d/default.conf
#
#COPY nginx.conf /etc/nginx/conf.d/
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]
