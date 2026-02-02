'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { User } from '@/store/userStore'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUserStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 验证表单
      if (mode === 'register') {
        if (!formData.name.trim()) {
          throw new Error('请输入姓名')
        }
        if (formData.password.length < 6) {
          throw new Error('密码至少6位')
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次密码不一致')
        }
      }

      if (mode === 'login' && !formData.email.trim()) {
        throw new Error('请输入邮箱')
      }
      if (mode === 'login' && !formData.password) {
        throw new Error('请输入密码')
      }

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 创建用户（模拟）
      if (mode === 'login' || mode === 'register') {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: formData.email,
          name: mode === 'register' ? formData.name : '用户',
          subscription: 'free',
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        setUser(newUser)
        router.push('/')
      } else if (mode === 'reset') {
        alert(`密码重置链接已发送到：${formData.email}`)
        setMode('login')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode)
    setError('')
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* 关闭按钮 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'login' && '登录'}
            {mode === 'register' && '注册'}
            {mode === 'reset' && '重置密码'}
          </h2>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 注册：姓名 */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
                disabled={isLoading}
              />
            </div>
          )}

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 密码 */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="•••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* 注册：确认密码 */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="•••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                处理中...
              </>
            ) : (
              <>
                {mode === 'login' && '登录'}
                {mode === 'register' && '注册'}
                {mode === 'reset' && '发送重置邮件'}
              </>
            )}
          </button>
        </form>

        {/* 切换登录/注册 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            {mode === 'login' && (
              <>
                还没有账号？
                <button
                  onClick={() => handleModeChange('register')}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  立即注册
                </button>
              </>
            )}
            {mode === 'register' && (
              <>
                已有账号？
                <button
                  onClick={() => handleModeChange('login')}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  立即登录
                </button>
              </>
            )}
          </div>

          {/* 忘记密码 */}
          {mode !== 'reset' && (
            <div className="text-center mt-2">
              <button
                onClick={() => handleModeChange('reset')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                忘记密码？
              </button>
            </div>
          )}

          {/* 返回登录 */}
          {mode === 'reset' && (
            <div className="text-center mt-4">
              <button
                onClick={() => handleModeChange('login')}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                返回登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
