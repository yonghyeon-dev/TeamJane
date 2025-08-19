#!/usr/bin/env node

/**
 * 프로덕션 배포 전 검증 스크립트
 * 필수 환경변수, 보안 설정, 성능 설정을 검증합니다.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 WEAVE ERP 프로덕션 배포 검증 시작...\n')

// 색상 코드
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

let errors = 0
let warnings = 0

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
  warnings++
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
  errors++
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`)
}

// 1. 환경변수 검증
function checkEnvironmentVariables() {
  console.log('\n📋 환경변수 검증...')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const recommendedEnvVars = [
    'NEXT_PUBLIC_MONITORING_ENDPOINT',
    'NEXT_PUBLIC_SENTRY_DSN',
    'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID'
  ]
  
  // 필수 환경변수 확인
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      logSuccess(`필수 환경변수 ${envVar} 설정됨`)
    } else {
      logError(`필수 환경변수 ${envVar} 누락`)
    }
  })
  
  // 권장 환경변수 확인
  recommendedEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      logSuccess(`권장 환경변수 ${envVar} 설정됨`)
    } else {
      logWarning(`권장 환경변수 ${envVar} 누락 - 모니터링/분석 기능 제한`)
    }
  })
  
  // NODE_ENV 확인
  if (process.env.NODE_ENV === 'production') {
    logSuccess('NODE_ENV가 production으로 설정됨')
  } else {
    logWarning(`NODE_ENV가 '${process.env.NODE_ENV}'로 설정됨 (production 권장)`)
  }
}

// 2. 빌드 파일 검증
function checkBuildFiles() {
  console.log('\n🏗️  빌드 파일 검증...')
  
  const buildPath = path.join(__dirname, '..', '.next')
  
  if (fs.existsSync(buildPath)) {
    logSuccess('Next.js 빌드 파일 존재')
    
    // 정적 파일 확인
    const staticPath = path.join(buildPath, 'static')
    if (fs.existsSync(staticPath)) {
      logSuccess('정적 파일 생성됨')
    } else {
      logError('정적 파일 누락')
    }
  } else {
    logError('빌드 파일 누락 - npm run build 실행 필요')
  }
  
  // package.json 스크립트 확인
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    const requiredScripts = ['build', 'start', 'lint', 'type-check']
    requiredScripts.forEach(script => {
      if (packageJson.scripts[script]) {
        logSuccess(`package.json에 ${script} 스크립트 존재`)
      } else {
        logError(`package.json에 ${script} 스크립트 누락`)
      }
    })
  }
}

// 3. 보안 설정 검증
function checkSecuritySettings() {
  console.log('\n🔒 보안 설정 검증...')
  
  // next.config.js 확인
  const nextConfigPath = path.join(__dirname, '..', 'next.config.js')
  if (fs.existsSync(nextConfigPath)) {
    logSuccess('next.config.js 파일 존재')
    
    try {
      const nextConfig = require(nextConfigPath)
      
      // 보안 헤더 확인
      if (nextConfig.headers || nextConfig.securityHeaders) {
        logSuccess('보안 헤더 설정 감지')
      } else {
        logWarning('보안 헤더 설정 없음 - CSP, HSTS 등 설정 권장')
      }
      
      // 이미지 최적화 확인
      if (nextConfig.images) {
        logSuccess('이미지 최적화 설정됨')
      } else {
        logWarning('이미지 최적화 설정 없음')
      }
      
    } catch (error) {
      logError('next.config.js 파싱 오류: ' + error.message)
    }
  } else {
    logWarning('next.config.js 파일 없음')
  }
  
  // .env 파일 보안 확인
  const envFiles = ['.env.local', '.env.production', '.env']
  envFiles.forEach(envFile => {
    const envPath = path.join(__dirname, '..', envFile)
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      
      // 민감한 정보 확인
      if (content.includes('password') || content.includes('secret')) {
        logWarning(`${envFile}에 민감한 정보 포함 가능성 - 보안 검토 필요`)
      }
      
      // API 키 형식 확인
      if (content.includes('NEXT_PUBLIC_') && content.includes('KEY')) {
        logWarning('클라이언트 노출 API 키 확인 필요')
      }
    }
  })
}

// 4. 성능 설정 검증
function checkPerformanceSettings() {
  console.log('\n⚡ 성능 설정 검증...')
  
  // 캐싱 설정 확인
  const cacheConfigPath = path.join(__dirname, '..', 'src', 'lib', 'cache')
  if (fs.existsSync(cacheConfigPath)) {
    logSuccess('캐싱 시스템 구현됨')
  } else {
    logWarning('캐싱 시스템 없음')
  }
  
  // React Query 설정 확인
  const reactQueryPath = path.join(__dirname, '..', 'src', 'lib', 'react-query')
  if (fs.existsSync(reactQueryPath)) {
    logSuccess('React Query 설정됨')
  } else {
    logWarning('React Query 설정 없음')
  }
  
  // 모니터링 시스템 확인
  const monitoringPath = path.join(__dirname, '..', 'src', 'lib', 'monitoring')
  if (fs.existsSync(monitoringPath)) {
    logSuccess('모니터링 시스템 구현됨')
  } else {
    logError('모니터링 시스템 없음 - 프로덕션 필수')
  }
}

// 5. 의존성 보안 검증
function checkDependencySecurity() {
  console.log('\n🔍 의존성 보안 검증...')
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    // 알려진 취약한 패키지 확인
    const vulnerablePackages = [
      'lodash@4.17.20',
      'axios@0.21.0',
      'moment@2.29.1'
    ]
    
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    
    Object.keys(allDeps).forEach(pkg => {
      const version = allDeps[pkg]
      vulnerablePackages.forEach(vuln => {
        if (vuln.startsWith(pkg + '@') && version.includes(vuln.split('@')[1])) {
          logWarning(`취약한 패키지 발견: ${pkg}@${version}`)
        }
      })
    })
    
    logInfo('의존성 보안 검사 완료 - 상세한 검사는 "npm audit" 실행')
  }
}

// 메인 실행
async function main() {
  checkEnvironmentVariables()
  checkBuildFiles()
  checkSecuritySettings()
  checkPerformanceSettings()
  checkDependencySecurity()
  
  console.log('\n📊 검증 결과 요약:')
  console.log(`${colors.red}❌ 오류: ${errors}개${colors.reset}`)
  console.log(`${colors.yellow}⚠️  경고: ${warnings}개${colors.reset}`)
  
  if (errors > 0) {
    console.log(`\n${colors.red}🚨 프로덕션 배포 전 ${errors}개 오류를 해결해야 합니다.${colors.reset}`)
    process.exit(1)
  } else if (warnings > 0) {
    console.log(`\n${colors.yellow}⚠️  ${warnings}개 경고가 있지만 배포 가능합니다.${colors.reset}`)
    console.log(`${colors.blue}💡 최적의 성능과 보안을 위해 경고 사항 해결을 권장합니다.${colors.reset}`)
    process.exit(0)
  } else {
    console.log(`\n${colors.green}🎉 모든 검증 통과! 프로덕션 배포 준비 완료${colors.reset}`)
    process.exit(0)
  }
}

main().catch(error => {
  console.error(`\n${colors.red}💥 검증 스크립트 실행 오류:${colors.reset}`, error)
  process.exit(1)
})