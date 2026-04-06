"use client";
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface State { hasError: boolean; error: Error | null }

interface Props {
  children: React.ReactNode;
  /** Optional fallback UI. Receives the error and a reset function. */
  fallback?: (error: Error | null, reset: () => void) => React.ReactNode;
  /** Short label shown in the default fallback (e.g. "Analytics", "FinOps"). */
  section?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.section ?? "unknown"}]`, error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-red-400 mb-1">
              {this.props.section ? `${this.props.section} failed to load` : "Something went wrong"}
            </p>
            <p className="text-xs text-zinc-500">{this.state.error?.message ?? "An unexpected error occurred."}</p>
          </div>
          <button
            onClick={this.reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-[10px] font-black uppercase tracking-widest text-zinc-300"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
