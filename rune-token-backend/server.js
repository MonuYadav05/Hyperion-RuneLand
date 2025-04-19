import express from 'express'
import cors from 'cors'
import runeManager from './routes/rune.js'

export const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1', runeManager)
app.get('/', () => {
  console.log('working')
})

app.listen(8000, () => {
  console.log('server is running at 8000')
})
