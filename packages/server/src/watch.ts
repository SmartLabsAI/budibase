import path from "path"
import * as env from "./environment"
import chokidar from "chokidar"
import fs from "fs"
import { tenancy } from "@budibase/backend-core"
import { DEFAULT_TENANT_ID } from "@budibase/backend-core/constants"
import { processPlugin } from "./api/controllers/plugin"

export function watch() {
  const watchPath = path.join(env.PLUGINS_DIR, "./**/*.tar.gz")
  chokidar
    .watch(watchPath, {
      ignored: "**/node_modules",
      awaitWriteFinish: true,
    })
    .on("all", async (event: string, path: string) => {
      // Sanity checks
      if (!path?.endsWith(".tar.gz") || !fs.existsSync(path)) {
        return
      }
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        try {
          const split = path.split("/")
          const name = split[split.length - 1]
          console.log("Importing plugin:", path)
          await processPlugin({ name, path })
        } catch (err) {
          console.log("Failed to import plugin:", err)
        }
      })
    })
}
