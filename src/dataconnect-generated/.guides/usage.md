# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useAddJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry, useAddMoodEntry, useUpdateMoodEntry, useDeleteMoodEntry, useAddMeditationSessionCustom, useCreateUser, useGetMyJournalEntries, useAddMeditationSession } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useAddJournalEntry(addJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useUpdateJournalEntry(updateJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useDeleteJournalEntry(deleteJournalEntryVars);

const { data, isPending, isSuccess, isError, error } = useAddMoodEntry(addMoodEntryVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMoodEntry(updateMoodEntryVars);

const { data, isPending, isSuccess, isError, error } = useDeleteMoodEntry(deleteMoodEntryVars);

const { data, isPending, isSuccess, isError, error } = useAddMeditationSessionCustom(addMeditationSessionCustomVars);

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useGetMyJournalEntries();

const { data, isPending, isSuccess, isError, error } = useAddMeditationSession(addMeditationSessionVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { addJournalEntry, updateJournalEntry, deleteJournalEntry, addMoodEntry, updateMoodEntry, deleteMoodEntry, addMeditationSessionCustom, createUser, getMyJournalEntries, addMeditationSession } from '@dataconnect/generated';


// Operation AddJournalEntry:  For variables, look at type AddJournalEntryVars in ../index.d.ts
const { data } = await AddJournalEntry(dataConnect, addJournalEntryVars);

// Operation UpdateJournalEntry:  For variables, look at type UpdateJournalEntryVars in ../index.d.ts
const { data } = await UpdateJournalEntry(dataConnect, updateJournalEntryVars);

// Operation DeleteJournalEntry:  For variables, look at type DeleteJournalEntryVars in ../index.d.ts
const { data } = await DeleteJournalEntry(dataConnect, deleteJournalEntryVars);

// Operation AddMoodEntry:  For variables, look at type AddMoodEntryVars in ../index.d.ts
const { data } = await AddMoodEntry(dataConnect, addMoodEntryVars);

// Operation UpdateMoodEntry:  For variables, look at type UpdateMoodEntryVars in ../index.d.ts
const { data } = await UpdateMoodEntry(dataConnect, updateMoodEntryVars);

// Operation DeleteMoodEntry:  For variables, look at type DeleteMoodEntryVars in ../index.d.ts
const { data } = await DeleteMoodEntry(dataConnect, deleteMoodEntryVars);

// Operation AddMeditationSessionCustom:  For variables, look at type AddMeditationSessionCustomVars in ../index.d.ts
const { data } = await AddMeditationSessionCustom(dataConnect, addMeditationSessionCustomVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation GetMyJournalEntries: 
const { data } = await GetMyJournalEntries(dataConnect);

// Operation AddMeditationSession:  For variables, look at type AddMeditationSessionVars in ../index.d.ts
const { data } = await AddMeditationSession(dataConnect, addMeditationSessionVars);


```