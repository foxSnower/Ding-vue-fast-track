# 指定我们的基础镜像是node，版本是v8.14.0"
FROM node:8.14.0-slim
# 镜像创建者
MAINTAINER hexuemei

# 编译的时候，复制当前目录所有文件到 镜像中 镜像的/dist目录下
ADD . /dist/

# 安装淘宝镜像/http-server
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g http-server
