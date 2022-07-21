import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd'
import moment from 'moment'
import axios from 'axios'
import {
  HeartTwoTone
} from '@ant-design/icons'

export default function Detail(props) {
  const [newsInfo, setnewsInfo] = useState(null)
  useEffect(() => {
    // console.log(props.match.params.id);
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      setnewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then(res => {
      axios.patch(`/news/${props.match.params.id}?_expand=category&_expand=role`, {
        view: res.view + 1
      })
    })
  }, [props.match.params.id])

  const handleStar = () => {
    setnewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    axios.patch(`/news/${props.match.params.id}?_expand=category&_expand=role`, {
      star: newsInfo.star + 1
    })
  }
  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader

            onBack={() => window.history.back()}
            title={newsInfo.label}
            subTitle={
              <div>
                {newsInfo.category.title}
                <HeartTwoTone twoToneColor="#eb2f96" style={{ margin: '5px 0 0 10px' }}
                  onClick={() => handleStar()} />
              </div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:MM:ss") : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="区域" >
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">
                {0}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <div dangerouslySetInnerHTML={{
            __html: newsInfo.content
          }} style={{
            border: "1px solid gray",
            margin: '0 24px'
          }}>
          </div>
        </div>
      }
    </div>
  )
}
