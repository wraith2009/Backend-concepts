import express from "express";
import { Request, Response } from "express";

const app = express();

app.get("/", (req, res) => res.send("hello welcome to server-sent-events"));

app.get("/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  send(res);
});

let i = 0;
function send(res: Response) {
  res.write("data" + `hello from server sent events ----[${i++}\n\n`);

  setTimeout(() => send(res), 1000);
}
app.listen(8080, () => console.log("Server is listening on port : 8080"));
