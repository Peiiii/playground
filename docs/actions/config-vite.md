

## 配置 vite

### vite-tsconfig-paths

安装

```bash
pnpm add vite-tsconfig-paths -D
```

配置 vite.config.ts

```ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
``` 

配置 tsconfig.json  

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```