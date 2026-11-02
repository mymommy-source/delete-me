// Loads backend/.env (MONGODB_URI, PORT) before anything else runs.
try {
  process.loadEnvFile();
} catch {
  // No .env file: rely on the real environment (e.g. in production).
}
