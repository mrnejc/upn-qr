import express from 'express'
import path from 'path'
import qrcode from 'qrcode'
import cors from 'cors'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('index'))
app.get('/form/:data', (req, res) => res.render('form'))

app.get('/api/qrcode', async (req, res) => {
    const errors = []

    function check (name, rgxp) {
        if (!req.query[name]) errors.push(`${name} is required`)
        else {
            req.query[name] = String(req.query[name]).trim()
            if (!String(req.query[name]).match(rgxp)) {
                errors.push(`${name} does not match the required format`)
            }
        }
    }

    check('client_name', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)
    check('client_address', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)
    check('client_city', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)
    check('amount', /^(?=.{11}$)[0]{1,11}[0-9]{0,11}$/)
    check('payment_purpose', /^[A-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,40}[A-Z0-9ČŠŽĐ])?$/i)
    check('iban', /^[A-Z]{2}\d{17}$/)
    check('reference', /^[A-Z]{2}[0-9\-]{1,24}$/)
    check('issuer_name', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)
    check('issuer_address', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)
    check('issuer_city', /^[a-zA-Z0-9ČŠŽĐ](?:[A-Z0-9 ČŠŽĐ]{0,31}[A-Z0-9ČŠŽĐ])?$/i)

    // SET DEFAULT PURPOSE_CODE
    if (!req.query.purpose_code) req.query.purpose_code = "OTHR"
    else {
        req.query.amount = String(req.query.amount).trim()
        if (!String(req.query.purpose_code).match(/^[A-Z]{4}$/)) {
            errors.push("purpose_code does not match the required format")
        }
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

app.listen(process.env.PORT || 80, () => console.log(`UPN-QR started on port ${process.env.PORT || 80}`))