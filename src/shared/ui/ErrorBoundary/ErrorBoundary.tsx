'use client';

import { type ErrorInfo, type ReactNode, PureComponent } from 'react';
import { DefaultErrorFallback } from './DefaultErrorFallback';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends PureComponent<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children } = this.props;

    if (error === null) {
      return children;
    }

    return <DefaultErrorFallback error={error} reset={this.reset} />;
  }
}