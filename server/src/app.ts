import express from 'express';
import cors from 'cors';
import chatApp from './langchain';
import { v4 as uuidv4 } from "uuid";


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.text());     // for text/plain


app.post('/chat', async (req, res) => {
    const message = req.body;
    const config = { configurable: { thread_id: "random_sessionId" } };
    const input = {
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
    };

    const output = await chatApp.invoke(input, config);
    const response = output.messages[output.messages.length - 1];

    res.status(200).json({
        AI: response?.content,
    })

})


export default app