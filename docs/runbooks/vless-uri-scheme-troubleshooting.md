# VLESS URI Scheme Troubleshooting Runbook

## Overview

This runbook helps diagnose and fix issues with VLESS QR code generation, copy link, and download functionality in the user center. The system **requires valid node data from the server** - there are no hardcoded fallbacks.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     agent.svc.plus                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Agent Registration & Heartbeat                           │  │
│  │ - Registers with metadata (name, region, etc.)          │  │
│  │ - Sends periodic heartbeats                              │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   accounts.svc.plus                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ URI Scheme Templates (embedded in binary)                │  │
│  │ - VLESS-TCP-URI.Scheme                                   │  │
│  │ - VLESS-XHTTP-URI.Scheme                                 │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ /api/agent/nodes Handler                                 │  │
│  │ 1. Reads registered agent metadata                       │  │
│  │ 2. Loads URI scheme templates                            │  │
│  │ 3. Renders templates with user UUID, domain, etc.       │  │
│  │ 4. Returns array of VlessNode objects                    │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼ JSON Response
                    {
                      "name": "NODE-NAME",
                      "address": "example.com",
                      "transport": "tcp",
                      "uri_scheme_tcp": "vless://...",
                      "uri_scheme_xhttp": "vless://..."
                    }
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   console.svc.plus                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /api/agent/nodes (proxy to accounts.svc.plus)           │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ VlessQrCard Component                                    │  │
│  │ - Fetches nodes via useSWR                               │  │
│  │ - User selects node and transport (TCP/XHTTP)           │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ buildVlessUri(uuid, node)                                │  │
│  │ ✅ Validates: uuid, node, node.transport                 │  │
│  │ ✅ Selects: uri_scheme_tcp or uri_scheme_xhttp          │  │
│  │ ❌ No fallbacks - returns null if data missing          │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ renderVlessUriFromScheme(template, values)               │  │
│  │ - Substitutes ${UUID}, ${DOMAIN}, etc.                  │  │
│  │ - Returns complete VLESS URI                             │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│                    vless://uuid@host:port?...                   │
│                            │                                     │
│              ┌─────────────┼─────────────┐                      │
│              ▼             ▼             ▼                      │
│         QR Code      Copy Link    Download QR                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### ✅ What the System Does

1. **Server-Driven Configuration**: All node information comes from `accounts.svc.plus`
2. **Dynamic Node Discovery**: Nodes are discovered from registered agents in `agent.svc.plus`
3. **Template-Based URI Generation**: URI schemes are defined in `accounts.svc.plus` and rendered server-side
4. **Strict Validation**: Frontend validates all required fields and fails fast with clear errors
5. **No Hardcoded Defaults**: No fake nodes, hosts, or labels in the UI code

### ❌ What the System Does NOT Do

1. **No Fallback Nodes**: If no agents are registered, no nodes are shown (not "TOKYO-NODE")
2. **No Hardcoded Hosts**: No `'ha-proxy-jp.svc.plus'` or similar in frontend code
3. **No Manual URI Construction**: Frontend never builds URIs from scratch using URLSearchParams
4. **No Default Labels**: No hardcoded "TOKYO-NODE" or similar labels

## Common Issues

### Issue 1: No Nodes Displayed / Empty Node List

**Symptoms:**
- Node selector is empty or not shown
- QR code shows error or "Generating QR code..." indefinitely

**Diagnosis:**

1. Check `/api/agent/nodes` response:
   ```bash
   curl -H "Cookie: xc_session=$TOKEN" \
     https://console.svc.plus/api/agent/nodes
   ```
   
   Expected: Array with at least one node
   ```json
   [
     {
       "name": "NODE-NAME",
       "address": "example.com",
       "transport": "tcp",
       "uri_scheme_tcp": "vless://...",
       "uri_scheme_xhttp": "vless://..."
     }
   ]
   ```

2. Check browser console for errors:
   ```
   [VLESS] Cannot build URI: node is undefined
   ```

**Root Causes & Fixes:**

| Cause | Diagnosis | Fix |
|-------|-----------|-----|
| No agents registered | Check agent.svc.plus logs for registration | Register at least one agent |
| `XRAY_PROXY_NODES` env var empty | Check accounts.svc.plus env vars | Set `XRAY_PROXY_NODES=host1.com,host2.com` |
| Agent heartbeat failing | Check agent.svc.plus health endpoint | Fix agent connectivity |
| API proxy misconfigured | Check console.svc.plus API routes | Verify `/api/agent/*` proxies to accounts.svc.plus |

### Issue 2: QR Code Not Displaying

**Symptoms:**
- Nodes are listed but QR code doesn't generate
- Error in browser console

**Diagnosis:**

Check browser console for `[VLESS]` errors:

```javascript
// Error 1: Missing transport
[VLESS] Missing transport type from node: example.com

// Error 2: Missing URI scheme
[VLESS] Missing URI scheme template from server for transport: tcp. 
Node: example.com. 
Please ensure accounts.svc.plus is returning uri_scheme_tcp and uri_scheme_xhttp fields.

// Error 3: Invalid UUID
[VLESS] Cannot build URI: node is undefined
```

**Root Causes & Fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| Missing transport | Node object missing `transport` field | Check accounts.svc.plus `listAgentNodes` function |
| Missing URI scheme | `uri_scheme_tcp` or `uri_scheme_xhttp` not in response | Verify `VLESSTCPScheme()` and `VLESSXHTTPScheme()` are called |
| Invalid UUID | User doesn't have proxy UUID | Check user record in database |

### Issue 3: Copy Link Returns Empty

**Symptoms:**
- Click "Copy Link" button
- Nothing copied to clipboard
- Or clipboard contains "null"

**Diagnosis:**

This is the same as Issue 2 - `buildVlessUri()` is returning `null`.

**Fix:**

See Issue 2 root causes and fixes.

### Issue 4: Switching TCP/XHTTP Doesn't Update QR

**Symptoms:**
- Click TCP or XHTTP button
- QR code doesn't change

**Diagnosis:**

1. Check if both `uri_scheme_tcp` and `uri_scheme_xhttp` exist in node data
2. Check React DevTools to see if `preferredTransport` state is updating
3. Check if `vlessUri` is recomputing

**Root Cause:**

Usually a React rendering issue, not related to URI scheme logic. The `useEffect` hook should automatically trigger when `vlessUri` changes.

**Fix:**

```typescript
// In VlessQrCard.tsx, verify this useEffect exists:
useEffect(() => {
  if (!vlessUri) {
    setQrDataUrl(null)
    return
  }
  
  toDataURL(vlessUri, { /* ... */ })
    .then(setQrDataUrl)
    .catch(console.error)
}, [vlessUri])  // ✅ Depends on vlessUri
```

### Issue 5: Node Shows Generic "Node" Label

**Symptoms:**
- Node badge shows "Node" instead of actual node name

**Diagnosis:**

Check node data structure:
```javascript
// In browser console
console.log(effectiveNode)
```

Expected:
```javascript
{
  name: "TOKYO-NODE",  // ✅ Should have name
  address: "example.com",
  // ...
}
```

**Root Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Agent not sending name metadata | Update agent to send `name` in registration |
| `resolveNodeName()` logic broken | Check accounts.svc.plus `resolveNodeName` function |
| Fallback to generic label | Expected behavior if `name` and `address` both missing |

## Debugging Steps

### Step 1: Verify Backend URI Schemes

```bash
# SSH into accounts.svc.plus container or check source code
cd /app/internal/xrayconfig

# Check scheme files exist
ls -la VLESS-*.Scheme

# View TCP scheme
cat VLESS-TCP-URI.Scheme
# Expected: vless://${UUID}@${DOMAIN}:1443?encryption=none&type=tcp&security=tls&sni=${SNI}&fp=${FP}&flow=${FLOW}#${TAG}

# View XHTTP scheme  
cat VLESS-XHTTP-URI.Scheme
# Expected: vless://${UUID}@${DOMAIN}:443?encryption=none&type=xhttp&security=tls&host=${DOMAIN}&path=${PATH}&mode=${MODE}&sni=${SNI}&fp=${FP}&alpn=h2%2Chttp%2F1.1%2Ch3#${TAG}
```

### Step 2: Test API Endpoint

```bash
# Get auth token from browser cookies
TOKEN="your-xc_session-cookie-value"

# Test nodes endpoint
curl -H "Cookie: xc_session=$TOKEN" \
  https://console.svc.plus/api/agent/nodes | jq '.'

# Expected output:
[
  {
    "name": "NODE-NAME",
    "address": "example.com",
    "port": 443,
    "users": ["uuid-here"],
    "transport": "xhttp",
    "path": "/split",
    "mode": "auto",
    "security": "tls",
    "flow": "xtls-rprx-vision",
    "server_name": "example.com",
    "xhttp_port": 443,
    "tcp_port": 1443,
    "uri_scheme_xhttp": "vless://uuid@example.com:443?...",
    "uri_scheme_tcp": "vless://uuid@example.com:1443?..."
  }
]

# Check specific fields
curl -H "Cookie: xc_session=$TOKEN" \
  https://console.svc.plus/api/agent/nodes | \
  jq '.[0] | {name, address, uri_scheme_tcp, uri_scheme_xhttp}'
```

### Step 3: Check Frontend Logs

Open browser DevTools Console and look for:

```
✅ Good (no errors):
(no [VLESS] messages)

❌ Bad:
[VLESS] Cannot build URI: node is undefined
[VLESS] Missing transport type from node: example.com
[VLESS] Missing URI scheme template from server for transport: tcp. Node: example.com. Please ensure accounts.svc.plus is returning uri_scheme_tcp and uri_scheme_xhttp fields.
```

### Step 4: Verify QR Code Generation

```javascript
// In browser console, test QR generation manually
import { toDataURL } from 'qrcode'

const testUri = 'vless://test-uuid@example.com:1443?encryption=none&type=tcp&security=tls#TEST'

toDataURL(testUri, {
  errorCorrectionLevel: 'M',
  margin: 1,
  scale: 8,
}).then(url => {
  console.log('QR generated successfully:', url.substring(0, 50) + '...')
  // Create img element to view
  const img = document.createElement('img')
  img.src = url
  document.body.appendChild(img)
})
```

### Step 5: Check Agent Registration

```bash
# Check if agents are registered
# (This depends on your agent.svc.plus implementation)

# Example: Check agent heartbeat logs
kubectl logs -n your-namespace deployment/agent-svc-plus | grep heartbeat

# Example: Check registered agents in database
psql -c "SELECT * FROM agents WHERE last_heartbeat > NOW() - INTERVAL '5 minutes';"
```

## Code References

### Frontend (console.svc.plus)

**Main Logic:**
- [vless.ts](file:///Users/shenlan/workspaces/cloud-neutral-toolkit/console.svc.plus/src/modules/extensions/builtin/user-center/lib/vless.ts)
  - `VLESS_DEFAULTS` - Technical constants (fingerprint, tcpFlow)
  - `buildVlessUri()` - Renders URI from server template (**no fallbacks**)
  - `renderVlessUriFromScheme()` - Template variable substitution
  - `buildVlessConfig()` - Builds Xray config for download

**UI Component:**
- [VlessQrCard.tsx](file:///Users/shenlan/workspaces/cloud-neutral-toolkit/console.svc.plus/src/modules/extensions/builtin/user-center/components/VlessQrCard.tsx)
  - Fetches nodes from `/api/agent/nodes` via `useSWR`
  - Manages TCP/XHTTP transport switching
  - Generates QR code via `toDataURL()`
  - Displays node selector if multiple nodes available

### Backend (accounts.svc.plus)

**URI Schemes:**
- `internal/xrayconfig/VLESS-TCP-URI.Scheme` - TCP URI template
- `internal/xrayconfig/VLESS-XHTTP-URI.Scheme` - XHTTP URI template

**Template Loading:**
- `internal/xrayconfig/templates.go`
  - `VLESSTCPScheme()` - Returns embedded TCP URI template
  - `VLESSXHTTPScheme()` - Returns embedded XHTTP URI template

**API Handler:**
- `api/user_agents.go`
  - `listAgentNodes()` - Returns node list with rendered URI schemes
  - `renderVLESSURIScheme()` - Substitutes template variables (${UUID}, ${DOMAIN}, etc.)
  - `registeredNodeMetadata()` - Reads agent registration data
  - `parseProxyNodeHosts()` - Parses `XRAY_PROXY_NODES` env var

## Environment Variables

### accounts.svc.plus

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `XRAY_PROXY_NODES` | Additional proxy nodes (comma-separated) | - | `node1.com,node2.com` |
| `XRAY_XHTTP_PATH` | XHTTP path | `/split` | `/custom-path` |
| `XRAY_XHTTP_MODE` | XHTTP mode | `auto` | `stream` |
| `XRAY_XHTTP_PORT` | XHTTP port | `443` | `8443` |
| `XRAY_TCP_PORT` | TCP port | `1443` | `1444` |

## Recovery Procedures

### Procedure 1: Fix Missing URI Schemes

If `uri_scheme_tcp` or `uri_scheme_xhttp` are missing from API response:

1. **Check scheme files exist:**
   ```bash
   ls -la /app/internal/xrayconfig/VLESS-*.Scheme
   ```

2. **Verify templates.go loads them:**
   ```go
   // Should have these embed directives:
   //go:embed VLESS-TCP-URI.Scheme
   vlessTCPScheme []byte
   
   //go:embed VLESS-XHTTP-URI.Scheme
   vlessXHTTPScheme []byte
   ```

3. **Rebuild and redeploy accounts.svc.plus:**
   ```bash
   cd /Users/shenlan/workspaces/cloud-neutral-toolkit/accounts.svc.plus
   go build -o accounts-svc-plus
   # Deploy to Cloud Run or your platform
   ```

4. **Verify schemes are returned:**
   ```bash
   curl https://accounts.svc.plus/api/agent/nodes | jq '.[0].uri_scheme_tcp'
   ```

### Procedure 2: Fix No Nodes Returned

If `/api/agent/nodes` returns empty array `[]`:

1. **Check `XRAY_PROXY_NODES` env var:**
   ```bash
   # In accounts.svc.plus container
   echo $XRAY_PROXY_NODES
   # Should output: host1.com,host2.com
   ```

2. **Check agent registration:**
   ```bash
   # Verify agents are sending heartbeats
   # (Implementation-specific)
   ```

3. **Add manual proxy nodes:**
   ```bash
   # Set env var in Cloud Run or your platform
   XRAY_PROXY_NODES=node1.example.com,node2.example.com
   ```

4. **Restart accounts.svc.plus**

### Procedure 3: Reset Frontend State

If QR code is stuck or showing old data:

1. **Clear browser cache:**
   - Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
   - Select "Cached images and files"

2. **Hard refresh:**
   - Mac: Cmd+Shift+R
   - Windows: Ctrl+Shift+R

3. **Clear SWR cache:**
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

4. **Verify API returns valid data:**
   ```bash
   curl -H "Cookie: xc_session=$TOKEN" \
     https://console.svc.plus/api/agent/nodes
   ```

## Monitoring

### Key Metrics

1. **QR Code Generation Success Rate**
   - Track `toDataURL()` success/failure ratio
   - Alert if failure rate > 5%

2. **API Response Time**
   - Monitor `/api/agent/nodes` latency
   - Alert if p95 > 500ms

3. **Error Rate**
   - Count `[VLESS]` console errors
   - Alert if error rate > 1% of page loads

4. **Node Availability**
   - Track number of nodes returned by `/api/agent/nodes`
   - Alert if drops to 0

### Alerts

Set up alerts for:

- High rate of `[VLESS] Missing URI scheme` errors (> 10/min)
- `/api/agent/nodes` returning empty array for > 5 minutes
- QR code generation failures (> 5% of attempts)
- Agent heartbeat failures (no heartbeat for > 5 minutes)

## Testing Checklist

Before deploying changes:

- [ ] `/api/agent/nodes` returns valid node data with `uri_scheme_tcp` and `uri_scheme_xhttp`
- [ ] QR code generates successfully for TCP transport
- [ ] QR code generates successfully for XHTTP transport
- [ ] Copy link button copies valid VLESS URI
- [ ] Download QR button downloads valid QR code image
- [ ] Switching TCP ↔ XHTTP regenerates QR code
- [ ] Node selector shows all registered nodes (if multiple exist)
- [ ] No `[VLESS]` errors in browser console (with valid data)
- [ ] Clear error messages in console when data is missing
- [ ] No hardcoded "TOKYO-NODE" or fake hosts appear in UI

## Related Documentation

- [VLESS Protocol Specification](https://github.com/XTLS/Xray-core)
- [Implementation Plan](file:///Users/shenlan/.gemini/antigravity/brain/57f5a000-a95d-484c-999d-ac7b60bfa953/implementation_plan.md)
- [Walkthrough](file:///Users/shenlan/.gemini/antigravity/brain/57f5a000-a95d-484c-999d-ac7b60bfa953/walkthrough.md)

## Change Log

| Date | Change | Impact |
|------|--------|--------|
| 2026-02-04 | Removed `DEFAULT_VLESS_TEMPLATE` hardcoded values | No more fake "TOKYO-NODE" or `ha-proxy-jp.svc.plus` |
| 2026-02-04 | Removed fallback URI construction logic | System now fails fast with clear errors |
| 2026-02-04 | Removed `DEFAULT_VLESS_LABEL` export | Node labels come from server only |
| 2026-02-04 | Added strict validation in `buildVlessUri` | Better error messages for debugging |
| 2026-02-04 | Created troubleshooting runbook | Easier diagnosis and recovery |


### Issue 1: QR Code Not Displaying

**Symptoms:**
- QR code shows "Generating QR code..." indefinitely
- Or shows error message

**Diagnosis:**

1. Check browser console for `[VLESS]` errors:
   ```
   [VLESS] Missing URI scheme template from server for transport: tcp
   ```

2. Check `/api/agent/nodes` response in Network tab:
   ```bash
   # Should include these fields:
   {
     "uri_scheme_tcp": "vless://...",
     "uri_scheme_xhttp": "vless://..."
   }
   ```

**Root Causes:**

| Cause | Fix |
|-------|-----|
| accounts.svc.plus not returning URI schemes | Check `user_agents.go` is calling `xrayconfig.VLESSXHTTPScheme()` and `xrayconfig.VLESSTCPScheme()` |
| URI scheme files missing from binary | Ensure `VLESS-TCP-URI.Scheme` and `VLESS-XHTTP-URI.Scheme` exist and are embedded via `//go:embed` |
| API proxy not working | Check console.svc.plus API proxy configuration for `/api/agent/*` routes |

### Issue 2: Copy Link Returns Empty

**Symptoms:**
- Click "Copy Link" button
- Nothing is copied to clipboard
- Or error in console

**Diagnosis:**

Check if `buildVlessUri()` is returning null:
```javascript
// In browser console
console.log(vlessUri)  // Should be a string starting with "vless://"
```

**Root Causes:**

Same as Issue 1 - missing URI schemes from server.

### Issue 3: Switching TCP/XHTTP Doesn't Update QR

**Symptoms:**
- Click TCP or XHTTP button
- QR code doesn't change

**Diagnosis:**

This should work automatically via React state. Check:
1. `preferredTransport` state is updating
2. `effectiveNode` is recomputing
3. `vlessUri` is changing
4. QR code `useEffect` is triggering

**Root Cause:**

Likely a React rendering issue, not related to URI scheme logic.

### Issue 4: Node Selector Not Showing

**Symptoms:**
- Only one node shown even though multiple agents are registered
- Node selector dropdown doesn't appear

**Diagnosis:**

1. Check `/api/agent/nodes` returns multiple nodes:
   ```bash
   curl -H "Authorization: Bearer <token>" \
     https://accounts.svc.plus/api/agent/nodes | jq 'length'
   ```

2. Check agent.svc.plus has registered multiple nodes

**Root Causes:**

| Cause | Fix |
|-------|-----|
| Only one agent registered | Register more agents via agent.svc.plus |
| `XRAY_PROXY_NODES` env var only has one host | Add more hosts to env var in accounts.svc.plus |
| Agent registration not working | Check agent.svc.plus heartbeat and registration logic |

## Debugging Steps

### Step 1: Verify Backend URI Schemes

```bash
# SSH into accounts.svc.plus container
cd /app/internal/xrayconfig

# Check scheme files exist
ls -la VLESS-*.Scheme

# View TCP scheme
cat VLESS-TCP-URI.Scheme
# Expected: vless://${UUID}@${DOMAIN}:1443?encryption=none&type=tcp&security=tls&sni=${SNI}&fp=${FP}&flow=${FLOW}#${TAG}

# View XHTTP scheme  
cat VLESS-XHTTP-URI.Scheme
# Expected: vless://${UUID}@${DOMAIN}:443?encryption=none&type=xhttp&security=tls&host=${DOMAIN}&path=${PATH}&mode=${MODE}&sni=${SNI}&fp=${FP}&alpn=h2%2Chttp%2F1.1%2Ch3#${TAG}
```

### Step 2: Test API Endpoint

```bash
# Get auth token from browser (check cookies or localStorage)
TOKEN="your-session-token"

# Test nodes endpoint
curl -H "Cookie: xc_session=$TOKEN" \
  https://console.svc.plus/api/agent/nodes | jq '.'

# Should return array with uri_scheme_tcp and uri_scheme_xhttp fields
```

### Step 3: Check Frontend Logs

Open browser DevTools Console and look for:

```
✅ Good:
(no [VLESS] errors)

❌ Bad:
[VLESS] Cannot build URI: node is undefined
[VLESS] Missing URI scheme template from server for transport: tcp. Node: TOKYO-NODE. Please ensure accounts.svc.plus is returning uri_scheme_tcp and uri_scheme_xhttp fields.
```

### Step 4: Verify QR Code Generation

```javascript
// In browser console, test QR generation manually
import { toDataURL } from 'qrcode'

const testUri = 'vless://test-uuid@example.com:1443?encryption=none&type=tcp&security=tls#TEST'

toDataURL(testUri, {
  errorCorrectionLevel: 'M',
  margin: 1,
  scale: 8,
}).then(url => console.log('QR generated:', url))
```

## Code References

### Frontend (console.svc.plus)

- **Main logic:** `src/modules/extensions/builtin/user-center/lib/vless.ts`
  - `buildVlessUri()` - Renders URI from server template
  - `renderVlessUriFromScheme()` - Template variable substitution

- **UI component:** `src/modules/extensions/builtin/user-center/components/VlessQrCard.tsx`
  - Fetches nodes from `/api/agent/nodes`
  - Manages TCP/XHTTP transport switching
  - Generates QR code via `toDataURL()`

### Backend (accounts.svc.plus)

- **URI schemes:** `internal/xrayconfig/VLESS-TCP-URI.Scheme`, `VLESS-XHTTP-URI.Scheme`
- **Template loading:** `internal/xrayconfig/templates.go`
  - `VLESSTCPScheme()` - Returns TCP URI template
  - `VLESSXHTTPScheme()` - Returns XHTTP URI template

- **API handler:** `api/user_agents.go`
  - `listAgentNodes()` - Returns node list with rendered URI schemes
  - `renderVLESSURIScheme()` - Substitutes template variables

## Environment Variables

### accounts.svc.plus

| Variable | Purpose | Example |
|----------|---------|---------|
| `XRAY_PROXY_NODES` | Additional proxy nodes | `ha-proxy-jp.svc.plus,ha-proxy-us.svc.plus` |
| `XRAY_XHTTP_PATH` | XHTTP path | `/split` |
| `XRAY_XHTTP_MODE` | XHTTP mode | `auto` |
| `XRAY_XHTTP_PORT` | XHTTP port | `443` |
| `XRAY_TCP_PORT` | TCP port | `1443` |

## Recovery Procedures

### Procedure 1: Fix Missing URI Schemes

If URI schemes are missing from API response:

1. Check scheme files exist in accounts.svc.plus:
   ```bash
   ls internal/xrayconfig/VLESS-*.Scheme
   ```

2. Rebuild accounts.svc.plus to embed schemes:
   ```bash
   cd /Users/shenlan/workspaces/cloud-neutral-toolkit/accounts.svc.plus
   go build -o accounts-svc-plus
   ```

3. Redeploy accounts.svc.plus

4. Verify schemes are returned:
   ```bash
   curl https://accounts.svc.plus/api/agent/nodes | jq '.[0].uri_scheme_tcp'
   ```

### Procedure 2: Reset Frontend State

If QR code is stuck:

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R on Mac)
3. Check for console errors
4. Verify `/api/agent/nodes` returns valid data

## Monitoring

### Key Metrics

- **QR Code Generation Success Rate:** Track `toDataURL()` success/failure
- **API Response Time:** `/api/agent/nodes` latency
- **Error Rate:** Count of `[VLESS]` console errors

### Alerts

Set up alerts for:
- High rate of `[VLESS] Missing URI scheme` errors
- `/api/agent/nodes` returning empty array
- QR code generation failures

## Related Documentation

- [VLESS Protocol Specification](https://github.com/XTLS/Xray-core)
- [Implementation Plan](file:///Users/shenlan/.gemini/antigravity/brain/57f5a000-a95d-484c-999d-ac7b60bfa953/implementation_plan.md)
- [Walkthrough](file:///Users/shenlan/.gemini/antigravity/brain/57f5a000-a95d-484c-999d-ac7b60bfa953/walkthrough.md)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-04 | Removed fallback URI construction logic | System |
| 2026-02-04 | Added error logging for missing URI schemes | System |
| 2026-02-04 | Created troubleshooting runbook | System |
