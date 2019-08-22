FROM node:10.15

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb# https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-unstable

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

COPY . /app/
WORKDIR /app

RUN npm install
RUN npm install puppeteer

ENV DB_HOST=mongodb+srv://BryanEnid:PptstCore15@cluster0-cia4k.mongodb.net
ENV DB_NAME=doorflash
ENV DD_USER=apptestbt@gmail.com
ENV DD_PSWD=PptstCore15

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD npm start


# docker build -t bryanenid/doorflash-api . (DONT FORGET THE DOT)

#      TESTING
# docker run -it -p 3000:3000 bryanenid/doorflash-api (add 'sh' for the shell)
# docker ps -a
# docker pause 5e93e617f050

# docker login
# docker push bryanenid/doorflash-api

###############################
# docker system prune -a

# Kill all running containers
# docker kill $(docker ps -a -q)

# Delete all stopped containers (including data-only containers)
# docker rm $(docker ps -a -q)

# Delete all 'untagged/dangling' (<none>) images
# docker rmi $(docker images -q -f dangling=true)

# Delete ALL images
# docker rmi $(docker images -q)