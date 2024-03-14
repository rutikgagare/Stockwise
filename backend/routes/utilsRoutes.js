const express = require("express")
const router = express.Router()
const { sendMail } = require("../utils/mail")

router.post("/mail", async (req, res) => {
    const { name, to, subject, text, html } = req.body;

    console.log("req.body: ", req.body);

    if (!name || !to || !subject || !text) {
        res.status(400).json({ error: "`name`, `to`, `subject` and `body` are required!"})
    }

    try {
        const ans = await sendMail(name, to, subject, text, html);
        console.log("ans: ", ans);
        res.json({ msg: "mail sent!" })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error })
    }
})

module.exports = router