import { createApp } from './server.js'

const PORT = parseInt(process.env.PORT || '3100', 10)

const app = createApp()

app.listen(PORT, () => {
  console.log(`devoops-agents running on port ${PORT}`)
})
