# QA Bug Report – Demo App

## Summary
This report documents the issues observed while testing the Demo App at http://localhost:3001. The app loads and login works, but there are several user-facing problems in the claims and real-time experience that affect trust and day-to-day usability.

## Test Context
- Date: 2026-10-30
- Environment: Local browser access to the Demo App
- Account used: admin@demo.com / Admin123!
- Pages reviewed: login, admin dashboard, admin claims page

## Key Findings

### 1) Real-time connection status is unreliable
The app shows a connection indicator that can switch to “Offline” or “Reconnecting…” even when the page is otherwise usable. This creates confusion because the UI suggests the live updates feature is broken even though the page is still open.

Impact:
- Users may lose confidence in the app’s current state
- Real-time updates may stop arriving when the connection drops briefly
- Admins may miss status changes on claims if the UI does not recover properly

Observed behaviour:
- After login, the app shows the status as “Live” at first.
- When navigating to the claims page, the status can still show as offline depending on the current connection state.
- The app does not clearly communicate whether the data is stale or just waiting for a reconnect.

### 2) Claims page can appear empty even while the app is running normally
The admin claims page sometimes shows “No claims found” with zero items despite the app being active and the admin being logged in.

Impact:
- Admin users may believe there are no claims in the system
- Important claim records may be hidden from the UI
- This can lead to missed follow-up on pending or approved claims

Observed behaviour:
- Logged in as admin
- Opened the claims page
- The UI displayed: “0 claims” and “No claims found”
- This happened without any clear error message or explanation

### 3) Real-time claim updates may process invalid status values
The WebSocket handling accepts claim update payloads and casts values to a known claim status type without strong validation. If the backend sends unexpected values or malformed payloads, the app can behave unpredictably.

Impact:
- Stale or incorrect statuses may be displayed
- Users can see wrong claim outcomes or transitions
- Debugging becomes harder because bad payloads are not clearly rejected or logged

### 4) Highlight timers can accumulate and cause memory issues
The app tracks recently-updated claims and uses timeouts to clear their highlight state. If many updates occur, those timers are not always cleaned up cleanly.

Impact:
- Slower UI behavior over time
- Potential memory growth in long-lived sessions
- Increased chance of visual glitches or delayed updates

### 5) Admin refresh failures are silently swallowed
When the app tries to refresh data after a real-time event, failed API calls are only logged to the console and not surfaced to the user.

Impact:
- Admins may not know the screen is stale
- A failed background request can leave the claims table outdated
- Users lose visibility into whether the app is currently synced

## Reproduction Steps
1. Open http://localhost:3001/login
2. Log in as admin@demo.com / Admin123!
3. Navigate to /admin/claims
4. Observe the page state and the connection indicator
5. Check whether the claims list updates live or remains empty despite app activity
6. Trigger or watch for a status update event to confirm whether the real-time pipeline is working correctly

## Severity
The issues are significant because they affect core product trust:
- Data can appear missing or stale
- Real-time updates are unreliable
- The app can misrepresent current system status

## Recommended Next Actions
1. Stabilize the WebSocket connection lifecycle and improve reconnect behavior
2. Validate all incoming WebSocket payloads before updating UI state
3. Ensure the claims page does not silently show empty results when the backend is available
4. Clean up timeout tracking to avoid memory buildup
5. Surface background refresh failures to the user with clear error messages

## Conclusion
The main problem is not a login failure or a hard crash. The main issue is that the app’s live data and claim views are not consistently trustworthy. This makes the user experience feel unreliable and could lead to missed claim actions in real deployments.
