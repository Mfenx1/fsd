import type { CSSProperties } from 'react';

export const cssVar = (name: `--${string}`, value: string): CSSProperties => ({ [name]: value });