/**
 * 앱 버전 표시 컴포넌트
 */
export function AppVersion() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";

  return (
    <div className="py-8 text-center">
      <p className="text-xs text-soft-brown/50">버전 {version}</p>
    </div>
  );
}
