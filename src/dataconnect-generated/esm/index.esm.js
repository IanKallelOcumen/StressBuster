import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'stressbuster',
  location: 'us-east4'
};

export const addJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddJournalEntry', inputVars);
}
addJournalEntryRef.operationName = 'AddJournalEntry';

export function addJournalEntry(dcOrVars, vars) {
  return executeMutation(addJournalEntryRef(dcOrVars, vars));
}

export const updateJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJournalEntry', inputVars);
}
updateJournalEntryRef.operationName = 'UpdateJournalEntry';

export function updateJournalEntry(dcOrVars, vars) {
  return executeMutation(updateJournalEntryRef(dcOrVars, vars));
}

export const deleteJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteJournalEntry', inputVars);
}
deleteJournalEntryRef.operationName = 'DeleteJournalEntry';

export function deleteJournalEntry(dcOrVars, vars) {
  return executeMutation(deleteJournalEntryRef(dcOrVars, vars));
}

export const addMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMoodEntry', inputVars);
}
addMoodEntryRef.operationName = 'AddMoodEntry';

export function addMoodEntry(dcOrVars, vars) {
  return executeMutation(addMoodEntryRef(dcOrVars, vars));
}

export const updateMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMoodEntry', inputVars);
}
updateMoodEntryRef.operationName = 'UpdateMoodEntry';

export function updateMoodEntry(dcOrVars, vars) {
  return executeMutation(updateMoodEntryRef(dcOrVars, vars));
}

export const deleteMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMoodEntry', inputVars);
}
deleteMoodEntryRef.operationName = 'DeleteMoodEntry';

export function deleteMoodEntry(dcOrVars, vars) {
  return executeMutation(deleteMoodEntryRef(dcOrVars, vars));
}

export const addMeditationSessionCustomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeditationSessionCustom', inputVars);
}
addMeditationSessionCustomRef.operationName = 'AddMeditationSessionCustom';

export function addMeditationSessionCustom(dcOrVars, vars) {
  return executeMutation(addMeditationSessionCustomRef(dcOrVars, vars));
}

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const getMyJournalEntriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyJournalEntries');
}
getMyJournalEntriesRef.operationName = 'GetMyJournalEntries';

export function getMyJournalEntries(dc) {
  return executeQuery(getMyJournalEntriesRef(dc));
}

export const addMeditationSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeditationSession', inputVars);
}
addMeditationSessionRef.operationName = 'AddMeditationSession';

export function addMeditationSession(dcOrVars, vars) {
  return executeMutation(addMeditationSessionRef(dcOrVars, vars));
}

export const listSoundscapesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSoundscapes');
}
listSoundscapesRef.operationName = 'ListSoundscapes';

export function listSoundscapes(dc) {
  return executeQuery(listSoundscapesRef(dc));
}

