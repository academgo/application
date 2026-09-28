// Замена axios на встроенный fetch (-50 КБ JS на каждой странице с формой).
// Тот же интерфейс, что использовали формы: http.get/post возвращают { data },
// а ответ не 2xx бросает ошибку — как axios, поэтому catch в формах работает
// по-прежнему.

type HttpResponse<T> = { data: T; status: number };

const request = async <T = any>(
  url: string,
  init?: RequestInit
): Promise<HttpResponse<T>> => {
  const response = await fetch(url, init);
  const text = await response.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // не JSON — отдаём как текст
  }

  if (!response.ok) {
    throw Object.assign(
      new Error(`Request failed with status ${response.status}`),
      {
        response: { data, status: response.status }
      }
    );
  }

  return { data, status: response.status };
};

const http = {
  get: <T = any>(url: string) => request<T>(url),
  post: <T = any>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {})
    })
};

export default http;
