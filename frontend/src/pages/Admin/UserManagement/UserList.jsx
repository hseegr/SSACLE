import React, { useEffect, useState } from 'react';
import UserTable from '@/components/AdminPage/UserManagement/UserTable';
import Pagination from '@/components/commons/Pagination';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-12 w-full min-w-max ">
      <h1 className="text-2xl font-bold text-center">유저 관리</h1>
      <p className="text-xl text-ssacle-gray">⚠️ 페이지 준비 중입니다!</p>
      {/* <UserTable users={users} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      /> */}
    </div>
  );
};

export default UserList;
