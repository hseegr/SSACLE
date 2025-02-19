import { Coffee, Github, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full mt-20 bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 회사 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-ssacle-blue font-montserrat">
                SSACLE
              </span>
              <Coffee
                size={20}
                strokeWidth={1.5}
                className="text-ssacle-blue"
              />
            </div>
            <p className="max-w-xs text-sm text-gray-600">
              SSAFY 교육생들을 위한 최고의 학습 플랫폼, SSACLE과 함께
              성장하세요.
            </p>
            <div className="flex items-center pt-2 space-x-4">
              <a
                href="https://github.com/ssacle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-ssacle-blue"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:contact@ssacle.com"
                className="text-gray-600 transition-colors hover:text-ssacle-blue"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* 빠른 링크 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/ssaprint"
                  className="text-gray-600 transition-colors hover:text-ssacle-blue"
                >
                  싸프린트
                </Link>
              </li>
              <li>
                <Link
                  to="/board/edu"
                  className="text-gray-600 transition-colors hover:text-ssacle-blue"
                >
                  학습게시판
                </Link>
              </li>
              <li>
                <Link
                  to="/board/note"
                  className="text-gray-600 transition-colors hover:text-ssacle-blue"
                >
                  노트 구매
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile"
                  className="text-gray-600 transition-colors hover:text-ssacle-blue"
                >
                  마이페이지
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">연락처</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span>
                  서울특별시 강남구 테헤란로 212, 멀티캠퍼스 역삼 12층{' '}
                </span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>02-1234-5678</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} />
                <span>contact@ssacle.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-600">
              Copyright © {currentYear} SSACLE. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link
                to="/privacy"
                className="transition-colors hover:text-ssacle-blue"
              >
                개인정보처리방침
              </Link>
              <Link
                to="/terms"
                className="transition-colors hover:text-ssacle-blue"
              >
                이용약관
              </Link>
              <Link
                to="/support"
                className="transition-colors hover:text-ssacle-blue"
              >
                고객지원
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
