const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  session_id?: string | null;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export async function submitContact(
  payload: ContactPayload
): Promise<ContactResponse> {
  const res = await fetch(`${API_URL}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 429) {
    throw new Error("Too many requests. Please try again later.");
  }

  if (!res.ok) {
    throw new Error("Failed to send message. Please try again.");
  }

  return res.json();
}
