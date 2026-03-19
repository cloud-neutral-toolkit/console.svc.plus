#!/bin/bash

cd /var/www/XControl/dashboard

## 1. 添加 NodeSource 仓库
#curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 2. 安装 Node.js 和 npm
sudo apt install -y nodejs

# 使用仓库声明的 Yarn 版本和 npm 官方 registry，避免落到全局 Yarn Classic 或 yarnpkg proxy。
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn install --immutable

# 构建项目
yarn build

# 启动 Next.js 生产服务器
yarn start
