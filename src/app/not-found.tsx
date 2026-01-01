import Link from "next/link";

import { Compass, Home } from "lucide-react";

/**
 * 404 페이지
 * "길을 잃었지만 괜찮아" - 잠시 멈춤의 순간으로 전환
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sand/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-warm-beige/30 blur-3xl" />

        {/* Subtle decorative lines */}
        <svg
          className="absolute left-1/2 top-1/4 -translate-x-1/2 opacity-[0.08]"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-deep-brown"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-deep-brown"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-deep-brown"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Compass Icon with pulse animation */}
        <div className="animate-fadeInUp mb-6 opacity-0">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand/60">
              <Compass
                className="h-10 w-10 text-soft-brown transition-transform duration-1000 ease-in-out hover:rotate-45"
                strokeWidth={1.2}
              />
            </div>
            {/* Subtle pulse ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-sand/30 [animation-duration:3s]" />
          </div>
        </div>

        {/* 404 Number - Artistic treatment */}
        <div className="animate-fadeInUp mb-4 opacity-0 delay-100">
          <span className="font-serif text-8xl font-bold tracking-tight text-deep-brown/20">
            404
          </span>
        </div>

        {/* Message */}
        <div className="animate-fadeInUp mb-2 opacity-0 delay-200">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            길을 잃으셨나요?
          </h1>
        </div>

        <div className="animate-fadeInUp mb-10 max-w-[280px] opacity-0 delay-300">
          <p className="text-sm leading-relaxed text-soft-brown">
            찾으시는 페이지가 없습니다.
            <br />
            <span className="mt-2 inline-block italic text-soft-brown/80">
              잠시 멈추고, 다시 시작해보세요.
            </span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fadeInUp opacity-0 delay-400">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-deep-brown px-8 py-4 text-base font-medium text-cream transition-all duration-300 hover:bg-soft-brown hover:shadow-lg"
          >
            <Home
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={1.5}
            />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </div>

      {/* Bottom decorative quote */}
      <div className="animate-fadeInUp absolute bottom-8 left-0 right-0 text-center opacity-0 delay-400">
        <p className="font-serif text-xs tracking-wider text-soft-brown/50">
          Selah
        </p>
      </div>
    </div>
  );
}
