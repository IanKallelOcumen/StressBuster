const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

exports.validateProfile = onDocumentWritten('artifacts/{appId}/users/{userId}/data/profile', async (event) => {
  const after = event.data?.after?.data();
  if (!after) return;
  const updates = {};
  if (typeof after.zenTokens === 'number') {
    updates.zenTokens = Math.min(Math.max(after.zenTokens, 0), 500);
  }
  if (typeof after.streak === 'number') {
    updates.streak = Math.max(after.streak, 0);
  }
  if (Object.keys(updates).length === 0) return;
  const db = getFirestore();
  await db.doc(event.data.after.ref.path).update(updates);
});
