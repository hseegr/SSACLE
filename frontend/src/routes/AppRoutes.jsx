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
import StudyBoardPage from '@/pages/Board/StudyBoardPage'
import StartPage from '@/pages/StartPage/StartPage'
import UserList from '@/pages/Admin/UserManagement/UserList'
import AdminBaseLayout from '@/components/layout/AdminBaseLayout'
import BoardDetailPage from '@/pages/Board/BoardDetailPage'
import BoardFormPage from '@/pages/Board/BoardFormPage'
import FreeBoardPage from '@/pages/Board/FreeBoardPage'
import SsaprintDetailPage from '@/pages/Ssaprint/SsaprintDetailPage'
import SsaprintJourneyPage from '@/pages/Ssaprint/SsaprintJourneyPage'

const router = createBrowserRouter([
  // 시작 페이지 (로그인 전)
  { path: '/', index: true, element: <StartPage /> },

  // 로그인 후 페이지
  {
    path: '/main',
    element: <MainPage />,
  },
  {
    element: <BaseLayout />, // 기본 header, footer가 있는 Page
    children: [
      // 메인 page
      { path: '/main', index: true, element: <MainPage /> },

      // 계정 인증 관련 (로그인, 회원가입, 관심사 등록 등)
      {
        path: '/account',
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

      // user 관련 page (마이페이지, 아이디/비밀번호 찾기 등)
      {
        path: '/user',
        children: [
          { path: 'profile', element: <h1>Profile</h1> },
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
          { index: true, element: <h1>ssadcup</h1> },
          { path: ':ssadcupId', element: <h1>ssadcupId</h1> },
        ],
      },

      // 게시판 페이지 (학습 게시판, 자유 게시판)

      // 이전 코드
      // {
      //   path: '/board',
      //   children: [
      //     {
      //       // 학습 게시판 -> 탭으로 명예의 전당, 질의응답 구분 예정. 아래 코드 주석 처리
      //       // path: 'edu',
      //       // children: [
      //       //   { index: true, path: 'qna', element: <h1>질의 응답</h1> },
      //       //   { path: 'legend', element: <StudyBoardPage /> },
      //       // ],
      //       path: 'edu',
      //       children: [{ index: true, element: <StudyBoardPage /> }],
      //     },
      //     {
      //       path: 'free',
      //       children: [
      //         { index: true, element: <h1>자유게시판</h1> },
      //         { path: 'ssaguman', element: <h1>싸구만</h1> },
      //       ],
      //     },
      //   ],
      // },
      {
        path: '/board',
        children: [
          // 학습 게시판
          {
            path: 'edu',
            children: [
              { index: true, element: <StudyBoardPage /> }, // 학습 게시판 메인
              { path: ':boardId', element: <BoardDetailPage /> }, // 게시글 상세 페이지
              { path: 'write', element: <BoardFormPage /> }, // 새 게시글 작성
              { path: ':boardId/edit', element: <BoardFormPage /> }, // 기존 게시글 수정
            ],
          },
          // 자유 게시판
          {
            path: 'free',
            children: [
              { index: true, element: <FreeBoardPage /> }, // 자유 게시판 메인
              { path: ':boardId', element: <BoardDetailPage /> }, // 게시글 상세 페이지
              { path: 'write', element: <BoardFormPage /> }, // 새 게시글 작성
              { path: ':boardId/edit', element: <BoardFormPage /> }, // 기존 게시글 수정
            ],
          },
        ],
      },
    ],
  },
  // 발표 화면 page
  {
    path: '/presentation',
    element: <PresentationLayout />,
    children: [{ index: true, element: <PresentationPage /> }],
  },
  // 관리자 관련 page
  {
    path: '/admin',
    element: <AdminBaseLayout />, // 기본 header, footer가 있는 Page
    children: [
      { index: true, element: <h1>관리자 페이지</h1> },
      { path: 'user', element: <UserList /> },
      { path: 'sprint', element: <h1>admin sprint</h1> },
      { path: 'ssadcup', element: <h1>admin ssadcup</h1> },
      { path: 'board', element: <h1>admin board</h1> },
    ],
  },
  // 404 Not Found
  { path: '*', element: <NotFound /> },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
