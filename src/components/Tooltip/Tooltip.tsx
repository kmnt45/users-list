'use client';

import type { FC } from 'react';

import { Tooltip as AntdTooltip } from 'antd';

type TooltipProps = {
  title: string;
};

export const Tooltip: FC<TooltipProps> = ({ title }) => <AntdTooltip title={title}>{title}</AntdTooltip>;
