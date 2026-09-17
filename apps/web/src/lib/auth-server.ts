import { cookies } from "next/headers";

export function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value;
  
  if (!token) return null;
  
  try {
    // JWT format is Header.Payload.Signature
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return null;
    
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (e) {
    console.error("Failed to parse JWT token on server", e);
    return null;
  }
}
