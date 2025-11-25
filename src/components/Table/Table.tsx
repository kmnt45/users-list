'use client';

import { type FC, useCallback, useEffect, useState } from 'react';

import { Table as AntTable } from 'antd';

import { DeleteModal } from '@/components/DeleteModal';
import { FormModal } from '@/components/FormModal';
import { PageSizeSelector } from '@/components/PageSizeSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/models';
import { fetchUsers, deleteUser, updateUser } from '@/service';
import { selectLoading, selectUsersReversed } from '@/slices';

import { useColumns } from './useColumns';

export const Table: FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsersReversed);

  const loading = useAppSelector(selectLoading);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [subordinates, setSubordinates] = useState<User[]>([]);

  const [pageSize, setPageSize] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
  }, []);

  const handleDelete = useCallback(
    (user: User) => {
      const subs = users.filter((u) => u.chiefId === user.id);

      setUserToDelete(user);

      setSubordinates(subs);

      setDeleteModalOpen(true);
    },
    [users],
  );

  const columns = useColumns({
    users,
    handleEdit,
    handleDelete,
  });

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    await Promise.all(subordinates.map((sub) => dispatch(updateUser({ ...sub, chiefId: undefined })).unwrap()));

    await dispatch(deleteUser(userToDelete.id)).unwrap();

    setDeleteModalOpen(false);

    setUserToDelete(null);

    setSubordinates([]);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);

    setUserToDelete(null);

    setSubordinates([]);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);

    if (size) setPageSize(size);
  };

  const handlePageSizeChange = (value: number | null) => {
    setPageSize(value || 1);

    setCurrentPage(1);
  };

  return (
    <div>
      <AntTable
        rowKey='id'
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: false,
          total: users.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: '100%' }}
        footer={() => <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange} />}
      />

      {editingUser && (
        <FormModal editingUser={editingUser} onCloseAction={() => setEditingUser(null)} openButton={false} />
      )}

      <DeleteModal
        open={deleteModalOpen}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
