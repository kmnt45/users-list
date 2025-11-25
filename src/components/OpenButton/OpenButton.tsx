import type { FC } from 'react';

import { UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type OpenButtonProps = {
  onClick: () => void;
  loading: boolean;
};

export const OpenButton: FC<OpenButtonProps> = ({ onClick, loading }) => (
  <Button size='large' type='primary' icon={<UserAddOutlined />} onClick={onClick} loading={loading}>
    Добавить пользователя
  </Button>
);
