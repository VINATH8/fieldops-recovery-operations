import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("       FIELDOPS API SERVER");
  console.log("======================================");
  console.log(`Server   : http://localhost:${PORT}`);
  console.log(`Health   : http://localhost:${PORT}/api/health`);
  console.log(`Manager  : http://localhost:${PORT}/api/manager`);
  console.log(`Agent    : http://localhost:${PORT}/api/agent`);
  console.log(`Messages : http://localhost:${PORT}/api/messages`);
  console.log("======================================");
});