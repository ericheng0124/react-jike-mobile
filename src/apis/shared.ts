// 1. 定义泛型
type ResType<T> = {
  message: string,
  data: T
}

export default ResType