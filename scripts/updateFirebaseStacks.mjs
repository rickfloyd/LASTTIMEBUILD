// scripts/updateFirebaseStacks.mjs
// One-command updater for frontend + Firebase backend

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function run(cmd, cwd = projectRoot, label = cmd) {
  console.log(`\n=== ${label} @ ${cwd} ===\n`);
  execSync(cmd, { stdio: "inherit", cwd });
}

try {
  // 1) FRONTEND (root)
  if (!existsSync(path.join(projectRoot, "package.json"))) {
    console.error("No package.json at project root. Are you in the right folder?");
    process.exit(1);
  }

  run("rm -rf node_modules package-lock.json || true", projectRoot, "Clean frontend node_modules");
  run("npm install", projectRoot, "Install frontend dependencies");

  // Build frontend if script exists
  run("npm run build", projectRoot, "Build frontend");

  // 2) BACKEND (server folder, if present)
  const serverDir = path.join(projectRoot, "server");
  const serverPkg = path.join(serverDir, "package.json");

  if (existsSync(serverPkg)) {
    run("rm -rf node_modules package-lock.json || true", serverDir, "Clean backend node_modules");
    run("npm install", serverDir, "Install backend dependencies");

    // Try backend build, but don't fail if there is no build script
    try {
      run("npm run build", serverDir, "Build backend (server)");
    } catch (err) {
      console.warn("\n(No backend build script or build failed; skipping this step.)");
    }
  } else {
    console.log("\nNo server/ folder with package.json found. Skipping backend.\n");
  }

  console.log("\n✅ Frontend + backend dependencies refreshed and frontend built.\n");
  console.log("You can now run:\n");
  console.log("  npm run dev           # local dev frontend");
  console.log("  firebase emulators:start  # if you use emulators");
} catch (err) {
  console.error("\n❌ Update script failed.\n");
  console.error(err.message || err);
  process.exit(1);
}
