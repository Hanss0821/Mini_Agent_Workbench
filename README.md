# Mini Agent Workbench

React + TypeScript 与独立 Node.js 服务端的项目实践。协作边界见
[AGENTS.md](./AGENTS.md)、[ARCHITECTURE.md](./ARCHITECTURE.md) 和
[CODE_STANDARDS.md](./CODE_STANDARDS.md)。

## 环境与安装

- Node.js 20.19+ 或 22.12+；本次验证使用 20.20.2。
- pnpm 版本由根 `package.json` 固定为 12.21.0。
- 在仓库根目录执行 `pnpm install`，提交更新后的 `pnpm-lock.yaml`。
- workspace 仅允许 esbuild 执行依赖安装脚本，供开发和测试工具链使用。

## 根目录命令

| 命令 | 行为 |
| --- | --- |
| `pnpm dev` | 先构建 Contracts，再并行监听 Contracts、Server 和 Web |
| `pnpm dev:web` | 构建 Contracts，监听 Contracts 与 Web |
| `pnpm dev:server` | 构建 Contracts，监听 Contracts 与 Server |
| `pnpm build` | 按包依赖顺序构建；Contracts 完成后构建两个应用 |
| `pnpm typecheck` | 准备 Contracts 声明，检查三个包与根测试配置 |
| `pnpm lint` | 执行现有 Web ESLint；目前不代表 Server/Contracts 已配置 ESLint |
| `pnpm test` | 一次性执行三个 Vitest 测试项目 |
| `pnpm test:watch` | 启动 Vitest 监听 |
| `pnpm check` | 类型检查、现有 lint、测试；生产构建需另跑 `pnpm build` |

在根目录使用 `pnpm --filter @workbench/server start` 运行已构建的 Server。
各包都有 `dev`、`build`、`typecheck`、`test`、`test:watch` 脚本。
直接启动某个包前，需要先构建 Contracts；日常优先使用根目录的开发命令。

## 包与构建边界

```text
Web ────→ Contracts ←──── Server
```

- Web：Vite 负责浏览器打包；Tailwind 4 通过官方 Vite 插件和 CSS import 接入。
  模板中使用 `isolate` 工具类，作为可检查的接入示例。未重写原始模板页面。
- Contracts：源码在 `src`，通过 TypeScript 输出 `dist/*.js` 与 `*.d.ts`，
  包的 `exports` 指向构建产物。开发监听会更新产物。
- Server：开发使用 `tsx watch`，额外监听 Contracts 的 JS 产物；
  构建使用 TypeScript，生产入口使用 Node 运行 `dist/server.js`。
- 当前 Server 只输出骨架就绪信息，尚无 HTTP 监听、接口或模型接入；
  普通 `start` 输出提示后退出，开发 watch 保持等待修改。
- Contracts 暂时只导出空模块。后续按协议编写 Zod schema 并推导类型，
  本轮没有增加业务契约，也没有安装尚未使用的 Zod。

## TypeScript

三个包和根工具配置继承 `tsconfig.base.json`：开启 `strict`、
`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、
`noImplicitOverride`、未使用变量/参数检查等。

Web 使用 Bundler 模块解析；Server、Contracts 和 Node 配置文件使用 NodeNext。
相对 ESM 模块导入在 Server/Contracts 中使用 `.js` 扩展名，
避免构建成功但 Node 找不到文件。Contracts 的 `types: []`、纯 ES lib
避免默认引入浏览器或 Node 环境全局类型。

工作区级 TypeScript、Node 类型和 Vitest 集中在根开发依赖，
Web 插件和 Server 的 tsx 归各自成员管理。

## 测试起点

根 `vitest.config.ts` 定义 `web`、`server`、`contracts` 三个项目，
发现各包 `src` 下的 `*.test.ts` / `*.spec.ts`，Web 还支持 `.tsx` 后缀。
用 `import { expect, test } from 'vitest'` 显式导入测试 API。

当前三个项目都使用 Node 环境，适合纯函数、schema 和服务逻辑测试。
尚未配置 DOM 环境或 React 组件测试工具；需要交互测试时再引入。
Vitest 负责执行测试，不能代替 TypeScript 类型检查。
测试文件不进入 Server/Contracts 的生产构建。

目前没有业务测试，暂用 `passWithNoTests: true` 允许空套件执行成功。
这只说明测试入口可用，不代表业务已被测试；建立核心测试后移除此选项。
没有设置覆盖率门槛或增加演示性断言。

## 参考

- [Tailwind 的 Vite 接入](https://tailwindcss.com/docs/installation/using-vite)
- [TypeScript 配置](https://www.typescriptlang.org/tsconfig/)
- [Vitest 多项目配置](https://vitest.dev/guide/projects)
- [pnpm Workspace](https://pnpm.io/workspaces)
