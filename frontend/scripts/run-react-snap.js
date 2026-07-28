const { run } = require("react-snap");
const { execSync } = require("child_process");
const os = require("os");
const net = require("net");

const PORT = 45679;

// Kill any process holding the port before starting (prevents EADDRINUSE from crashed builds)
function killPortProcess(port) {
  try {
    if (os.platform() === "win32") {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const lines = result.split("\n").filter(l => l.includes("LISTENING"));
      for (const line of lines) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && pid !== "0") {
          try { execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" }); } catch (_) {}
        }
      }
    } else {
      execSync(`fuser -k ${port}/tcp`, { stdio: "ignore" });
    }
  } catch (_) {
    // No process on port — that's fine
  }
}

// Automatically detect the correct Chrome executable path based on the OS
const executablePath = os.platform() === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "/usr/bin/google-chrome";

// Free the port first, then run react-snap
killPortProcess(PORT);

run({
  inlineCss: false,
  concurrency: 4,
  port: PORT,
  puppeteerExecutablePath: executablePath,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"]
}).then(() => {
  console.log("✅ react-snap completed successfully");
}).catch((error) => {
  console.error("🔥 react-snap failed:", error);
  process.exit(1);
});
