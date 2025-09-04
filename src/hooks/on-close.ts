import closeWithGrace from "close-with-grace"
import fp from "fastify-plugin"

export const OnCloseHook = fp(async (app) => {
  const closeListeners = closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err) app.log.error(err)
    await app.close()
  })

  app.addHook("onClose", async () => {
    closeListeners.uninstall()
  })
})
