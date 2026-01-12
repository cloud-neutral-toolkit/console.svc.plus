Search 相关链路：

- src/components/search/index.tsx 依赖 AskAIDialog，后端走 POST /api/rag/query → 失败则 POST /api/askai（见 src/components/AskAIDialog.tsx）。
- 这两个路由在本仓库是“转发型”API：src/app/api/rag/query/route.ts、src/app/api/askai/route.ts，最终指向 getInternalServerServiceBaseUrl()（src/server/serviceConfig.ts），默认是 runtime-service-config*.yaml 里的内部地址。
- 如果内部服务未部署或内部地址不可用，Search 会退化为报错/无结果，因此功能不完整。
