import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <h2 className="text-xl font-light premium-serif mb-4">Oops! Something went wrong.</h2>
          <p className="text-xs opacity-40 uppercase tracking-widest">The 3D model could not be loaded.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-6 py-2 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
