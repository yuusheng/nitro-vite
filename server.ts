import { build, createNitro, createDevServer, prepare } from 'nitropack'
import {  createServer, createViteRuntime } from 'vite'
import { defineEventHandler, fromNodeMiddleware } from 'h3'
import fs from 'node:fs'
import viteReact from '@vitejs/plugin-react'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  base: '/',
  plugins: [viteReact()],
})

const nitro = await createNitro({
  baseURL: '/',
  dev: true,
  handlers: [],
  devHandlers: [
    {
      handler: defineEventHandler(fromNodeMiddleware(vite.middlewares))
    },
    {
      handler: defineEventHandler(async(event) => {
        const url = event.node.req.url!

        let template = fs.readFileSync('index.html', 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        const viteRuntime = await createViteRuntime(vite)
        const { render } = await viteRuntime.executeEntrypoint('/src/entry.tsx')
        const appHtml = await render(url) 
        const html = template.replace(`<!--ssr-outlet-->`, appHtml.html)
        return html
      })
    },
  ]
})

const server = createDevServer(nitro)
await server.listen('4132')
await prepare(nitro)
await build(nitro)
