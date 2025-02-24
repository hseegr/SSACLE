import React from 'react';
import BaseTable from '@/components/commons/AdminBaseTable';

const UserTable = ({ users }) => {
  const columns = [
    { key: 'id', label: 'No.' },
    { key: 'userId', label: 'User ID' },
    { key: 'nickname', label: '닉네임' },
    { key: 'name', label: '이름' },
    { key: 'email', label: 'Email' },
    { key: 'signupDate', label: '가입 날짜' },
    { key: 'badgeCount', label: '뱃지 수' },
    { key: 'activeSprint', label: '활성화된 싸프린트' },
    { key: 'inactiveSprint', label: '비활성화된 싸프린트' },
    { key: 'postCount', label: '게시글 수' },
    { key: 'commentCount', label: '댓글 수' },
  ];

  return <BaseTable columns={columns} data={users} />;
};

export default UserTable;
