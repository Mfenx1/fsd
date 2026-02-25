'use client';

import NextImage from 'next/image';
import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<typeof NextImage>;


export const Image = (props: ImageProps) => <NextImage {...props} />;