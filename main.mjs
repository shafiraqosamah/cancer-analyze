import { startServer } from "./server/server.mjs"
import { Store } from "./server/store.mjs"

async function main() {
    await startServer(Store)
}

main()