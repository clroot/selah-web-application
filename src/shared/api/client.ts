import type { ApiResult, ApiError } from '@/shared/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * API 클라이언트
 *
 * 모든 API 호출은 이 클라이언트를 통해 수행됩니다.
 * - 자동 JSON 직렬화/역직렬화
 * - 일관된 에러 처리
 * - 쿠키 기반 인증 (credentials: 'include')
 */
export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const { body, headers: customHeaders, ...restOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    credentials: 'include', // 쿠키 포함 (세션 인증)
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 204 No Content
    if (response.status === 204) {
      return { data: null as T, error: null };
    }

    const json = await response.json();
    console.log('[API Client] Response:', endpoint, { status: response.status, json });

    // 에러 응답 처리
    if (!response.ok || isApiErrorResponse(json)) {
      const error: ApiError = {
        code: json.error?.code ?? 'UNKNOWN_ERROR',
        message: json.error?.message ?? '알 수 없는 오류가 발생했습니다',
        status: response.status,
      };
      return { data: null, error };
    }

    // 성공 응답
    return { data: json.data as T, error: null };
  } catch (err) {
    // 네트워크 에러 등
    const error: ApiError = {
      code: 'NETWORK_ERROR',
      message: err instanceof Error ? err.message : '네트워크 오류가 발생했습니다',
    };
    return { data: null, error };
  }
}

function isApiErrorResponse(json: unknown): boolean {
  return (
    typeof json === 'object' &&
    json !== null &&
    'error' in json &&
    (json as { error: unknown }).error !== null &&
    typeof (json as { error: unknown }).error === 'object'
  );
}
