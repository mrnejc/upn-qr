import express from 'express'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')))

app.listen(80, () => console.log(`UPN-QR started on port 80`))