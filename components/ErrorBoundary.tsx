import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("React App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500 text-center p-4">
          <div>
            <h1 className="text-xl font-bold mb-2">Terjadi Kesalahan</h1>
            <p>Silakan refresh halaman atau periksa konsol untuk detail error.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
