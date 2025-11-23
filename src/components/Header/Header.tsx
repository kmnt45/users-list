'use client';

import type { FC } from 'react';

import { Typography } from 'antd';

const { Title } = Typography;

type HeaderProps = {
  title: string;
};

export const Header: FC<HeaderProps> = ({ title }) => <Title>{title}</Title>;
