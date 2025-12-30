/**
 * API 공통 타입 정의
 */

/** API 성공 응답 */
export interface ApiSuccessResponse<T> {
  data: T;
}

/** API 에러 응답 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/** API 응답 (성공 또는 에러) */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** 페이지네이션 응답 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** API 결과 (클라이언트 래핑) */
export interface ApiResult<T> {
  data: T | null;
  error: ApiError | null;
}

/** API 에러 */
export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

/** 페이지네이션 요청 파라미터 */
export interface PageParams {
  page?: number;
  size?: number;
}

/** API 에러 타입 가드 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ApiErrorResponse).error === 'object'
  );
}
