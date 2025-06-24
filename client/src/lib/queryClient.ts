import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
// src/lib/queryClient.ts
// export const apiRequest = async (method: string, endpoint: string, data?: any) => {
//   // Use environment variable for base URL or default to localhost
//   const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

//   const response = await fetch(`${baseUrl}${endpoint}`, {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
//     },
//     credentials: 'include', // For cookies if using session auth
//     body: data ? JSON.stringify(data) : undefined,
//   });

//   if (!response.ok) {
//     let errorMessage = `HTTP error ${response.status}`;
//     try {
//       const errorData = await response.json();
//       errorMessage = errorData.message || errorMessage;
//     } catch {
//       // If response isn't JSON, use default message
//     }
//     throw new Error(errorMessage);
//   }

//   return response;
// };