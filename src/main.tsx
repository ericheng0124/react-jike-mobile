import ReactDOM from 'react-dom/client'

import {RouterProvider} from "react-router-dom"
import {router} from "./router"

// 测试接口
import {fetchChannelAPI} from "@/apis/list.ts";
fetchChannelAPI().then(res=>{
  console.log(res.data)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
