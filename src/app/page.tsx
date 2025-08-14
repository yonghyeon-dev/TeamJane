import Link from "next/link"
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { 
  ArrowRight, 
  Users, 
  FolderOpen, 
  FileText, 
  BarChart3,
  Sparkles,
  Clock,
  Shield,
  Zap
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6 py-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                  ✨ 프리랜서를 위한 올인원 솔루션
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  흩어진 당신의 업무를
                  <span className="text-primary-600 block">하나로 엮다</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  프로젝트 관리부터 청구서 발행까지, 프리랜서의 모든 비즈니스 활동을 
                  <strong className="text-primary-600"> Weave</strong> 하나로 통합 관리하세요.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    무료로 시작하기
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    로그인
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>무료 14일 체험</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>즉시 설정</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>24/7 지원</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-white shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">오늘의 대시보드</h3>
                      <Badge variant="primary" className="bg-green-100 text-green-800">
                        실시간
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5 text-primary-600" />
                          <span className="text-sm text-gray-600">이번 달 수입</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">₩2,450,000</p>
                        <p className="text-xs text-green-600">+12.5% ↗</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">진행 중</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">7개</p>
                        <p className="text-xs text-blue-600">프로젝트</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">최근 활동</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">ABC 스타트업 - 견적서 승인됨</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">XYZ 회사 - 프로젝트 완료</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">DEF 기업 - 청구서 발송</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              프리랜서가 진짜 필요한 기능들
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 행정 업무는 우리가, 창의적인 작업은 당신이. 
              업무 시간을 70% 단축하고 수입을 30% 늘려보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <FolderOpen className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">프로젝트 관리</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  칸반 보드로 직관적인 프로젝트 상태 관리. 마감일과 진행률을 한눈에 확인하세요.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">클라이언트 관리</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  고객 정보부터 커뮤니케이션 히스토리까지. CRM으로 고객 관계를 체계적으로 관리하세요.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">스마트 문서</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI로 문서 초안 자동 생성. 견적서, 계약서, 청구서를 몇 분 만에 완성하세요.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">재무 분석</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  실시간 수익 분석과 세금 계산. 데이터 기반으로 비즈니스 성장을 계획하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-white">
              이미 많은 프리랜서들이 경험하고 있어요
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">70%</div>
              <div className="text-primary-100">행정 업무 시간 단축</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">30%</div>
              <div className="text-primary-100">평균 수입 증가</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="text-primary-100">사용자 만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                더 이상 번거로운 업무에 시간 낭비하지 마세요
              </h2>
              <p className="text-xl text-gray-300">
                지금 시작하면 14일 무료 체험과 함께 모든 기능을 경험할 수 있어요.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Sparkles className="mr-2 w-5 h-5" />
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-gray-900 border-gray-300 hover:bg-gray-100">
                  데모 보기
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-400">
              신용카드 필요 없음 • 언제든 취소 가능 • 데이터 완전 보호
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
