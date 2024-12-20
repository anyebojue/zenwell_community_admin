# zenwell_admin 后台管理系统 (基于 React18 + Rspack)

## 命令提示

- 进入项目
  cd ./zenwell_admin
- 安装依赖
  npm install (node -v 20.17.0)
- 运行
  npm run dev

## 项目结构

├── .husky
├── dist                        打包目录
├── node_modules                项目依赖
|
├── src                         源码目录
|   ├── api                     请求
|   ├── assets                  静态文件
|   ├── components              全局组件
|   ├── configs                 请求配置
|   ├── hooks                   全局hooks
|   ├── layouts                 侧边栏和顶部
|   ├── modules                 状态管理
|   ├── pages                   页面文件目录
|   |   └── index               index 页面目录
|   |       ├── index.ts        index 页面逻辑
|   |       └── index.css       index 页面样式
|   ├── routers                 路由配置
|   ├── styles                  全局样式
|   ├── theme                   主题配置
|   ├── types                   全局类型
|   ├── utils                   全局配置
│   └── main.tsx                入口文件
|
├── .gitignore
├── .prettierignore
├── .prettierrc
├── biome.json
├── eslint.config.mjs           ESLint 配置
├── commitlint.config.mjs       commintlint 规范
|
├── index.html
├── package-lock.json
├── package.json
├── README.md                   说明文档
├── rspack.config.ts            rspack配置
└── tsconfig.json
  
## commit规范

feat: 新特性，新功能
fix: 修改bug
docs: 文档修改
style: 代码格式修改，注意不是css修改
refactor: 代码重构
perf: 优化相关，比如提示性能，体验
test: 测试用例修改
chore: 其他修改，比如改变构建流程，或增加依赖库，工具等
revert: 回滚到上个版本
build: 编译相关的代码，例如发布版本，对项目构建或依赖的改动

如： git commit -m 'fix: xxx',英文冒号且冒号后面需要空一格
如果代码提交不了报错可以运行这个命令：git config --unset core.hooksPat

## 分支规范

- 主干分支 -- master
- 测试分支 -- develop
- 功能分支 -- dev
- 修复分支 -- hotfix
  master 分支只接受通过 Merge Request 合入功能分支。

为保证提交的记录干净整洁，其他分支合入之前需要先 rebase develop 分支。

分支命名规则：dev/功能名称

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
