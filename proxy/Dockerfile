# FROM nginx:stable

# RUN rm /etc/nginx/conf.d/default.conf
# RUN rm /etc/nginx/nginx.conf

# COPY default.conf /etc/nginx/conf.d/
# COPY nginx.conf /etc/nginx/

# # COPY ./ssl/nginx-selfsigned.crt /etc/ssl/certs/
# # COPY ./ssl/nginx-selfsigned.key /etc/ssl/private/

FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/
COPY ca_bundle.crt /etc/ssl/certs/
COPY private.key /etc/ssl/private/
