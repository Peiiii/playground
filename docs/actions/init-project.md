<!-- ai powered shell script generator -->
<!-- default-intereacting-language: 中文 -->

defineAction act-ref {
    name: 参考文档进行操作
    description: 参考文档进行操作
    template: {
        props: {
            docName: string
        },
        prompt: 参考文档 {docName} 进行操作
    }
}

// 添加项目模板文件
defineAction add-template {
    name: 添加项目模板文件
    description: 添加项目模板文件
    template: {
        props: {
            fileNames: string[]
        },
        prompt: 按照最佳实践和项目结构，添加项目模板文件 {fileNames}
    }
}

defineAction create-app {
    name: 创建子应用
    description: 询问用户应用名，并生成创建一个子应用的命令
    template: {
        props: {
            appName: string
        },
        script: {
            mkdir -p apps
            cd apps
            pnpm create vite [appName] --template react-ts
            pnpm install
            ai act-ref [docs/actions/config_vite.md]
        }
    }
}

defineAction create-package {
    name: 创建包
    description: 询问用户包名，并生成创建一个包的命令
    template: {
        props: {
            packageName: string
        },
        script: {
            mkdir -p packages
            cd packages
            ai generate add-template package.json, src, tsconfig.json
        }
    }
}

defineAction init-project {
    name: 初始化项目
    description: 初始化项目，包括创建项目目录，安装依赖，创建子应用等
    template: {
        props: {
            appName: string
        },
        script: {
            pnpm init
            ai create-app [appName]
            ai create-package shared
        }
    }
}


defineAction generate {
    name: 生成操作文档
    description: 根据用户输入的命令，告诉用户操作流程
    template: {
        props: {
            command: string
        },
        prompt: {
            解析 {command} 的流程，告诉用户详细的操作流程
            - 对于 ai 开头的命令，请进行递归式的 generate 操作
            - 如果涉及命令行操作，请给出详细的命令
            - 如果涉及文件修改，请给出修改的文件名和修改的内容；如果内容比较少，请直接给出修改后的整个文件的内容
        },
        reflection: {
             - 对于 ai 开头的命令，请进行递归式的 generate 操作
        }
    }
}