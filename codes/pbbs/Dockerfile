FROM node:16.3.0-buster-slim

# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable libxss1 \
    --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN groupadd -r q41 \
  && useradd -r -g q41 -G audio,video q41 \
  && mkdir -p /home/q41/Downloads \
  && chown -R q41:q41 /home/q41

COPY package*.json ./
RUN npm install \
  && chown -R q41:q41 node_modules
COPY . .
RUN chown -R q41:q41 .

USER q41
ENV NODE_ENV=production
ENV FLAG=FLAG_dummydummydummyd

CMD ["npm", "start"]
