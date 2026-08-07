'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Rendering Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-4 my-6"
        >
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-1 max-w-md">
            <h2 className="text-xl font-bold text-gray-900 font-sans">Something went wrong</h2>
            <p className="text-sm text-gray-600">
              An unexpected error occurred while rendering this module. Our telemetry team has been notified.
            </p>
          </div>

          <button
            onClick={this.handleReset}
            className="h-10 px-5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl inline-flex items-center space-x-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            aria-label="Reload Application Page"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
