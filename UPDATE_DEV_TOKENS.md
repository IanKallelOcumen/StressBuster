# 💎 Update Dev Account Tokens

## Quick Method (Browser Console)

1. **Log in** to the app as `whatthe@whatthe.com`
2. **Open browser console** (F12 or Right-click → Inspect → Console)
3. **Run this command:**
   ```javascript
   window.updateDevTokens(5000)
   ```
4. **Done!** Your tokens will be updated to 5000.

## Alternative: Direct Firestore Update

If the function above doesn't work, you can run this directly in the browser console:

```javascript
(async function() {
  const user = window.__FIREBASE_AUTH__?.currentUser || 
                (await import('firebase/auth')).getAuth().currentUser;
  
  if (!user || user.email !== 'whatthe@whatthe.com') {
    console.error('Please log in as whatthe@whatthe.com first');
    return;
  }
  
  // Get Firebase instances from the app
  // This will work if Firebase is already initialized
  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
  const db = getFirestore();
  const appId = '1:1029721176047:web:6eb6ec3ecf042bbe78281a';
  
  const profileRef = doc(db, `artifacts/${appId}/users/${user.uid}/data/profile`);
  await updateDoc(profileRef, { zenTokens: 5000 });
  
  console.log('✅ Tokens updated! Refresh the page to see changes.');
})();
```

## Manual Update via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `stressbuster-app`
3. Go to Firestore Database
4. Navigate to: `artifacts/1:1029721176047:web:6eb6ec3ecf042bbe78281a/users/{USER_UID}/data/profile`
5. Find the user with email `whatthe@whatthe.com`
6. Edit the `zenTokens` field and set it to `5000`
7. Save

## Notes

- The `window.updateDevTokens()` function is automatically available when logged in as the dev account
- It will only work for `whatthe@whatthe.com` email
- Default amount is 5000, but you can specify a different amount: `window.updateDevTokens(10000)`
- The function updates both Firestore and local state, so you should see the change immediately
