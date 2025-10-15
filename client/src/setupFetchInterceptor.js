export function setupFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    try {
      const response = await originalFetch(...args);

      if (!response.ok) {
        let message;
        try {
          const data = await response.json();
          message = data?.message || JSON.stringify(data) || response.statusText;
        } catch (e) {
          message = await response.text();
        }

        throw {
          status: response.status, 
          message: message || "Something went wrong",
        };
      }

      return response;
    } catch (error) {
      if (!error.status) {
        error = { status: 500, message: error.message || "Internal Server Error" };
      }
      throw error;
    }
  };
}
