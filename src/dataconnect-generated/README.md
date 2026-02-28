# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyJournalEntries*](#getmyjournalentries)
  - [*ListSoundscapes*](#listsoundscapes)
- [**Mutations**](#mutations)
  - [*AddJournalEntry*](#addjournalentry)
  - [*UpdateJournalEntry*](#updatejournalentry)
  - [*DeleteJournalEntry*](#deletejournalentry)
  - [*AddMoodEntry*](#addmoodentry)
  - [*UpdateMoodEntry*](#updatemoodentry)
  - [*DeleteMoodEntry*](#deletemoodentry)
  - [*AddMeditationSessionCustom*](#addmeditationsessioncustom)
  - [*CreateUser*](#createuser)
  - [*AddMeditationSession*](#addmeditationsession)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyJournalEntries
You can execute the `GetMyJournalEntries` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyJournalEntries(): QueryPromise<GetMyJournalEntriesData, undefined>;

interface GetMyJournalEntriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyJournalEntriesData, undefined>;
}
export const getMyJournalEntriesRef: GetMyJournalEntriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyJournalEntries(dc: DataConnect): QueryPromise<GetMyJournalEntriesData, undefined>;

interface GetMyJournalEntriesRef {
  ...
  (dc: DataConnect): QueryRef<GetMyJournalEntriesData, undefined>;
}
export const getMyJournalEntriesRef: GetMyJournalEntriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyJournalEntriesRef:
```typescript
const name = getMyJournalEntriesRef.operationName;
console.log(name);
```

### Variables
The `GetMyJournalEntries` query has no variables.
### Return Type
Recall that executing the `GetMyJournalEntries` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyJournalEntriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyJournalEntriesData {
  journalEntries: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    moodTag?: string | null;
    associatedActivity?: string | null;
  } & JournalEntry_Key)[];
}
```
### Using `GetMyJournalEntries`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyJournalEntries } from '@dataconnect/generated';


// Call the `getMyJournalEntries()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyJournalEntries();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyJournalEntries(dataConnect);

console.log(data.journalEntries);

// Or, you can use the `Promise` API.
getMyJournalEntries().then((response) => {
  const data = response.data;
  console.log(data.journalEntries);
});
```

### Using `GetMyJournalEntries`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyJournalEntriesRef } from '@dataconnect/generated';


// Call the `getMyJournalEntriesRef()` function to get a reference to the query.
const ref = getMyJournalEntriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyJournalEntriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.journalEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntries);
});
```

## ListSoundscapes
You can execute the `ListSoundscapes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSoundscapes(): QueryPromise<ListSoundscapesData, undefined>;

interface ListSoundscapesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSoundscapesData, undefined>;
}
export const listSoundscapesRef: ListSoundscapesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSoundscapes(dc: DataConnect): QueryPromise<ListSoundscapesData, undefined>;

interface ListSoundscapesRef {
  ...
  (dc: DataConnect): QueryRef<ListSoundscapesData, undefined>;
}
export const listSoundscapesRef: ListSoundscapesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSoundscapesRef:
```typescript
const name = listSoundscapesRef.operationName;
console.log(name);
```

### Variables
The `ListSoundscapes` query has no variables.
### Return Type
Recall that executing the `ListSoundscapes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSoundscapesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSoundscapesData {
  soundscapes: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    description?: string | null;
    durationInSeconds: number;
    fileUrl: string;
  } & Soundscape_Key)[];
}
```
### Using `ListSoundscapes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSoundscapes } from '@dataconnect/generated';


// Call the `listSoundscapes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSoundscapes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSoundscapes(dataConnect);

console.log(data.soundscapes);

// Or, you can use the `Promise` API.
listSoundscapes().then((response) => {
  const data = response.data;
  console.log(data.soundscapes);
});
```

### Using `ListSoundscapes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSoundscapesRef } from '@dataconnect/generated';


// Call the `listSoundscapesRef()` function to get a reference to the query.
const ref = listSoundscapesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSoundscapesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.soundscapes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.soundscapes);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddJournalEntry
You can execute the `AddJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addJournalEntry(vars: AddJournalEntryVariables): MutationPromise<AddJournalEntryData, AddJournalEntryVariables>;

interface AddJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddJournalEntryVariables): MutationRef<AddJournalEntryData, AddJournalEntryVariables>;
}
export const addJournalEntryRef: AddJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addJournalEntry(dc: DataConnect, vars: AddJournalEntryVariables): MutationPromise<AddJournalEntryData, AddJournalEntryVariables>;

interface AddJournalEntryRef {
  ...
  (dc: DataConnect, vars: AddJournalEntryVariables): MutationRef<AddJournalEntryData, AddJournalEntryVariables>;
}
export const addJournalEntryRef: AddJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addJournalEntryRef:
```typescript
const name = addJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `AddJournalEntry` mutation requires an argument of type `AddJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddJournalEntryVariables {
  title: string;
  content: string;
  moodTag?: string | null;
  associatedActivity?: string | null;
}
```
### Return Type
Recall that executing the `AddJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddJournalEntryData {
  journalEntry_insert: JournalEntry_Key;
}
```
### Using `AddJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addJournalEntry, AddJournalEntryVariables } from '@dataconnect/generated';

// The `AddJournalEntry` mutation requires an argument of type `AddJournalEntryVariables`:
const addJournalEntryVars: AddJournalEntryVariables = {
  title: ..., 
  content: ..., 
  moodTag: ..., // optional
  associatedActivity: ..., // optional
};

// Call the `addJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addJournalEntry(addJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await addJournalEntry({ title: ..., content: ..., moodTag: ..., associatedActivity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addJournalEntry(dataConnect, addJournalEntryVars);

console.log(data.journalEntry_insert);

// Or, you can use the `Promise` API.
addJournalEntry(addJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_insert);
});
```

### Using `AddJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addJournalEntryRef, AddJournalEntryVariables } from '@dataconnect/generated';

// The `AddJournalEntry` mutation requires an argument of type `AddJournalEntryVariables`:
const addJournalEntryVars: AddJournalEntryVariables = {
  title: ..., 
  content: ..., 
  moodTag: ..., // optional
  associatedActivity: ..., // optional
};

// Call the `addJournalEntryRef()` function to get a reference to the mutation.
const ref = addJournalEntryRef(addJournalEntryVars);
// Variables can be defined inline as well.
const ref = addJournalEntryRef({ title: ..., content: ..., moodTag: ..., associatedActivity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addJournalEntryRef(dataConnect, addJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_insert);
});
```

## UpdateJournalEntry
You can execute the `UpdateJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJournalEntry(vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface UpdateJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJournalEntry(dc: DataConnect, vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface UpdateJournalEntryRef {
  ...
  (dc: DataConnect, vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJournalEntryRef:
```typescript
const name = updateJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJournalEntryVariables {
  id: UUIDString;
  title?: string | null;
  content?: string | null;
  moodTag?: string | null;
  associatedActivity?: string | null;
}
```
### Return Type
Recall that executing the `UpdateJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJournalEntryData {
  journalEntry_update?: JournalEntry_Key | null;
}
```
### Using `UpdateJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJournalEntry, UpdateJournalEntryVariables } from '@dataconnect/generated';

// The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`:
const updateJournalEntryVars: UpdateJournalEntryVariables = {
  id: ..., 
  title: ..., // optional
  content: ..., // optional
  moodTag: ..., // optional
  associatedActivity: ..., // optional
};

// Call the `updateJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJournalEntry(updateJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await updateJournalEntry({ id: ..., title: ..., content: ..., moodTag: ..., associatedActivity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJournalEntry(dataConnect, updateJournalEntryVars);

console.log(data.journalEntry_update);

// Or, you can use the `Promise` API.
updateJournalEntry(updateJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_update);
});
```

### Using `UpdateJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJournalEntryRef, UpdateJournalEntryVariables } from '@dataconnect/generated';

// The `UpdateJournalEntry` mutation requires an argument of type `UpdateJournalEntryVariables`:
const updateJournalEntryVars: UpdateJournalEntryVariables = {
  id: ..., 
  title: ..., // optional
  content: ..., // optional
  moodTag: ..., // optional
  associatedActivity: ..., // optional
};

// Call the `updateJournalEntryRef()` function to get a reference to the mutation.
const ref = updateJournalEntryRef(updateJournalEntryVars);
// Variables can be defined inline as well.
const ref = updateJournalEntryRef({ id: ..., title: ..., content: ..., moodTag: ..., associatedActivity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJournalEntryRef(dataConnect, updateJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_update);
});
```

## DeleteJournalEntry
You can execute the `DeleteJournalEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteJournalEntry(vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface DeleteJournalEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteJournalEntry(dc: DataConnect, vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface DeleteJournalEntryRef {
  ...
  (dc: DataConnect, vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteJournalEntryRef:
```typescript
const name = deleteJournalEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteJournalEntryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteJournalEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteJournalEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteJournalEntryData {
  journalEntry_delete?: JournalEntry_Key | null;
}
```
### Using `DeleteJournalEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteJournalEntry, DeleteJournalEntryVariables } from '@dataconnect/generated';

// The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`:
const deleteJournalEntryVars: DeleteJournalEntryVariables = {
  id: ..., 
};

// Call the `deleteJournalEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteJournalEntry(deleteJournalEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteJournalEntry({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteJournalEntry(dataConnect, deleteJournalEntryVars);

console.log(data.journalEntry_delete);

// Or, you can use the `Promise` API.
deleteJournalEntry(deleteJournalEntryVars).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_delete);
});
```

### Using `DeleteJournalEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteJournalEntryRef, DeleteJournalEntryVariables } from '@dataconnect/generated';

// The `DeleteJournalEntry` mutation requires an argument of type `DeleteJournalEntryVariables`:
const deleteJournalEntryVars: DeleteJournalEntryVariables = {
  id: ..., 
};

// Call the `deleteJournalEntryRef()` function to get a reference to the mutation.
const ref = deleteJournalEntryRef(deleteJournalEntryVars);
// Variables can be defined inline as well.
const ref = deleteJournalEntryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteJournalEntryRef(dataConnect, deleteJournalEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.journalEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.journalEntry_delete);
});
```

## AddMoodEntry
You can execute the `AddMoodEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addMoodEntry(vars: AddMoodEntryVariables): MutationPromise<AddMoodEntryData, AddMoodEntryVariables>;

interface AddMoodEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMoodEntryVariables): MutationRef<AddMoodEntryData, AddMoodEntryVariables>;
}
export const addMoodEntryRef: AddMoodEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addMoodEntry(dc: DataConnect, vars: AddMoodEntryVariables): MutationPromise<AddMoodEntryData, AddMoodEntryVariables>;

interface AddMoodEntryRef {
  ...
  (dc: DataConnect, vars: AddMoodEntryVariables): MutationRef<AddMoodEntryData, AddMoodEntryVariables>;
}
export const addMoodEntryRef: AddMoodEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addMoodEntryRef:
```typescript
const name = addMoodEntryRef.operationName;
console.log(name);
```

### Variables
The `AddMoodEntry` mutation requires an argument of type `AddMoodEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddMoodEntryVariables {
  moodRating: number;
  stressLevel: number;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AddMoodEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddMoodEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddMoodEntryData {
  moodEntry_insert: MoodEntry_Key;
}
```
### Using `AddMoodEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addMoodEntry, AddMoodEntryVariables } from '@dataconnect/generated';

// The `AddMoodEntry` mutation requires an argument of type `AddMoodEntryVariables`:
const addMoodEntryVars: AddMoodEntryVariables = {
  moodRating: ..., 
  stressLevel: ..., 
  notes: ..., // optional
};

// Call the `addMoodEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addMoodEntry(addMoodEntryVars);
// Variables can be defined inline as well.
const { data } = await addMoodEntry({ moodRating: ..., stressLevel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addMoodEntry(dataConnect, addMoodEntryVars);

console.log(data.moodEntry_insert);

// Or, you can use the `Promise` API.
addMoodEntry(addMoodEntryVars).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_insert);
});
```

### Using `AddMoodEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addMoodEntryRef, AddMoodEntryVariables } from '@dataconnect/generated';

// The `AddMoodEntry` mutation requires an argument of type `AddMoodEntryVariables`:
const addMoodEntryVars: AddMoodEntryVariables = {
  moodRating: ..., 
  stressLevel: ..., 
  notes: ..., // optional
};

// Call the `addMoodEntryRef()` function to get a reference to the mutation.
const ref = addMoodEntryRef(addMoodEntryVars);
// Variables can be defined inline as well.
const ref = addMoodEntryRef({ moodRating: ..., stressLevel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addMoodEntryRef(dataConnect, addMoodEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.moodEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_insert);
});
```

## UpdateMoodEntry
You can execute the `UpdateMoodEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMoodEntry(vars: UpdateMoodEntryVariables): MutationPromise<UpdateMoodEntryData, UpdateMoodEntryVariables>;

interface UpdateMoodEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMoodEntryVariables): MutationRef<UpdateMoodEntryData, UpdateMoodEntryVariables>;
}
export const updateMoodEntryRef: UpdateMoodEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMoodEntry(dc: DataConnect, vars: UpdateMoodEntryVariables): MutationPromise<UpdateMoodEntryData, UpdateMoodEntryVariables>;

interface UpdateMoodEntryRef {
  ...
  (dc: DataConnect, vars: UpdateMoodEntryVariables): MutationRef<UpdateMoodEntryData, UpdateMoodEntryVariables>;
}
export const updateMoodEntryRef: UpdateMoodEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMoodEntryRef:
```typescript
const name = updateMoodEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateMoodEntry` mutation requires an argument of type `UpdateMoodEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMoodEntryVariables {
  id: UUIDString;
  moodRating?: number | null;
  stressLevel?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMoodEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMoodEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMoodEntryData {
  moodEntry_update?: MoodEntry_Key | null;
}
```
### Using `UpdateMoodEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMoodEntry, UpdateMoodEntryVariables } from '@dataconnect/generated';

// The `UpdateMoodEntry` mutation requires an argument of type `UpdateMoodEntryVariables`:
const updateMoodEntryVars: UpdateMoodEntryVariables = {
  id: ..., 
  moodRating: ..., // optional
  stressLevel: ..., // optional
  notes: ..., // optional
};

// Call the `updateMoodEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMoodEntry(updateMoodEntryVars);
// Variables can be defined inline as well.
const { data } = await updateMoodEntry({ id: ..., moodRating: ..., stressLevel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMoodEntry(dataConnect, updateMoodEntryVars);

console.log(data.moodEntry_update);

// Or, you can use the `Promise` API.
updateMoodEntry(updateMoodEntryVars).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_update);
});
```

### Using `UpdateMoodEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMoodEntryRef, UpdateMoodEntryVariables } from '@dataconnect/generated';

// The `UpdateMoodEntry` mutation requires an argument of type `UpdateMoodEntryVariables`:
const updateMoodEntryVars: UpdateMoodEntryVariables = {
  id: ..., 
  moodRating: ..., // optional
  stressLevel: ..., // optional
  notes: ..., // optional
};

// Call the `updateMoodEntryRef()` function to get a reference to the mutation.
const ref = updateMoodEntryRef(updateMoodEntryVars);
// Variables can be defined inline as well.
const ref = updateMoodEntryRef({ id: ..., moodRating: ..., stressLevel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMoodEntryRef(dataConnect, updateMoodEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.moodEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_update);
});
```

## DeleteMoodEntry
You can execute the `DeleteMoodEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMoodEntry(vars: DeleteMoodEntryVariables): MutationPromise<DeleteMoodEntryData, DeleteMoodEntryVariables>;

interface DeleteMoodEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMoodEntryVariables): MutationRef<DeleteMoodEntryData, DeleteMoodEntryVariables>;
}
export const deleteMoodEntryRef: DeleteMoodEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMoodEntry(dc: DataConnect, vars: DeleteMoodEntryVariables): MutationPromise<DeleteMoodEntryData, DeleteMoodEntryVariables>;

interface DeleteMoodEntryRef {
  ...
  (dc: DataConnect, vars: DeleteMoodEntryVariables): MutationRef<DeleteMoodEntryData, DeleteMoodEntryVariables>;
}
export const deleteMoodEntryRef: DeleteMoodEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMoodEntryRef:
```typescript
const name = deleteMoodEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteMoodEntry` mutation requires an argument of type `DeleteMoodEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMoodEntryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMoodEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMoodEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMoodEntryData {
  moodEntry_delete?: MoodEntry_Key | null;
}
```
### Using `DeleteMoodEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMoodEntry, DeleteMoodEntryVariables } from '@dataconnect/generated';

// The `DeleteMoodEntry` mutation requires an argument of type `DeleteMoodEntryVariables`:
const deleteMoodEntryVars: DeleteMoodEntryVariables = {
  id: ..., 
};

// Call the `deleteMoodEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMoodEntry(deleteMoodEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteMoodEntry({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMoodEntry(dataConnect, deleteMoodEntryVars);

console.log(data.moodEntry_delete);

// Or, you can use the `Promise` API.
deleteMoodEntry(deleteMoodEntryVars).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_delete);
});
```

### Using `DeleteMoodEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMoodEntryRef, DeleteMoodEntryVariables } from '@dataconnect/generated';

// The `DeleteMoodEntry` mutation requires an argument of type `DeleteMoodEntryVariables`:
const deleteMoodEntryVars: DeleteMoodEntryVariables = {
  id: ..., 
};

// Call the `deleteMoodEntryRef()` function to get a reference to the mutation.
const ref = deleteMoodEntryRef(deleteMoodEntryVars);
// Variables can be defined inline as well.
const ref = deleteMoodEntryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMoodEntryRef(dataConnect, deleteMoodEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.moodEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.moodEntry_delete);
});
```

## AddMeditationSessionCustom
You can execute the `AddMeditationSessionCustom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addMeditationSessionCustom(vars: AddMeditationSessionCustomVariables): MutationPromise<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;

interface AddMeditationSessionCustomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMeditationSessionCustomVariables): MutationRef<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
}
export const addMeditationSessionCustomRef: AddMeditationSessionCustomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addMeditationSessionCustom(dc: DataConnect, vars: AddMeditationSessionCustomVariables): MutationPromise<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;

interface AddMeditationSessionCustomRef {
  ...
  (dc: DataConnect, vars: AddMeditationSessionCustomVariables): MutationRef<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
}
export const addMeditationSessionCustomRef: AddMeditationSessionCustomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addMeditationSessionCustomRef:
```typescript
const name = addMeditationSessionCustomRef.operationName;
console.log(name);
```

### Variables
The `AddMeditationSessionCustom` mutation requires an argument of type `AddMeditationSessionCustomVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddMeditationSessionCustomVariables {
  durationInMinutes: number;
  meditationType?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AddMeditationSessionCustom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddMeditationSessionCustomData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddMeditationSessionCustomData {
  meditationSession_insert: MeditationSession_Key;
}
```
### Using `AddMeditationSessionCustom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addMeditationSessionCustom, AddMeditationSessionCustomVariables } from '@dataconnect/generated';

// The `AddMeditationSessionCustom` mutation requires an argument of type `AddMeditationSessionCustomVariables`:
const addMeditationSessionCustomVars: AddMeditationSessionCustomVariables = {
  durationInMinutes: ..., 
  meditationType: ..., // optional
  notes: ..., // optional
};

// Call the `addMeditationSessionCustom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addMeditationSessionCustom(addMeditationSessionCustomVars);
// Variables can be defined inline as well.
const { data } = await addMeditationSessionCustom({ durationInMinutes: ..., meditationType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addMeditationSessionCustom(dataConnect, addMeditationSessionCustomVars);

console.log(data.meditationSession_insert);

// Or, you can use the `Promise` API.
addMeditationSessionCustom(addMeditationSessionCustomVars).then((response) => {
  const data = response.data;
  console.log(data.meditationSession_insert);
});
```

### Using `AddMeditationSessionCustom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addMeditationSessionCustomRef, AddMeditationSessionCustomVariables } from '@dataconnect/generated';

// The `AddMeditationSessionCustom` mutation requires an argument of type `AddMeditationSessionCustomVariables`:
const addMeditationSessionCustomVars: AddMeditationSessionCustomVariables = {
  durationInMinutes: ..., 
  meditationType: ..., // optional
  notes: ..., // optional
};

// Call the `addMeditationSessionCustomRef()` function to get a reference to the mutation.
const ref = addMeditationSessionCustomRef(addMeditationSessionCustomVars);
// Variables can be defined inline as well.
const ref = addMeditationSessionCustomRef({ durationInMinutes: ..., meditationType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addMeditationSessionCustomRef(dataConnect, addMeditationSessionCustomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.meditationSession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.meditationSession_insert);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  email: string;
  username: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  username: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ email: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  username: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ email: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## AddMeditationSession
You can execute the `AddMeditationSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addMeditationSession(vars: AddMeditationSessionVariables): MutationPromise<AddMeditationSessionData, AddMeditationSessionVariables>;

interface AddMeditationSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMeditationSessionVariables): MutationRef<AddMeditationSessionData, AddMeditationSessionVariables>;
}
export const addMeditationSessionRef: AddMeditationSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addMeditationSession(dc: DataConnect, vars: AddMeditationSessionVariables): MutationPromise<AddMeditationSessionData, AddMeditationSessionVariables>;

interface AddMeditationSessionRef {
  ...
  (dc: DataConnect, vars: AddMeditationSessionVariables): MutationRef<AddMeditationSessionData, AddMeditationSessionVariables>;
}
export const addMeditationSessionRef: AddMeditationSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addMeditationSessionRef:
```typescript
const name = addMeditationSessionRef.operationName;
console.log(name);
```

### Variables
The `AddMeditationSession` mutation requires an argument of type `AddMeditationSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddMeditationSessionVariables {
  durationInMinutes: number;
  startTime: TimestampString;
  meditationType?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AddMeditationSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddMeditationSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddMeditationSessionData {
  meditationSession_insert: MeditationSession_Key;
}
```
### Using `AddMeditationSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addMeditationSession, AddMeditationSessionVariables } from '@dataconnect/generated';

// The `AddMeditationSession` mutation requires an argument of type `AddMeditationSessionVariables`:
const addMeditationSessionVars: AddMeditationSessionVariables = {
  durationInMinutes: ..., 
  startTime: ..., 
  meditationType: ..., // optional
  notes: ..., // optional
};

// Call the `addMeditationSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addMeditationSession(addMeditationSessionVars);
// Variables can be defined inline as well.
const { data } = await addMeditationSession({ durationInMinutes: ..., startTime: ..., meditationType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addMeditationSession(dataConnect, addMeditationSessionVars);

console.log(data.meditationSession_insert);

// Or, you can use the `Promise` API.
addMeditationSession(addMeditationSessionVars).then((response) => {
  const data = response.data;
  console.log(data.meditationSession_insert);
});
```

### Using `AddMeditationSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addMeditationSessionRef, AddMeditationSessionVariables } from '@dataconnect/generated';

// The `AddMeditationSession` mutation requires an argument of type `AddMeditationSessionVariables`:
const addMeditationSessionVars: AddMeditationSessionVariables = {
  durationInMinutes: ..., 
  startTime: ..., 
  meditationType: ..., // optional
  notes: ..., // optional
};

// Call the `addMeditationSessionRef()` function to get a reference to the mutation.
const ref = addMeditationSessionRef(addMeditationSessionVars);
// Variables can be defined inline as well.
const ref = addMeditationSessionRef({ durationInMinutes: ..., startTime: ..., meditationType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addMeditationSessionRef(dataConnect, addMeditationSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.meditationSession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.meditationSession_insert);
});
```

