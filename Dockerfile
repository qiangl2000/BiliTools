FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY ./ .
# 国内构建
RUN npm config set registry https://registry.npm.taobao.org \
    && npm install \
# RUN npm install \
    && npm install -g typescript modclean 
RUN npm run build \
    && node tools/processConfig.js \
    && npm prune --production \
    && npm run modclean \
    && mkdir builddir \
    && mv -f config dist tools node_modules package.json builddir

FROM node:lts-alpine as runtime
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/builddir .
CMD ["npm", "run", "start:muilt"]
