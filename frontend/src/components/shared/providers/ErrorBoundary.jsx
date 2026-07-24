import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel rounded-2xl p-8 border border-red-500/20 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="p-3 rounded-2xl bg-red-500/10">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-[var(--text-primary)]">Something went wrong</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              {this.props.fallbackMessage || 'An unexpected error occurred. You can try again or navigate to a different tool.'}
            </p>
          </div>
          <button onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
            <RefreshCw className="w-3 h-3" /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
