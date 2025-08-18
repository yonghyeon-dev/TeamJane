'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  UserIcon, 
  BellIcon, 
  CreditCardIcon,
  ShieldIcon,
  PaletteIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SaveIcon
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  taxId: string;
  avatar?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  projectUpdates: boolean;
  paymentReminders: boolean;
  marketingEmails: boolean;
}

interface BillingInfo {
  plan: string;
  nextBilling: string;
  amount: number;
  paymentMethod: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'admin',
    email: 'admin@weave.com',
    phone: '010-0000-0000',
    company: 'WEAVE',
    address: '서울시 강남구 테헤란로 123',
    taxId: '123-45-67890'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    projectUpdates: true,
    paymentReminders: true,
    marketingEmails: false
  });

  const [billing] = useState<BillingInfo>({
    plan: 'Professional',
    nextBilling: '2024-02-15',
    amount: 29000,
    paymentMethod: '**** **** **** 1234'
  });

  const tabs = [
    { id: 'profile', label: '프로필', icon: UserIcon },
    { id: 'notifications', label: '알림', icon: BellIcon },
    { id: 'billing', label: '결제', icon: CreditCardIcon },
    { id: 'security', label: '보안', icon: ShieldIcon },
    { id: 'appearance', label: '테마', icon: PaletteIcon }
  ];

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationUpdate = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-gray-600 mt-2">
          계정 및 애플리케이션 설정을 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>프로필 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-gray-600" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      사진 변경
                    </Button>
                    <p className="text-sm text-gray-600 mt-1">
                      JPG, PNG 파일만 가능합니다. 최대 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">이름</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">전화번호</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      placeholder="전화번호를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">회사명</label>
                    <Input
                      value={profile.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                      placeholder="회사명을 입력하세요"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">주소</label>
                    <Input
                      value={profile.address}
                      onChange={(e) => handleProfileUpdate('address', e.target.value)}
                      placeholder="주소를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">사업자등록번호</label>
                    <Input
                      value={profile.taxId}
                      onChange={(e) => handleProfileUpdate('taxId', e.target.value)}
                      placeholder="사업자등록번호를 입력하세요"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <SaveIcon className="h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">이메일 알림</h4>
                      <p className="text-sm text-gray-600">
                        중요한 업데이트를 이메일로 받습니다
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">프로젝트 업데이트</h4>
                      <p className="text-sm text-gray-600">
                        프로젝트 상태 변경 알림을 받습니다
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.projectUpdates}
                      onChange={(e) => handleNotificationUpdate('projectUpdates', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">결제 알림</h4>
                      <p className="text-sm text-gray-600">
                        청구서 마감일 및 결제 관련 알림을 받습니다
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.paymentReminders}
                      onChange={(e) => handleNotificationUpdate('paymentReminders', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">마케팅 이메일</h4>
                      <p className="text-sm text-gray-600">
                        새로운 기능 및 팁에 대한 이메일을 받습니다
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={(e) => handleNotificationUpdate('marketingEmails', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <SaveIcon className="h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">현재 플랜</h4>
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{billing.plan}</h5>
                          <Badge className="bg-blue-100 text-blue-800">활성</Badge>
                        </div>
                        <p className="text-2xl font-bold mb-2">₩{billing.amount.toLocaleString()}/월</p>
                        <p className="text-sm text-gray-600">
                          다음 결제일: {billing.nextBilling}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">결제 수단</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CreditCardIcon className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{billing.paymentMethod}</p>
                            <p className="text-sm text-gray-600">만료일: 12/26</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                          변경
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">결제 이력</h4>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">2024년 1월</p>
                            <p className="text-sm text-gray-600">Professional 플랜</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₩29,000</p>
                            <p className="text-sm text-green-600">결제완료</p>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">2023년 12월</p>
                            <p className="text-sm text-gray-600">Professional 플랜</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₩29,000</p>
                            <p className="text-sm text-green-600">결제완료</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">비밀번호 변경</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">현재 비밀번호</label>
                      <Input type="password" placeholder="현재 비밀번호를 입력하세요" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">새 비밀번호</label>
                      <Input type="password" placeholder="새 비밀번호를 입력하세요" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">새 비밀번호 확인</label>
                      <Input type="password" placeholder="새 비밀번호를 다시 입력하세요" />
                    </div>
                    <Button>비밀번호 변경</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">2단계 인증</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2단계 인증 활성화</p>
                      <p className="text-sm text-gray-600">
                        추가 보안 계층으로 계정을 보호합니다
                      </p>
                    </div>
                    <Button variant="outline">설정</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">로그인 세션</h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">현재 세션</p>
                          <p className="text-sm text-gray-600">
                            Chrome on macOS • 서울, 대한민국
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">활성</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>테마 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">테마 모드</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                      <div className="w-full h-20 bg-white rounded mb-2 border"></div>
                      <p className="text-sm font-medium">라이트</p>
                    </button>
                    <button className="p-4 border rounded-lg hover:border-gray-300">
                      <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
                      <p className="text-sm font-medium">다크</p>
                    </button>
                    <button className="p-4 border rounded-lg hover:border-gray-300">
                      <div className="w-full h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2"></div>
                      <p className="text-sm font-medium">시스템</p>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">색상 테마</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <button className="p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
                      <div className="w-full h-6 bg-blue-500 rounded mb-2"></div>
                      <p className="text-sm">블루</p>
                    </button>
                    <button className="p-3 border rounded-lg hover:border-gray-300">
                      <div className="w-full h-6 bg-green-500 rounded mb-2"></div>
                      <p className="text-sm">그린</p>
                    </button>
                    <button className="p-3 border rounded-lg hover:border-gray-300">
                      <div className="w-full h-6 bg-purple-500 rounded mb-2"></div>
                      <p className="text-sm">퍼플</p>
                    </button>
                    <button className="p-3 border rounded-lg hover:border-gray-300">
                      <div className="w-full h-6 bg-red-500 rounded mb-2"></div>
                      <p className="text-sm">레드</p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}