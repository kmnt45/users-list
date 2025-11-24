import { type ReactElement } from 'react';

import { Input, Form } from 'antd';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { UserFormValues } from '@/validation';

type FormFieldProps<T extends keyof UserFormValues> = {
  name: T;
  label: string;
  control: Control<UserFormValues>;
  placeholder?: string;
  component?: (fieldProps: ControllerRenderProps<UserFormValues, T>) => ReactElement;
};

export const FormField = <T extends keyof UserFormValues>({
  name,
  label,
  control,
  placeholder,
  component,
}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Form.Item label={label} validateStatus={fieldState.error ? 'error' : ''} help={fieldState.error?.message}>
        {component ? component(field) : <Input {...field} placeholder={placeholder} />}
      </Form.Item>
    )}
  />
);
