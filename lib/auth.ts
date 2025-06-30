export function getAuthUrl() {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_AUTH_URL
    : "https://auth.proact.ing";
}

export function getAppUrl() {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_APP_URL
    : "https://app.proact.ing";
}

export async function getUser(request?: Request) {
  // Para ambientes server-side no Next.js
  if (typeof window === "undefined" && request) {
    return await getServerUser(request);
  }
  
  // Para ambientes client-side
  return await getClientUser();
}

async function getServerUser(request: Request) {
  const cookies = request.headers.get("Cookie");
  const originFromHeader = request.headers.get("Origin");

  const fallbackOrigin = getAppUrl();

  const authApiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://auth.proact.ing";

  const origin = originFromHeader ?? fallbackOrigin;

  async function verifyToken() {
    const headers: Record<string, string> = {
      Cookie: cookies ?? "",
    };
    
    if (origin) {
      headers.Origin = origin;
    }

    const res = await fetch(`${authApiUrl}/verify-token`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return { ok: res.ok, data };
  }

  async function refreshToken() {
    const headers: Record<string, string> = {
      Cookie: cookies ?? "",
    };
    
    if (origin) {
      headers.Origin = origin;
    }

    const res = await fetch(`${authApiUrl}/refresh-token`, {
      method: "POST",
      headers,
    });

    return res.ok;
  }

  let { ok, data } = await verifyToken();

  if (!ok || !data?.success) {
    const refreshed = await refreshToken();
    if (refreshed) {
      const retry = await verifyToken();
      ok = retry.ok;
      data = retry.data;
    }
  }

  if (ok && data?.success && data.user) {
    const user = data.user;

    if (user.is_approved === false) {
      const loginUrl = `${getAuthUrl()}/login?redirect_to=${encodeURIComponent(
        request.url
      )}`;
      throw new Response("Redirect", {
        status: 302,
        headers: {
          Location: loginUrl,
        },
      });
    }

    return user;
  }

  return null;
}

async function getClientUser() {
  const authApiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://auth.proact.ing";

  try {
    const res = await fetch(`${authApiUrl}/verify-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      // Tentar refresh token
      const refreshRes = await fetch(`${authApiUrl}/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        // Tentar verificar token novamente
        const retryRes = await fetch(`${authApiUrl}/verify-token`, {
          method: "GET",
          credentials: "include",
        });
        
        if (retryRes.ok) {
          const data = await retryRes.json();
          return data?.success ? data.user : null;
        }
      }
      return null;
    }

    const data = await res.json();
    
    if (data?.success && data.user) {
      if (data.user.is_approved === false) {
        window.location.href = `${getAuthUrl()}/login?redirect_to=${encodeURIComponent(
          window.location.href
        )}`;
        return null;
      }
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return null;
  }
}

export async function logout() {
  const authApiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://auth.proact.ing";

  try {
    await fetch(`${authApiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    
    // Redirecionar para página de login
    window.location.href = `${getAuthUrl()}/login`;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export type User = {
  id: string;
  email: string;
  name: string;
  is_approved: boolean;
  [key: string]: any;
}; 