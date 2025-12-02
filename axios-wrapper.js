// ========================================================
// AXIOS COMPATIBLE WRAPPER - Con Fetch Nativo
// Reemplazo simple para axios usando fetch de Node.js 18+
// ========================================================

const https = require('https');
const { URL } = require('url');

// ========================================================
// CLASE AXIOS-LIKE WRAPPER
// ========================================================

class AxiosWrapper {
    constructor(config = {}) {
        this.defaults = {
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            },
            ...config
        };
    }

    // GET request
    async get(url, config = {}) {
        return this.request({
            method: 'GET',
            url,
            ...this.defaults,
            ...config
        });
    }

    // POST request
    async post(url, data = null, config = {}) {
        return this.request({
            method: 'POST',
            url,
            data,
            ...this.defaults,
            ...config
        });
    }

    // PUT request
    async put(url, data = null, config = {}) {
        return this.request({
            method: 'PUT',
            url,
            data,
            ...this.defaults,
            ...config
        });
    }

    // DELETE request
    async delete(url, config = {}) {
        return this.request({
            method: 'DELETE',
            url,
            ...this.defaults,
            ...config
        });
    }

    // Main request handler
    async request(config) {
        const {
            method = 'GET',
            url,
            data = null,
            headers = {},
            timeout = 30000,
            params = null,
            responseType = 'json',
            ...otherConfig
        } = config;

        // Build URL with params
        let fullUrl = url;
        if (params) {
            const urlObj = new URL(url);
            Object.keys(params).forEach(key => {
                urlObj.searchParams.append(key, params[key]);
            });
            fullUrl = urlObj.toString();
        }

        // Merge headers
        const finalHeaders = {
            ...this.defaults.headers,
            ...headers
        };

        // Prepare fetch options
        const fetchOptions = {
            method,
            headers: finalHeaders,
            ...otherConfig
        };

        // Add body for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            if (finalHeaders['Content-Type'] === 'application/json') {
                fetchOptions.body = JSON.stringify(data);
            } else {
                fetchOptions.body = data;
            }
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        fetchOptions.signal = controller.signal;

        try {
            // Make request
            const response = await fetch(fullUrl, fetchOptions);
            clearTimeout(timeoutId);

            // Create response object compatible with axios
            const responseData = await this.parseResponse(response, responseType);

            return {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                config: config,
                request: {
                    method,
                    url: fullUrl,
                    headers: finalHeaders
                }
            };

        } catch (error) {
            clearTimeout(timeoutId);
            
            // Handle different error types
            if (error.name === 'AbortError') {
                throw new Error(`Timeout of ${timeout}ms exceeded`);
            }
            
            throw error;
        }
    }

    // Parse response based on type
    async parseResponse(response, responseType) {
        switch (responseType) {
            case 'text':
                return await response.text();
            case 'blob':
                return await response.blob();
            case 'arraybuffer':
                return await response.arrayBuffer();
            case 'json':
            default:
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }
                return await response.text();
        }
    }

    // Create instance with custom config
    static create(config = {}) {
        return new AxiosWrapper(config);
    }
}

// ========================================================
// EXPORT COMPATIBLE CON AXIOS
// ========================================================

module.exports = {
    default: AxiosWrapper,
    AxiosWrapper,
    get: (...args) => AxiosWrapper.create().get(...args),
    post: (...args) => AxiosWrapper.create().post(...args),
    put: (...args) => AxiosWrapper.create().put(...args),
    delete: (...args) => AxiosWrapper.create().delete(...args),
    all: (promises) => Promise.all(promises),
    spread: (callback) => {
        return function (arr) {
            return callback.apply(null, arr);
        };
    },
    // CancelToken for compatibility
    CancelToken: class CancelToken {
        constructor(executor) {
            this.promise = new Promise((resolve, reject) => {
                executor(resolve, reject);
            });
        }
        
        static source() {
            let cancel;
            const promise = new Promise((resolve, reject) => {
                cancel = resolve;
            });
            
            return {
                token: new CancelToken(() => {}),
                cancel: cancel
            };
        }
    },
    isCancel: (value) => value instanceof Error && value.name === 'AbortError'
};

// ========================================================
// EJEMPLO DE USO
// ========================================================

if (require.main === module) {
    console.log('🧪 Probando Axios Wrapper...');
    
    async function test() {
        try {
            const axios = require('./axios-wrapper.js');
            
            // Test GET request
            console.log('Probando GET request...');
            const response = await axios.get('https://httpbin.org/json');
            console.log('✅ GET successful:', response.status);
            
            // Test POST request
            console.log('Probando POST request...');
            const postResponse = await axios.post('https://httpbin.org/post', {
                test: 'data',
                timestamp: new Date().toISOString()
            });
            console.log('✅ POST successful:', postResponse.status);
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }
    
    test();
}