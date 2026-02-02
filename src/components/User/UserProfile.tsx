'use client'

import { useState } from 'react'
import { useUserStore, User } from '@/store/userStore'
import { User, Settings, CreditCard, LogOut, Bell, Shield, Globe, Camera } from 'lucide-react'

export default function UserProfile() {
  const { user, updateProfile, logout } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  })
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSecurity, setShowSecurity] = useState(false)
  const [showBilling, setShowBilling] = useState(false)

  const handleSaveProfile = () => {
    if (user) {
      updateProfile({
        name: editData.name,
        avatar: editData.avatar,
      })
      setIsEditing(false)
      alert('资料已更新')
    }
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">请先登录</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">用户资料</h1>

      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* 头像 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <Camera size={14} />
                </button>
              )}
            </div>

            {/* 信息 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>

              {/* 订阅状态 */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                user.subscription === 'pro'
                  ? 'bg-purple-100 text-purple-700'
                  : user.subscription === 'basic'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              >
                <Shield size={14} />
                {user.subscription === 'pro' && '专业版'}
                {user.subscription === 'basic' && '基础版'}
                {user.subscription === 'free' && '免费版'}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          {!isEditing ? (
            <button
              onClick={() => {
                setEditData({ name: user.name, avatar: user.avatar || '' })
                setIsEditing(true)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
            >
              编辑资料
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm"
              >
                保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
              >
                取消
              </button>
            </div>
          )}
        </div>

        {/* 编辑表单 */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                头像URL
              </label>
              <input
                type="text"
                value={editData.avatar}
                onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        )}
      </div>

      {/* 账户设置 */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">账户设置</h3>

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">通知设置</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <button
          onClick={() => setShowSecurity(!showSecurity)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">安全设置</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <button
          onClick={() => setShowBilling(!showBilling)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">计费和订阅</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
      </div>

      {/* 通知设置 */}
      {showNotifications && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">产品更新通知</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:rounded-full after:after:absolute after:after:top-[2px] after:after:left-[2px] after:bg-white after:border-gray-300 peer-checked:bg-blue-600 after:checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">订阅到期提醒</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:rounded-full after:after:absolute after:after:top-[2px] after:after:left-[2px] after:bg-white after:border-gray-300 peer-checked:bg-blue-600 after:checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">营销邮件</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:rounded-full after:after:absolute after:after:top-[2px] after:after:left-[2px] after:bg-white after:border-gray-300 peer-checked:bg-blue-600 after:checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 安全设置 */}
      {showSecurity && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">安全设置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                修改密码
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="•••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认新密码
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="•••••••••"
              />
            </div>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm">
              更新密码
            </button>
          </div>
        </div>
      )}

      {/* 计费和订阅 */}
      {showBilling && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">计费和订阅</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">当前订阅</p>
                <p className="text-xs text-gray-500">{user.subscription === 'pro' ? '专业版' : user.subscription === 'basic' ? '基础版' : '免费版'}</p>
              </div>
              <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                管理订阅
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">支付方式</p>
                <p className="text-xs text-gray-500">**** **** **** 4242</p>
              </div>
              <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                更新
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
              <CreditCard size={16} />
              添加新的支付方式
            </button>
          </div>
        </div>
      )}

      {/* 退出登录 */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => {
            if (confirm('确定要退出登录吗？')) {
              logout()
              window.location.href = '/'
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </div>
  )
}
