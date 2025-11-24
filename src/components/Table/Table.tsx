'use client';

import { type FC, useEffect, useState } from 'react';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table as AntTable, Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { FormModal } from '@/components/FormModal';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/models';
import { fetchUsers, deleteUser } from '@/service';
import { selectLoading, selectUsersReversed } from '@/slices';

export const Table: FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsersReversed);

  const loading = useAppSelector(selectLoading);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleDelete = (id: number) => () => {
    dispatch(deleteUser(id));
  };

  const handleClose = () => {
    setEditingUser(null);
  };

  const handleEdit = (user: User) => () => setEditingUser(user);

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: { showTitle: false },
      render: (name) => <Tooltip title={name}>{name}</Tooltip>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: { showTitle: false },
      render: (email) => <Tooltip title={email}>{email}</Tooltip>,
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      ellipsis: { showTitle: false },
      render: (phone) => <Tooltip title={phone}>{phone}</Tooltip>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      ellipsis: { showTitle: false },
      render: (role) => <Tooltip title={role}>{role}</Tooltip>,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit(record)} type='default' />
          <Button icon={<DeleteOutlined />} onClick={handleDelete(record.id)} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AntTable
        rowKey='id'
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: '100%' }}
      />
      {editingUser && <FormModal editingUser={editingUser} onCloseAction={handleClose} openButton={false} />}
    </div>
  );
};
