FROM node:latest

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY ["package.json", "tsconfig.json", "src", "./"]

RUN npm install -g typescript --silent
RUN npm install --silent
RUN tsc -p .

EXPOSE 8000

CMD ["node", "dist/index.js"]