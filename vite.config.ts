import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'  
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
  ],
    server:{
    proxy:{
      '/api-proxy':{
        target:'https://preprodapisix.omnenest.com',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-proxy/,''),
        secure:false,
        headers: {
          'Origin': 'https://preprodapisix.omnenest.com',
          'Referer': 'https://preprodapisix.omnenest.com'
        }
      }
    }
  },
})