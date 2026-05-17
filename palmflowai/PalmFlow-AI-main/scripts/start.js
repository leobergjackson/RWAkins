#!/usr/bin/env node
const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const nextDir = path.join(root, ".next");
const buildIdFile = path.join(nextDir, "BUILD_ID");

if (!fs.existsSync(buildIdFile)) {
  console.log("[start] no .next build found — running next build first");
  const buildRes = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["next", "build"],
    { cwd: root, stdio: "inherit", env: process.env }
  );
  if (buildRes.status !== 0) {
    console.error("[start] next build failed");
    process.exit(buildRes.status ?? 1);
  }
}

const port = process.env.PORT || "3006";
const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "-H", "0.0.0.0", "-p", port],
  { cwd: root, stdio: "inherit", env: process.env }
);

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error("[start] failed to spawn next start:", err);
  process.exit(1);
});
