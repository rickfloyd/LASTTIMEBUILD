# U.S. Compliance Architecture

This document outlines the technical architecture for our plug-in engine system, designed to be fully compliant and user-controlled.

## 1. Core Concept

Each engine becomes a plug-in with a Boolean flag in the user’s profile document.

*A neon graphic of an AI engine.*

```json
"userEngines": {
  "marketBridge": true,
  "automationConnector": false,
  "patternLab": true,
  "aiAnalyzer": false,
  "riskVisualizer": true
}
```

So when a user loads any chart—Area, Renko, Volume, etc.—the backend checks their preferences and activates only the approved engines.

## 2. Firebase / Firestore Structure

User preferences are stored in a dedicated `activeEngines` object within their user document.

**Collection:** `users`

**Document:** `{uid}`

```json
{
  "email": "user@example.com",
  "preferredTheme": "neon-dark",
  "activeEngines": {
    "marketBridge": true,
    "patternLab": true,
    "aiAnalyzer": false
  }
}
```

This makes it easy to query and toggle:

```javascript
// Read preferences
const userDoc = await getDoc(doc(db, "users", uid));
const activeEngines = userDoc.data().activeEngines;

// Update a preference
await updateDoc(doc(db, "users", uid), {
  [`activeEngines.${engineId}`]: newValue,
});
```

## 3. User-Side Controls

On every chart panel, a floating “Engines” toggle menu will be available, allowing users to enable or disable engines on the fly.

```jsx
<EngineToggle
  options={[
    { id: "marketBridge", name: "Market Data Bridge" },
    { id: "patternLab", name: "Pattern Recognition Lab" },
    { id: "aiAnalyzer", name: "AI Market Analyzer" },
  ]}
  userEngines={activeEngines}
  onToggle={(id, value) => updateEnginePref(id, value)}
/>
```

Each toggle simply updates the user’s `activeEngines` object in Firestore—no advice, no automation.

## 4. Backend Activation

When a chart loads, your API route reads the user's engine flags and applies the corresponding data transformations sequentially.

```javascript
// Example: pages/api/chartData.ts
import { getUserEngines } from "../../lib/userUtils";
import { runMarketBridge, runPatternLab } from "../../engines";

export default async function handler(req, res) {
  const { uid, chartType } = req.query;
  const engines = await getUserEngines(uid);

  let data = await runMarketBridge(chartType);

  if (engines.patternLab) data = await runPatternLab(data);
  if (engines.aiAnalyzer) data = await runAIAnalyzer(data);

  res.status(200).json(data);
}
```

## 5. Compliance & UX

- Every toggle is labeled: “For informational use only — no trade execution.”
- Engines are kept within the Data / Research namespace.
- A visual cue (🟢 Active / ⚪ Off) provides clarity.

## 6. Benefits

- Users can personalize their workspace.
- You can expand to hundreds of optional engines without clutter.
- Legal safety: nothing executes automatically; everything is user-controlled.
