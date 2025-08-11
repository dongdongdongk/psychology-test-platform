import { prisma } from '@/lib/prisma'
import { retryDbOperation } from '@/lib/db-retry'

export async function GET() {
  try {
    const baseUrl = 'https://play.roono.net'
    
    // 활성화된 테스트 목록 가져오기
    const tests = await retryDbOperation(() => 
      prisma.test.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
      })
    )

    // 현재 시간 ISO 형식으로
    const lastmod = new Date().toISOString()

    // 정적 페이지들
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/faq', priority: '0.7', changefreq: 'monthly' }
    ]

    // XML 사이트맵 생성
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${tests.map(test => `
  <url>
    <loc>${baseUrl}/tests/${test.id}</loc>
    <lastmod>${test.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/tests/${test.id}/quiz</loc>
    <lastmod>${test.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // 에러 시 기본 사이트맵 반환
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://play.roono.net</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    })
  }
}