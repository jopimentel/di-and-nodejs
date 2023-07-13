FROM node:14-alpine as builder
RUN apk update
RUN apk add curl
# copy the package.json to install dependencies

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc .npmrc

# Install the dependencies and make the folder
RUN npm install

COPY . .
# Build the project and copy the files
RUN npm run build

FROM nginx:1.19.10-alpine
RUN apk add --update nodejs npm && apk add --update npm
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/
# Copy from the stahg 1
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/tools /usr/share/nginx/tools
COPY --from=builder /app/tools/setenv/docker-entrypoint.d/docker-entrypoint.sh /docker-entrypoint.d/docker-entrypoint-custom.sh

RUN chgrp -R 0 /usr/share/nginx && \
    chmod -R g=u /usr/share/nginx

RUN chgrp -R 0 /var/log/nginx && \
    chmod -R g=u /var/log/nginx
RUN chgrp -R 0 /var/cache/nginx && \
    chmod -R g=u /var/cache/nginx
RUN chgrp -R 0 /var/run && \
    chmod -R g=u /var/run
RUN chgrp -R 0 /etc/nginx/conf.d/ && \
    chmod -R g=u /etc/nginx/conf.d/

RUN chgrp -R 0 /docker-entrypoint.d/ && \
    chmod -R 777 /docker-entrypoint.d/

RUN chgrp -R 0 /usr/share/nginx/tools/ && \
    chmod -R 777 /usr/share/nginx/tools/

RUN chgrp -R 0 /usr/share/nginx/html/mono-internet-banking-frontend/assets/ && \
    chmod -R 777 /usr/share/nginx/html/mono-internet-banking-frontend/assets/
