# easy global store

## usage


```typescript:index.tsx
type State = {
  id: number;
  name: string;
}

const initialState = {
  id: 0,
  name: ""
}
```

```typescript:pages/index.tsx
import React from "react";
import { Provider } from "../../store";
import { Form } from "../components/Form";

export default Home() {
  return (
    <Provider>
      <Form />
    </Provider>
  )
}
```


```typescript:components/Form.tsx
import React, { Fragment } from "react";
import { useStore } from "../../store";

export function Form() {
  const [store, setStore] = useStore();

  return (
    <Fragment>
      <input
        type="number"
        value={store.id}
        onChange={(e) => setStore({ id: parseInt(e.target.value, 10)})}
      />
      <input
        type="text"
        value={store.name}
        onChange={(e) => setStore({ name: e.target.value })}
      />

      <p>id: {store.id}</p>
      <p>name: {store.name}</p>
    </Fragment>
  )
}
```
