
> 请不要随意修改本文档

### 内容类型
component, service, hook, util, constant, type, interface, enum, context
- 主代码包括 component, service, hook
- 辅助代码
  - 常规辅助代码包括 util, constant, type, interface, enum
  - 组件特有辅助代码为 context
  - 类型代码包括 type, interface, enum

```typescript
define FILE_TYPE_COMPONENT_INDEX {
    name: 'index.tsx',
    description: '组件主文件，包括 component 和 context,',
}

define FILE_TYPE_SERVICE {
    name: '[name:kebab-case].service.ts',
    description: '服务文件，可包括 service 和 util, constant, type, interface, enum 等常规辅助代码',
}

define FILE_TYPE_TYPE {
    name: '[name:kebab-case].type.ts',
    description: '类型文件，用于定义类型, 包括 interface, type, enum 等类型代码',
}

define FILE_TYPE_HOOK {
    name: 'use-[name:kebab-case].ts',
    description: 'hook 文件，用于定义 hook。可包括 hook 和 util, constant, type, interface, enum 等常规辅助代码 和 context 组件特有辅助代码',
}

define FILE_TYPE_UTIL {
    name: '[name:kebab-case].util.ts',
    description: '工具函数文件，用于定义工具函数，包括 util, constant, type, interface, enum 等常规辅助代码',
}

const DIR_EXTENTABLE_CHILDREN = [
    DIR_TYPE_LIST_COMPONENTS,
    DIR_TYPE_LIST_SERVICES,
    DIR_TYPE_LIST_TYPES,
    DIR_TYPE_LIST_HOOKS,
    DIR_TYPE_LIST_UTILS,
    DIR_TYPE_LIST_CONSTANTS,
    "index.tsx",
    "README.md",
    '[name:kebab-case].*',
]

define DIR_TYPE_COMPONENT {
    name: '[name:kebab-case]',
    nameExamples: [
        'button',
        'login-form',
    ],
    children: [
        ...DIR_EXTENTABLE_CHILDREN,
    ]
}

define DIR_TYPE_PAGE {
    name: '[name:kebab-case]',
    children: [
        ...DIR_EXTENTABLE_CHILDREN,
        DIR_TYPE_LIST_PAGES,
    ]
}

define DIR_TYPE_LIST_COMPONENTS {
    name: 'components',
    children: [
        DIR_TYPE_COMPONENT,
    ]
}

define DIR_TYPE_LIST_PAGES {
    name: 'pages',
    children: [
        DIR_TYPE_PAGE,
    ]
}

define DIR_TYPE_LIST_SERVICES {
    name: 'services',
    children: [
        FILE_TYPE_SERVICE,
        FILE_TYPE_UTIL,
    ]
}

define DIR_TYPE_LIST_TYPES {
    name: 'types',
    children: [
        FILE_TYPE_TYPE,
    ]
}

define DIR_TYPE_LIST_HOOKS {
    name: 'hooks',
    children: [
        FILE_TYPE_HOOK,
    ]
}

define DIR_TYPE_LIST_UTILS {
    name: 'utils',
    children: [
        FILE_TYPE_UTIL,
    ]
}

define DIR_TYPE_LIST_CONSTANTS {
    name: 'constants',
    children: [
        FILE_TYPE_CONSTANT,
    ]
}
```

### 目录结构示例

整体monorepo目录结构定义
```
packages/
    [package-name]/
apps/
    [app-name]/
components.json
pnpm-workspace.yaml
postcss.config.ts
tailwind.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
README.md
```

```
src/
    components/
        button/
            utils.ts
            index.tsx
            README.md
        form/
            components/
                form-item/
                    index.tsx
            utils.ts
            index.tsx
            README.md
    pages/
        home/
            utils.ts
            index.tsx
            README.md
        login/
            components/
                login-form/
                    index.tsx
            utils/
                login.util.ts
                xxx.util.ts
            index.tsx
            README.md
    services/
        login.service.ts
    types/
        button.type.ts
        login.type.ts
    hooks/
        use-login.ts
        use-xxx.ts
    utils/
        login.util.ts
    index.tsx
    README.md
```
