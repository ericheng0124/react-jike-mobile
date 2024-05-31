# 极客园-移动端

## 1. 项目初始化

### 1.1 项目介绍

` 使用Vite + React + TS初始化创建项目的一个React+Antd-Mobile移动端项目`

### 1.2 初始化模板生成项目

使用vite初始化项目
参考vite官网,这里我们使用的是react-ts模板
输入命令

```
npm create vite@latest react-jike-mobile -- --template react-ts
```

完成项目初始化之后,依次安装项目依赖包,然后初始化运行

```
npm install
npm run dev
```

### 1.3 项目GIT绑定

正常启动项目之后,对项目目录进行初始化清理
删除掉不需要的文件,然后对项目进行一个git管理绑定

```
git init
git add .
git branch -M main
git remote add origin https://github.com/ericheng0124/react-jike-mobile.git
git push -u origin main
git checkout -b dev
git push origin dev
```

### 1.4 安装antd-mobile

```
npm install --save antd-mobile
```

### 1.5 配置基础路由

首先安装react-router-dom包

```
npm i react-router-dom
```

安装好包之后,根据项目需求创建好相关的页面文件结构

```
 |--rsc
 |---pages
 |-----Home
 |-----Detail
 |---router
```

创建出不同路径的基础页面

`pages/Home/index.tsx`

```tsx
const Home = () => {
  return (
    <div>
      this is Home
    </div>
  )
}

export default Home
```

`pages/Detail/index.tsx`

```tsx
const Detail = () => {
  return (
    <div>
      this is Detail
    </div>
  )
}

export default Detail
```

创建路由文件
router/index.tsx

```tsx
import {createBrowserRouter} from "react-router-dom"
import Home from "./index";
import Detail from "./index";

const router = createRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/detail',
    element: <Detail/>
  }
])
export {router}
```

使用`RouterProvider`组件将router传入到项目入口文件main.tsx中
rsc/main.tsx

```tsx
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./router";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
```

### 1.6 配置别名路径

#### 1.6.1 修改vite配置找到根目录下的`vite.config.ts`文件

```tsx
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### 1.6.2 这里需要导入path,但是因为是ts,需要导入一个@types/node的包

输入命令导入相关包

```
npm i @types/node -D
```

#### 1.6.3 这里还需要设置一下`tsconfig.json`文件中的`"compilerOptions"`选项,在里面添加下列规则

```
"baseUrl": ".",
  "paths": {
    "@/*": [
      "src/*"
    ]
  },
```

添加完之后再次引用时使用@就会出现联想提示!

### 1.7 axios安装

#### 1.7.1 axios基础封装

1. 安装axios到项目

```
npm i axios
```

2. 在utils中封装http模块,主要包括接口基础地址,超出时间,拦截器
   在src文件夹下创建一个utils目录,然后在创建一个http.ts文件

   src/utils/http.ts

```ts
// 封装axios

import axios from 'axios'

// 创建实例
const httpInstance = axios.create({
  // 基础地址
  baseURL: 'http://geek.itheima.net',
  // 超出时间
  timeout: 5000,
})

// 请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
httpInstance.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export {httpInstance}
```

3. 在utils中做统一导出
   rsc/utils/index.ts

```ts
// 模块中转导出文件

import {httpInstance} from "@/utils/http.ts";

export {
  httpInstance as http
}
```

#### 1.7.2 封装api模块-axios和ts的配合使用

1. 在主目录下创建apis目录
   rsc/apis,
   `axios提供了request的泛型方法,方便我们传入类型参数推导出接口返回值的类型`
   基本用法:

```ts
axios.request<Type>().then(res => {
  // res.data的类型为Type
  console.log(res.data)
})
```

说明:泛型参数Type类型决定了res.data的类型

使用步骤:

创建src/apis/shared.ts

1. 根据接口文档创建一个通用的泛型接口类型(多个接口返回值的结构是相似的)

```ts
// 1. 定义泛型
type ResType<T> = {
  message: string,
  data: T
}
```

创建src/apis/list.ts

2. 根据接口文档创建特有的接口数据类型(每个接口有自己特殊的数据格式)

```ts
// 定义具体接口类型
type ChannelItem = {
  id: number,
  name: string
}

type ChannelRes = {
  channels: ChannelItem[]
}
```

3. 组合1和2的类型,得到最终传给request泛型的参数类型

```ts
// 请求频道列表
export function fetchChannelAPI() {
  return http.request<ResType<ChannelRes>>({
    url: '/channels'
  })
}
```

可以在入口文件main.tsx中导入fetChannelAPI接口函数,测试结果

```ts
// 测试接口
import {fetchChannelAPI} from "./list";

fetchChannelAPI().then(res => {
  console.log(res.data)
})

```

## 2. 页面区域

### 2.1 Home页面
#### 2.1.1 Home的静态页面

根据antd-mobile的Tabs标签页文档完成静态页面结构
src/pages/Home/style.css基础样式

```css
.tabContainer {
    position: fixed;
    height: 50px;
    top: 0;
    width: 100%;
}

.listContainer {
    position: fixed;
    top: 50px;
    bottom: 0px;
    width: 100%;
}
```

完成Home页面基础静态结构

```
import './style.css'
import {Tabs} from "antd-mobile";

const Home = () => {
  return (
    <div className='tabContainer'>
      {/*  tab区域*/}
      <Tabs>
          <Tabs.Tab title='水果' key='fruits'>
            菠萝
          </Tabs.Tab>
          <Tabs.Tab title='蔬菜' key='vegetables'>
            西红柿
          </Tabs.Tab>
          <Tabs.Tab title='动物' key='animals'>
            蚂蚁
          </Tabs.Tab>
        </Tabs>      
    </div>
  )
}

export default Home
```

这里使用api调取获得channel数据,替换Tabs.Tab单个标签页

这里需要绑定一个状态需要设置状态数据的类型,我们可以引用之前list.ts设置的数据类型

```
import './style.css'
import {Tabs} from "antd-mobile"
import {ChannelItem} from '@/apis/list.ts'

const Home = () => {
  const [channels, setChannels] = useState<ChannelItem[]>([]) 
  return (
    <div className='tabContainer'>
      {/*  tab区域*/}
      <Tabs>
        <Tabs.Tab title='水果' key='fruits'>
          菠萝
        </Tabs.Tab>
      </Tabs>      
    </div>
  )
}

export default Home
```
这里我们调用之前设置的api来获取channels数据,获取到channels数据之后替换我们单个Tabs
```
import './style.css'
import {Tabs} from "antd-mobile";
import {useEffect, useState} from "react";
import {ChannelItem, fetchChannelAPI} from '@/apis/list.ts'

const Home = () => {
  const [channels, setChannels] = useState<ChannelItem[]>([])

  useEffect(() => {
    const getChannels = async () => {
      try {
        const res = await fetchChannelAPI()
        setChannels(res.data.data.channels)
      } catch (err) {
        throw new Error('fetch channel error!')
      }
    }
    getChannels()
  }, [])

  return (
    <div className='tabContainer'>
      {/*  tab区域*/}
      <Tabs>
        {channels.map(item => (
          <Tabs.Tab title={item.name} key={item.id}>
          {/* list组件 */}
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default Home
```

#### 2.1.2 Home模块 - 自定义hook函数优化
`场景: 当前状态数据的各种操作逻辑和组件渲染是写在一起的,可以使用自定义封装的方式让逻辑和渲染相分离`

实现步骤:
1. 把和Tabs相关的相应式数据状态以及操作数据的方法放到hook函数中

   创建hook函数,src/pages/Home/useTabs.ts,将之前组件中逻辑和状态相关的代码都封装到这个hook中
```
import {useEffect, useState} from "react";
import {ChannelItem, fetchChannelAPI} from "@/apis/list.ts";

function useTabs() {
  const [channels, setChannels] = useState<ChannelItem[]>([])

  useEffect(() => {
    const getChannels = async () => {
      try {
        const res = await fetchChannelAPI()
        setChannels(res.data.data.channels)
      } catch (err) {
        throw new Error('fetch channel error!')
      }
    }
    getChannels()
  }, [])
  return {
    channels
  }
}

export {useTabs}
```
2. 组件中调用hook函数,消费其返回的状态和方法

  清理掉页面中之前逻辑和状态相关的代码,页面只负责渲染,这样方便维护
```
import './style.css'
import {Tabs} from "antd-mobile";
import {useTabs} from "@/pages/Home/useTabs.ts";

const Home = () => {
  const {channels} = useTabs()

  return (
    <div className='tabContainer'>
      {/*  tab区域*/}
      <Tabs>
        {channels.map(item => (
          <Tabs.Tab title={item.name} key={item.id}>
            {/* list组件 */}
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default Home
```

#### 2.1.3 Home模块 - List组件实现
`实现步骤:`
1. 搭建基础结构,并获取基础数据
```
// 请求文章列表
type ListItem = {
  art_id: string
  title: string
  aut_id: string
  comm_count: number
  pubdate: string
  aut_name: string
  is_top: number,
  cover: [
    type: number,
    images: string[]
  ]
}

export type ListRes = {
  results: ListItem[]
  pre_timestamp: string
}

export type ReqParams = {
  channel_id: string
  timestamp: string
}
```
2. 为组件设计channelId参数,点击Tab时传入不同的参数
```
import {Image, List} from 'antd-mobile'
// mock数据
// import {users} from "@/pages/Home/HomeList/users.ts";
import {useEffect, useState} from "react";
import {fetchListAPI, ListRes} from "@/apis/list.ts";

type Props = {
  channelId: string
}

const HomeList = (props: Props) => {
  const {channelId} = props
  // 获取列表数据
  const [listRes, setListRes] = useState<ListRes>({
    results: [],
    pre_timestamp: '' + new Date().getTime()
  })

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await fetchListAPI({
          channel_id: channelId,
          timestamp: '' + new Date().getTime()
        })
        setListRes({
          results: res.data.data.results,
          pre_timestamp: res.data.data.pre_timestamp
        })
      } catch (err) {
        throw new Error('fetch list error!')
      }
    }
    getList()
  }, [channelId])

  return (
    <>
      <List>
        {listRes.results.map((item) => (
          <List.Item
            key={item.art_id}
            prefix={
              <Image
                src={item.cover.images?.[0]}
                style={{borderRadius: 20}}
                fit="cover"
                width={40}
                height={40}
              />
            }
            description={item.pubdate}
          >
            {item.title}
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default HomeList
```
3. 实现上拉加载功能

`交互要求: List列表在滑动到底部时,自动加载下一页表数据`

实现思路:
1. 滑动到底部触发加载下一页动作

       这里可以使用antd的<InfiniteScroll/>
2. 加载下一页数据

       pre_timestamp 接口参数
3. 把老数据和新数据做拼接处理

       [...oldList,...newList]
4. 停止监听边界值

       hasMore







