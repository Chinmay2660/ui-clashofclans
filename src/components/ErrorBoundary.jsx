import { Component } from 'react';
import { HiRefresh, HiHome } from 'react-icons/hi';
import { Button } from './ui';

const DefaultFallback = ({ error, reset }) => (
  <div className="relative min-h-[60vh] bg-dark-900 flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
    {/* CoC-style background orbs */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-war-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-darkElixir-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '500ms' }} />

    <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
      <div className="w-full bg-dark-800/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 shadow-card">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/30 border-2 border-red-400/30">
          <span className="text-4xl" aria-hidden>⚠️</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          An unexpected error occurred. You can try again or return home.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <pre className="text-left text-xs text-red-400/80 bg-dark-900 rounded-lg p-3 mb-6 overflow-auto max-h-24">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={reset} size="lg">
            <HiRefresh size={18} />
            Try again
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.replace('/')}
            size="lg"
          >
            <HiHome size={18} />
            Go home
          </Button>
        </div>
      </div>
    </div>
  </div>
);

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console?.error === 'function') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultFallback;
      return <Fallback error={this.state.error} reset={this.reset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
export { DefaultFallback };
