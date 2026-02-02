import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* 错误数字 */}
        <div className="text-9xl font-bold text-blue-500 mb-4">404</div>

        {/* 错误信息 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          页面未找到
        </h1>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移动。
        </p>

        {/* 建议 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            您可以尝试：
          </h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li>检查 URL 是否正确</li>
            <li>返回首页重新开始</li>
            <li>使用导航菜单浏览</li>
          </ul>
        </div>

        {/* 返回首页按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Home size={20} />
          返回首页
        </Link>

        {/* 帮助信息 */}
        <p className="text-xs text-gray-500 mt-8">
          如果问题仍然存在，请联系我们的客服团队。
        </p>
      </div>
    </div>
  )
}
