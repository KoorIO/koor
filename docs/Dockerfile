FROM nginx:1.11-alpine
MAINTAINER Nguyen Sy Thanh Son

COPY ./site/ /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
