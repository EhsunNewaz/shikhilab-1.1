# **6. Security**

This section defines our multi-layered, "defense-in-depth" security architecture.

  * **Authentication:** JWTs with a **refresh token strategy** to handle long-running test sessions. The `accessToken` is stored in memory, while the `refreshToken` is stored in a secure, HTTP-only cookie. A `/auth/refresh` endpoint is required.
  * **Client-Side Security (PWA):** Sensitive data stored offline in IndexedDB will be handled with care. Authentication tokens **must not** be stored in `localStorage`.
  * **Secrets Management:** **Google Secret Manager** for production; `.env` files for local development.
  * **API Security:** Rate limiting, strict CORS policy, and standard security headers (`Helmet.js`).
  * **Data Protection:** TLS 1.2+ for data in transit; GCP default encryption for data at rest. Access to PII will be logged.
  * **Dependency Security:** Automated vulnerability scanning via **Dependabot** or **Snyk** in the CI/CD pipeline.

-----
