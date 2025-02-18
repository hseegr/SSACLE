import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MainPage from '@/pages/MainPage/MainPage'
import NotFound from '@/pages/NotFound/NotFound'
import BaseLayout from '@/components/layout/BaseLayout'
import PresentationPage from '@/pages/PresentationPage/PresentationPage'
import PresentationLayout from '@/components/layout/PresentationLayout'
import LoginPage from '@/pages/Account/LoginPage/LoginPage'
import SignupStep1 from '@/pages/Account/SignupPage/SignupStep1'
import SignupStep2 from '@/pages/Account/SignupPage/SignupStep2'
import InterestPage from '@/pages/Account/SignupPage/InterestPage'
import SuccessPage from '@/pages/Account/SignupPage/SuccessPage'
import FindAccount from '@/pages/Account/LoginPage/FindAccount'
import SsaprintPage from '@/pages/Ssaprint/SsaprintPage'
import SsaprintDetailPage from '@/pages/Ssaprint/SsaprintDetailPage'
import SsaprintJourneyPage from '@/pages/Ssaprint/SsaprintJourneyPage'
import SsadcupPage from '@/pages/Ssadcup/SsadcupPage'
import SsaadcpuDetailPage from '@/pages/Ssadcup/SsadcupDetailPage'
import StudyBoardPage from '@/pages/Board/StudyBoardPage'
import StartPage from '@/pages/StartPage/StartPage'
import UserList from '@/pages/Admin/UserManagement/UserList'
import AdminBaseLayout from '@/components/layout/AdminBaseLayout'
import BoardDetailPage from '@/pages/Board/BoardDetailPage'
import BoardFormPage from '@/pages/Board/BoardFormPage'
import FreeBoardPage from '@/pages/Board/FreeBoardPage'
import GuardedRoute from '@/components/common/GuardedRoute'
import UnGuardedRoute from '@/components/common/UnGuardedRoute'
import SsaprintCreatePage from '@/pages/Admin/SsaprintManagement/SsaprintCreatePage'
import SsaprintListPage from '@/pages/Admin/SsaprintManagement/SsaprintListPage'
import AdminSsaprintDetail from '@/pages/Admin/SsaprintManagement/SsaprintDetailPage'
import AdminRoute from '@/components/common/AdminRoute'
import SsadcupList from '@/pages/Admin/SsadcupManagement/SsadcupListPage'
import AdminBoardList from '@/pages/Admin/BoardManagement/BoardListPage'
import NoteBoardPage from '@/pages/Board/NoteBoardPage'
import MyPage from '@/pages/MyPage/MyPage'

const router = createBrowserRouter([
  // 시작 페이지 (로그인 전)
  { path: '/', index: true, element: <StartPage /> },

  // 로그인 후 페이지
  {
    element: <BaseLayout />, // 기본 header, footer가 있는 Page
    children: [
      // 계정 인증 관련 (로그인, 회원가입, 관심사 등록 등)
      {
        path: '/account',
        // element: <UnGuardedRoute />,
        children: [
          // 로그인 page
          { path: 'login', element: <LoginPage /> },
          // 회원가입 page
          {
            path: 'signup',
            children: [
              { index: true, element: <SignupStep1 /> },
              { path: 'step2', element: <SignupStep2 /> },
              { path: 'interest', element: <InterestPage /> },
              { path: 'success', element: <SuccessPage /> },
              { path: 'error', element: <h1>SignUpSuccess</h1> },
            ],
          },
          // 이메일 찾기, 비밀번호 찾기
          { path: 'help', element: <FindAccount /> },
        ],
      },

      // 인증이 필요한 라우트들
      {
        element: <GuardedRoute />,
        children: [
          // user 관련 page (마이페이지, 아이디/비밀번호 찾기 등)
          { path: '/main', element: <MainPage /> },
          {
            path: '/user',
            children: [
              { path: 'profile', element: <MyPage /> },
              { path: 'help/inquiry', element: <h1>inquiry</h1> },
            ],
          },

          // 싸프린트 Page
          {
            path: '/ssaprint',
            children: [
              { index: true, element: <SsaprintPage /> },
              { path: ':sprintId', element: <SsaprintDetailPage /> },
            ],
          },
          {
            path: '/my-sprints/:sprintId',
            element: <SsaprintJourneyPage />,
          },

          // 싸드컵 page
          {
            path: '/ssadcup',
            children: [
              { index: true, element: <SsadcupPage /> },
              { path: ':ssadcupId', element: <SsaadcpuDetailPage /> },
            ],
          },

          // 게시판 페이지 (학습 게시판, 노트 게시판)
          {
            path: '/board',
            children: [
              // 학습 게시판
              {
                path: 'edu',
                children: [
                  { index: true, element: <StudyBoardPage /> }, // 학습 게시판 메인
                  { path: 'write', element: <BoardFormPage /> }, // 새 게시글 작성
                  { path: ':boardId', element: <BoardDetailPage /> }, // 게시글 상세 페이지
                  { path: ':boardId/edit', element: <BoardFormPage /> }, // 기존 게시글 수정
                ],
              },
              // 노트 게시판
              {
                path: 'note',
                children: [
                  { index: true, element: <NoteBoardPage /> }, // 노트 게시판 메인
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 발표 화면 page
  // {
  //   element: <GuardedRoute />,
  //   children: [
  {
    // * http://localhost:5173/presentation/:presentationType/:roomId?userId=1234567890
    path: '/presentation/:presentationType/:roomId',
    element: <PresentationLayout />,
    children: [{ index: true, element: <PresentationPage /> }],
  },
  //   ],
  // },

  // 관리자 관련 page
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminBaseLayout />, // 기본 header, footer가 있는 Page
        children: [
          { index: true, element: <SsaprintListPage /> },
          { path: 'user', element: <UserList /> },
          {
            path: 'ssaprint',
            children: [
              { index: true, element: <SsaprintListPage /> },
              { path: ':id', element: <AdminSsaprintDetail /> },
              { path: 'create', element: <SsaprintCreatePage /> },
            ],
          },
          { path: 'ssadcup', element: <SsadcupList /> },
          { path: 'board', element: <AdminBoardList /> },
        ],
      },
    ],
  },

  // 404 Not Found
  { path: '*', element: <NotFound /> },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
