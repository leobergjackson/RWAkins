#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || "3004";
const appDir = path.join(__dirname, "app");

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "-H", "0.0.0.0", "-p", port],
  { cwd: appDir, stdio: "inherit", env: process.env }
);

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error("Failed to start Next.js:", err);
  process.exit(1);
});
