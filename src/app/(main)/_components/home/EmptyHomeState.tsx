import { BookOpen } from "lucide-react";

/**
 * 홈 화면 빈 상태 UI
 */
export function EmptyHomeState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sand">
        <BookOpen className="h-7 w-7 text-soft-brown" strokeWidth={1.5} />
      </div>
      <p className="text-sm leading-relaxed text-soft-brown">
        아직 기록된 기도가 없습니다.
        <br />
        아래 버튼을 눌러 첫 기도문을 작성해보세요.
      </p>
    </div>
  );
}
