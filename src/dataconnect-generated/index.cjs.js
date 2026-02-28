const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'stressbuster',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddJournalEntry', inputVars);
}
addJournalEntryRef.operationName = 'AddJournalEntry';
exports.addJournalEntryRef = addJournalEntryRef;

exports.addJournalEntry = function addJournalEntry(dcOrVars, vars) {
  return executeMutation(addJournalEntryRef(dcOrVars, vars));
};

const updateJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJournalEntry', inputVars);
}
updateJournalEntryRef.operationName = 'UpdateJournalEntry';
exports.updateJournalEntryRef = updateJournalEntryRef;

exports.updateJournalEntry = function updateJournalEntry(dcOrVars, vars) {
  return executeMutation(updateJournalEntryRef(dcOrVars, vars));
};

const deleteJournalEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteJournalEntry', inputVars);
}
deleteJournalEntryRef.operationName = 'DeleteJournalEntry';
exports.deleteJournalEntryRef = deleteJournalEntryRef;

exports.deleteJournalEntry = function deleteJournalEntry(dcOrVars, vars) {
  return executeMutation(deleteJournalEntryRef(dcOrVars, vars));
};

const addMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMoodEntry', inputVars);
}
addMoodEntryRef.operationName = 'AddMoodEntry';
exports.addMoodEntryRef = addMoodEntryRef;

exports.addMoodEntry = function addMoodEntry(dcOrVars, vars) {
  return executeMutation(addMoodEntryRef(dcOrVars, vars));
};

const updateMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMoodEntry', inputVars);
}
updateMoodEntryRef.operationName = 'UpdateMoodEntry';
exports.updateMoodEntryRef = updateMoodEntryRef;

exports.updateMoodEntry = function updateMoodEntry(dcOrVars, vars) {
  return executeMutation(updateMoodEntryRef(dcOrVars, vars));
};

const deleteMoodEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMoodEntry', inputVars);
}
deleteMoodEntryRef.operationName = 'DeleteMoodEntry';
exports.deleteMoodEntryRef = deleteMoodEntryRef;

exports.deleteMoodEntry = function deleteMoodEntry(dcOrVars, vars) {
  return executeMutation(deleteMoodEntryRef(dcOrVars, vars));
};

const addMeditationSessionCustomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeditationSessionCustom', inputVars);
}
addMeditationSessionCustomRef.operationName = 'AddMeditationSessionCustom';
exports.addMeditationSessionCustomRef = addMeditationSessionCustomRef;

exports.addMeditationSessionCustom = function addMeditationSessionCustom(dcOrVars, vars) {
  return executeMutation(addMeditationSessionCustomRef(dcOrVars, vars));
};

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const getMyJournalEntriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyJournalEntries');
}
getMyJournalEntriesRef.operationName = 'GetMyJournalEntries';
exports.getMyJournalEntriesRef = getMyJournalEntriesRef;

exports.getMyJournalEntries = function getMyJournalEntries(dc) {
  return executeQuery(getMyJournalEntriesRef(dc));
};

const addMeditationSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeditationSession', inputVars);
}
addMeditationSessionRef.operationName = 'AddMeditationSession';
exports.addMeditationSessionRef = addMeditationSessionRef;

exports.addMeditationSession = function addMeditationSession(dcOrVars, vars) {
  return executeMutation(addMeditationSessionRef(dcOrVars, vars));
};

const listSoundscapesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSoundscapes');
}
listSoundscapesRef.operationName = 'ListSoundscapes';
exports.listSoundscapesRef = listSoundscapesRef;

exports.listSoundscapes = function listSoundscapes(dc) {
  return executeQuery(listSoundscapesRef(dc));
};
