import {ListRes, fetchListAPI} from '@/apis/list'
import {Image, List, InfiniteScroll} from 'antd-mobile'
import {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";

type Props = {
  channelId: string
}

const HomeList = (props: Props) => {
  const {channelId} = props
  // list control
  const [listRes, setListRes] = useState<ListRes>({
    results: [],
    pre_timestamp: '' + new Date().getTime(),
  })
  // 初始数据获取
  useEffect(() => {
    async function getList() {
      try {
        const res = await fetchListAPI({
          channel_id: channelId,
          timestamp: '' + new Date().getTime(),
        })
        setListRes(res.data.data)
      } catch (error) {
        throw new Error('fetch list error')
      }
    }
    getList()
  }, [channelId])

  // 加载更多
  const [hasMore, setHadMore] = useState(true)
  const loadMore = async () => {
    try {
      const res = await fetchListAPI({
        channel_id: channelId,
        timestamp: listRes.pre_timestamp,
      })
      // 没有数据立刻停止
      if (res.data.data.results.length === 0) {
        setHadMore(false)
      }
      setListRes({
        // 拼接新老列表数据
        results: [...listRes.results, ...res.data.data.results],
        // 重置时间参数 为下一次请求做准备
        pre_timestamp: res.data.data.pre_timestamp,
      })
    } catch (error) {
      throw new Error('load list error')
    }
  }

  const navigate = useNavigate()
  const goToDetail = (id: string) => {
    // 路由跳转
    navigate(`/detail?id=${id}`)
  }

  return (
    <>
      <List>
        {listRes.results.map((item) => (
          <List.Item
            onClick={() => goToDetail(item.art_id)}
            key={item.art_id}
            prefix={
              <Image
                src={item.cover.images?.[0]}
                style={{borderRadius: 20}}
                fit="cover"
                width={40}
                height={40}
              />
            }>
            {item.title}
          </List.Item>
        ))}
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
    </>
  )
}

export default HomeList