We need to generate the file content for app/components/error-boundary.tsx based on the task instruction: "Create a shared error boundary component `app/components/error-boundary.tsx` with retry option."

This is a Next.js app with shadcn/ui (likely) and we need a reusable error boundary component. It should catch errors and provide a retry option. Since it's a shared component, we should use React Error Boundary pattern (class component) or a functional component with error boundary hooks (like react-error-boundary). The task suggests "with retry option", so likely we implement a simple error boundary that shows an error message and a "Try again" button that resets the error state.

Given that the repository already has components in `@/components/ui/*` (shadcn/ui) and uses TypeScript, we should create a class-based ErrorBoundary component. But modern patterns often use `react-error-boundary` library. However, the instruction doesn't mention installing that library, and we should avoid unnecessary dependency churn. So we'll create a simple ErrorBoundary class component.

Alternatively, we could create a functional wrapper using `useState` and `useCallback` with `componentDidCatch` but that requires class. I'll create a class component.

The component should:
- Accept `children` and optional `fallback` prop.
- Catch errors.
- Render fallback UI with error message and retry button.
- On retry, reset the error state.

We'll use Tailwind for styling and reference shadcn/ui Button if available, but to be safe we can use a simple button with styling consistent with shadcn.

Since the task says "shared error boundary component", we'll name it `ErrorBoundary` and export it.

I'll write the file content accordingly.
'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <div className="mb-4 text-4xl text-destructive">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-destructive-foreground">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}