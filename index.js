const express = require("express")
const app = express()
const port = 3000
const stripe_secret = "sk_test_joWk2pblKJDKBNyG4p8PbpyM"
const stripe_webhook_secret = "whsec_KuU2HxauCcDvbsoLNtt2KuxUx32MbVyq"

const stripe = require("stripe")(stripe_secret)

app.get("/", (req, res) => res.send("Everything's working as intended... 😎"))

// Use body-parser to retrieve the raw body as a buffer
const body_parser = require('body-parser');

// Match the raw body to content type application/json
app.post('/', body_parser.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers["stripe-signature"]

    let event

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            stripe_webhook_secret
        )
        console.log(`Event successfully parsed locally.`)
        console.log(event)
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`)
    }
    response.send("200");
});

app.listen(port, () => console.log(`We're live at http://localhost:${port}`))
