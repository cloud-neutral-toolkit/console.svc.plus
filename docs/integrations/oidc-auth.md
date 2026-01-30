# OIDC Authentication Configuration Guide

This guide describes how to configure GitHub and Google OIDC authentication for the Cloud Neutral Toolkit.

## Prerequisites

- Access to GitHub Developer Settings.
- Access to Google Cloud Console.
- Properly configured `accounts.svc.plus` and `console.svc.plus` services.

---

## 1. GitHub Configuration

### 1.1 Create GitHub OAuth App

1.  Log in to GitHub and go to **Settings** > **Developer Settings** > **OAuth Apps**.
2.  Click **New OAuth App**.
3.  **Application name**: e.g., `Cloud Neutral Console`
4.  **Homepage URL**: `https://console.svc.plus` (or your actual console domain)
5.  **Authorization callback URL**: `https://accounts.svc.plus/api/auth/oauth/callback/github`
6.  Click **Register application**.
7.  Copy the **Client ID**.
8.  Click **Generate a new client secret** and copy the **Client Secret**.

### 1.2 Configure Environment Variables

Set the following environment variables for **accounts.svc.plus**:

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
# Optional: if you want to override the default callback
# GITHUB_REDIRECT_URL=https://accounts.svc.plus/api/auth/oauth/callback/github
```

---

## 2. Google Configuration

### 2.1 Create Google OAuth Client ID

1.  Log in to [Google Cloud Console](https://console.cloud.google.com/).
2.  Select or create a project.
3.  Go to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  **Application type**: `Web application`.
6.  **Name**: e.g., `Cloud Neutral Console`.
7.  **Authorized JavaScript origins**:
    - `https://console.svc.plus`
8.  **Authorized redirect URIs**:
    - `https://accounts.svc.plus/api/auth/oauth/callback/google`
9.  Click **Create**.
10. Copy the **Client ID** and **Client Secret**.

### 2.2 Configure Environment Variables

Set the following environment variables for **accounts.svc.plus**:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Optional: if you want to override the default callback
# GOOGLE_REDIRECT_URL=https://accounts.svc.plus/api/auth/oauth/callback/google
```

---

## 3. General OIDC Environment Variables

Ensure these are also set for **accounts.svc.plus**:

```bash
OAUTH_REDIRECT_URL=https://accounts.svc.plus/api/auth/oauth/callback
OAUTH_FRONTEND_URL=https://console.svc.plus
```

**Note**: The backend automatically appends `/{provider}` to `OAUTH_REDIRECT_URL` if a provider-specific redirect URL is not provided.

---

## 4. Frontend Configuration

For **console.svc.plus**, ensure the following is set so it knows where to redirect for the initial OAuth step:

```bash
NEXT_PUBLIC_ACCOUNTS_SVC_URL=https://accounts.svc.plus
```
