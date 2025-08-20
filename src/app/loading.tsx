export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* 스피너 애니메이션 */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-900">로딩 중...</h2>
          <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  )
}