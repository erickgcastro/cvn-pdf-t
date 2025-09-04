import { bootstrap } from "./bootstrap"

async function start() {
  try {
    await bootstrap()
  } catch (error) {
    console.error("Error starting server:", error)
    process.exit(1)
  }
}

start()
