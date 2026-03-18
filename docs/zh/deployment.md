# 部署

## 生产基线

- 运行拓扑: `Caddy + Docker Compose`
- 目标主机: `47.120.61.35`
- 域名:
  - `cn.svc.plus`
  - `cn.onwalk.net`
- 前端独立发布流水线: `.github/workflows/service_release_frontend-deploy.yml`

## 运行方式

前端镜像在 GitHub Actions 中完成构建并推送到镜像仓库，目标主机只负责拉取镜像和启动容器，不在机器上本地构建。

当前方案尽量以静态模式运行：

- Caddy 直接服务 `/_next/static/*` 与 `public/` 里的静态资源。
- Next.js standalone 容器只承接动态页面、认证接口和代理接口。
- `knowledge/` 在 CI 阶段拉取，并在 Docker 打包时直接写入镜像。

这是针对当前单机弱 IO 环境的权衡。后续如果 `docs.svc.plus` 被拆成独立 API 服务，需要同步调整这里和 `docs/usage/deployment.md` 的镜像内容与路由职责。

## 相关文档

- `usage/deployment.md`
- `governance/release-process.md`
- `development/dev-setup.md`
