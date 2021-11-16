import express from 'express'
import path from 'path'
import qrcode from 'qrcode'
import cors from 'cors'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cors())

app.get('/api/qrcode', async (req, res) => {
    const errors = []

    if (!req.query.client_name) errors.push("client_name is required")
    if (!String(req.query.client_name).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("client_name does not match the required format")
    }
    if (!req.query.client_address) errors.push("client_address is required")
    if (!String(req.query.client_address).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("client_address does not match the required format")
    }
    if (!req.query.client_city) errors.push("client_city is required")
    if (!String(req.query.client_city).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("client_city does not match the required format")
    }
    if (!req.query.amount) errors.push("amount is required")
    if (!String(req.query.amount).match(/^(?=.{11}$)[0]{1,11}[0-9]{0,11}$/)) {
        errors.push("amount does not match the required format")
    }

    // SET DEFAULT PURPOSE_CODE
    if (!req.query.purpose_code) req.query.purpose_code = "OTHR"
    if (!String(req.query.purpose_code).match(/^[A-Z]{4}$/)) {
        errors.push("purpose_code does not match the required format")
    }

    if (!req.query.payment_purpose) errors.push("payment_purpose is required")
    if (!String(req.query.payment_purpose).match(/^[A-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,40}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("payment_purpose does not match the required format")
    }

    if (!req.query.iban) errors.push("iban is required")
    if (!String(req.query.iban).match(/^[A-Z]{2}\d{17}$/)) {
        errors.push("iban does not match the required format")
    }

    if (!req.query.reference) errors.push("reference is required")
    if (!String(req.query.reference).match(/^[A-Z]{2}[0-9\-]{1,24}$/)) {
        errors.push("reference does not match the required format")
    }

    if (!req.query.issuer_name) errors.push("issuer_name is required")
    if (!String(req.query.issuer_name).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("issuer_name does not match the required format")
    }
    if (!req.query.issuer_address) errors.push("issuer_address is required")
    if (!String(req.query.issuer_address).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("issuer_address does not match the required format")
    }
    if (!req.query.issuer_city) errors.push("issuer_city is required")
    if (!String(req.query.issuer_city).match(/^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)) {
        errors.push("issuer_city does not match the required format")
    }

    if (errors.length > 0) return res.status(400).send({
        ok: false,
        errors
    })

    let text = `UPNQR




${String(req.query.client_name).toUpperCase()}
${String(req.query.client_address).toUpperCase()}
${String(req.query.client_city).toUpperCase()}
${req.query.amount}


${String(req.query.purpose_code).toUpperCase()}
${String(req.query.payment_purpose).toUpperCase()}

${req.query.iban}
${req.query.reference}
${String(req.query.issuer_name).toUpperCase()}
${String(req.query.issuer_address).toUpperCase()}
${String(req.query.issuer_city).toUpperCase()}`

    text = `${text}\n${text.length + 1}`

    const code = await qrcode.toDataURL(text, { errorCorrectionLevel: 'H' })

    var img = new Buffer.from(code.split(',')[1], 'base64')
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length 
    })
    res.end(img)

})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')))

app.listen(process.env.PORT || 80, () => console.log(`UPN-QR started on port ${process.env.PORT || 80}`))