# dockerfile
FROM nginx:1.21.1
RUN rm /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]