# Before going to production

- [ ] **Remove Reset Statistics** — In `app/(tabs)/index.jsx`: remove the "Reset Statistics" button (Profile tab), remove `resetStats` from `AuthContext.Provider` value, and remove the `resetStats` function. Users must not be able to reset their streak/tokens in production.
