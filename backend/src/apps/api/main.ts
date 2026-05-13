import "dotenv/config";
import { createApiApp } from "@api/app";

const port = Number(process.env.PORT ?? 3000);
const app = createApiApp();

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
