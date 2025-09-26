import { app } from "./app";

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${PORT}`);
});