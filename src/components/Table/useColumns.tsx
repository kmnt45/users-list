import { useMemo } from 'react';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Role, User } from '@/models';
import { isChiefValid } from '@/utils';

type UseColumnsProps = {
  users: User[];
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
};

const phoneFilters = [
  { text: '+7', value: '+7' },
  { text: '8', value: '8' },
];

const chiefFilters = [
  { text: 'Есть начальник', value: 'has' },
  { text: 'Нет начальника', value: 'none' },
];

const renderChief = (users: User[], chiefId?: string, currentRole?: Role) => {
  if (!chiefId || !currentRole) return '-';

  const manager = users.find((u) => u.id === chiefId);

  if (!manager) return '-';

  return isChiefValid(manager.role, currentRole) ? (
    <Tooltip title={`${manager.name} (${manager.role})`}>{manager.name}</Tooltip>
  ) : (
    '-'
  );
};

export const useColumns = ({ users, handleEdit, handleDelete }: UseColumnsProps): ColumnsType<User> => {
  return useMemo(() => {
    const emailFilters = Array.from(new Set(users.map((u) => u.email.split('@')[1]))).map((domain) => ({
      text: domain,
      value: domain,
    }));

    const roleFilters = Array.from(new Set(users.map((u) => u.role))).map((role) => ({
      text: role,
      value: role,
    }));

    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        sorter: (a, b) => Number(a.id) - Number(b.id),
      },
      {
        title: 'Имя',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (name) => <Tooltip title={name}>{name}</Tooltip>,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        filters: emailFilters,
        onFilter: (value, record) => record.email.endsWith(value as string),
        sorter: (a, b) => a.email.localeCompare(b.email),
        render: (email) => <Tooltip title={email}>{email}</Tooltip>,
      },
      {
        title: 'Телефон',
        dataIndex: 'phone',
        key: 'phone',
        width: 140,
        filters: phoneFilters,
        onFilter: (value, record) => record.phone.startsWith(value as string),
        render: (phone) => <Tooltip title={phone}>{phone}</Tooltip>,
      },
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        width: 100,
        filters: roleFilters,
        onFilter: (value, record) => record.role === value,
        sorter: (a, b) => a.role.localeCompare(b.role),
        render: (role) => <Tooltip title={role}>{role}</Tooltip>,
      },
      {
        title: 'Начальник',
        dataIndex: 'chiefId',
        key: 'chiefId',
        width: 150,
        filters: chiefFilters,
        onFilter: (value, record) => (value === 'has' ? !!record.chiefId : !record.chiefId),
        render: (chiefId: string, record) => renderChief(users, chiefId, record.role),
      },
      {
        title: 'Действия',
        key: 'actions',
        width: 120,
        render: (_, record) => {
          const hasSubordinates = users.some((user) => user.chiefId === record.id);

          return (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              {hasSubordinates ? (
                <Tooltip title='Нельзя удалить пользователя с подчинёнными'>
                  <Button icon={<DeleteOutlined />} danger disabled />
                </Tooltip>
              ) : (
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)} />
              )}
            </Space>
          );
        },
      },
    ];
  }, [users, handleEdit, handleDelete]);
};
