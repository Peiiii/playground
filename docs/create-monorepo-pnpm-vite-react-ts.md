> 请不要随意修改本文档

## 1. 创建项目

### 1.1 创建项目目录
假设当前已在项目根目录

### 1.2 初始化项目

```bash
pnpm init
```

创建基础目录结构，包括packages, apps, pnpm-workspace.yaml

```bash
mkdir packages
mkdir apps
echo "packages:
  - 'apps/*'
  - 'packages/*'" >> pnpm-workspace.yaml
```

### 创建子应用

```bash
pnpm create vite my-app -- --template react-ts
```

安装依赖

```bash
cd apps/my-app
pnpm install
```

### 创建子包

```bash
cd packages
mkdir my-package
cd my-package
```

添加package.json

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "license": "MIT"
}
```

