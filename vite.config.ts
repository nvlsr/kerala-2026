import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@data": path.resolve(__dirname, "./data"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Vendor chunking. Pulls heavy or stable deps into named chunks
        // that browsers can cache across deploys when our app code
        // changes. The ordering of branches matters — first match wins.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined
          if (id.includes("recharts") || /\/d3-/.test(id)) return "charts"
          if (id.includes("@base-ui")) return "base-ui"
          if (id.includes("@tabler/icons-react")) return "icons"
          if (
            id.includes("react-router") ||
            id.includes("@remix-run/router") ||
            id.includes("history/")
          ) {
            return "router"
          }
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return "react-vendor"
          }
          return undefined
        },
      },
    },
  },
})
