import type { FC } from 'react';

import { Select } from 'antd';
import type { Control } from 'react-hook-form';

import { FormField } from '@/components/FormField';
import type { User } from '@/models';
import type { UserFormValues } from '@/validation';

const { Option } = Select;

type ChiefSelect = {
  control: Control<UserFormValues>;
  allowedManagers: User[];
  currentRole: string;
};

export const ChiefSelect: FC<ChiefSelect> = ({ control, allowedManagers, currentRole }) => {
  return (
    <FormField
      name='chiefId'
      label='Начальник'
      control={control}
      component={({ value, onChange }) => (
        <Select
          allowClear
          placeholder='Выберите начальника'
          value={value}
          onChange={onChange}
          key={currentRole}
          disabled={currentRole === 'Администратор'}
        >
          {allowedManagers.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </Option>
          ))}
        </Select>
      )}
    />
  );
};
