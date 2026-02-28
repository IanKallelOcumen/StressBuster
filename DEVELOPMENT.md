# StressBuster Development Guide

## Environment Setup
StressBuster supports multiple environments within a single Firebase project to facilitate safe development and testing.

### Environments
- **Production (`prod`)**: The default live environment. Data is stored in `artifacts/...`.
- **Development (`dev`)**: For active development. Data is stored in `dev_artifacts/...`.
- **Staging (`stage`)**: For pre-release testing. Data is stored in `stage_artifacts/...`.

### Switching Environments
1. Open the app.
2. Trigger the **Developer Overlay**:
   - **Web**: Press `Ctrl + F` (or `Cmd + F` on Mac).
   - **Mobile**: Long press the invisible trigger area in the top-right corner of the screen (2 seconds).
3. Use the "Environment" chips to switch modes.
4. The app will immediately start reading/writing to the selected environment's paths.

## AI Diagnostics
The Developer Overlay includes an **AI Data Integrity Check** powered by Gemini.
- Click "Run Diagnostics" to have the AI analyze the current user profile for anomalies (e.g., impossible streak values, missing fields).
- Results are displayed directly in the overlay with optimization suggestions.

## Adding New Features
When adding new Firestore interactions, always use the `useDev` hook:

```javascript
import { useDev } from '../../context/DevContext';

const MyComponent = () => {
  const { getPath } = useDev();
  
  const saveData = async () => {
    // Automatically prefixes path with 'dev_' or 'stage_' if needed
    const path = getPath('artifacts/my-app/data');
    await addDoc(collection(db, path), { ... });
  };
}
```

## Security
- **Authentication**: All environments currently share the same Authentication users.
- **Storage**: Storage paths are not yet environment-scoped by default but can be manually prefixed using `getPath`.
- **Rules**: Ensure `firestore.rules` allows read/write to `dev_*` and `stage_*` collections for authenticated users.

## Testing
- **Unit Tests**: Run `npm test`.
- **Integration**: Switch to `dev` mode and manually verify flows.
