
export async function fetchJson(url, options, maxAttempts = 5, initialDelay = 500) {
    let delay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to fetch: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (attempt === maxAttempts - 1) throw new Error("Error fetching data. Please try again later.");
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error("Unexpected error when fetching data.");
}
