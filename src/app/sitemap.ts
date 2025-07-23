import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://play.roono.net',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://play.roono.net/about',
      lastModified: new Date(),
      changeFrequency: 'monthly', 
      priority: 0.8,
    },
    // 각 테스트 페이지들을 동적으로 추가할 수 있습니다
    // 현재는 기본 페이지들만 포함
  ]
}