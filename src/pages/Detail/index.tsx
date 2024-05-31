import {useEffect, useState} from "react";
import {DetailDataType, fetchDetailAPI} from "@/apis/detail.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {NavBar} from "antd-mobile";

const Detail = () => {
  // 获取路由参数
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  const [detail, setDetail] = useState<DetailDataType | null>(null)

  useEffect(() => {
    const getDetail = async () => {
      try {
        const res = await fetchDetailAPI(id!)
        setDetail(res.data.data)
      } catch (error) {
        throw new Error('fetch detail error!')
      }
    }
    getDetail()
  }, [id])

  const navigate = useNavigate()
  const back = ()=>{
    navigate(-1)
  }


  // 数据返回之前loading渲染占位
  if(!detail){
    return <div>this is loading...</div>
  }

  // 数据返回之后正式的渲染内容
  return (
    <div>
      <NavBar onBack={back}>{detail?.title}</NavBar>
      <div dangerouslySetInnerHTML={{
        __html:detail?.content
      }}></div>
    </div>
  )
}

export default Detail