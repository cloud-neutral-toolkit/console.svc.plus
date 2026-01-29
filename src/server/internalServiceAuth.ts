import 'server-only'

/**
 * Get the internal service token for service-to-service authentication
 * @returns The service token from environment variable
 */
export function getInternalServiceToken(): string | undefined {
    const token = process.env.INTERNAL_SERVICE_TOKEN
    if (!token || token.trim().length === 0) {
        return undefined
    }
    return token.trim()
}

/**
 * Build headers with internal service token
 * @param baseHeaders Optional base headers to extend
 * @returns Headers with X-Service-Token included
 */
export function buildInternalServiceHeaders(baseHeaders?: HeadersInit): Headers {
    const headers = new Headers(baseHeaders)
    const token = getInternalServiceToken()

    if (token) {
        headers.set('X-Service-Token', token)
    }

    return headers
}

/**
 * Check if internal service token is configured
 * @returns true if token is configured, false otherwise
 */
export function isServiceTokenConfigured(): boolean {
    return getInternalServiceToken() !== undefined
}

/**
 * Validate that service token is configured, throw error if not
 * @throws Error if service token is not configured
 */
export function validateServiceTokenConfigured(): void {
    if (!isServiceTokenConfigured()) {
        throw new Error('INTERNAL_SERVICE_TOKEN environment variable is not configured')
    }
}
