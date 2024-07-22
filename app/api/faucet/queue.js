let queue = [];
let isProcessing = false;

const processQueue = async () => {
    if (isProcessing) return;

    isProcessing = true;

    while (queue.length > 0) {
        const { task, resolve, reject } = queue.shift();
        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }

    isProcessing = false;
};

export const enqueue = (task) => {
    return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        if (!isProcessing) {
            processQueue();
        }
    });
};
