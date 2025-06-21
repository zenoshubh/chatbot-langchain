import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { graphWithMemory, createThreadConfig} from './langchain';
import { HumanMessage } from '@langchain/core/messages';


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.text());     // for text/plain


app.post('/chat', async (req: Request, res: Response) => {
    try {
        const message = req.body;

        // Use provided sessionId or generate a new one
        const threadId = "session1";
        const config = createThreadConfig(threadId);

        const input = {
            messages: [
                new HumanMessage(message.trim())
            ],
        };

        const output = await graphWithMemory.invoke(input, config);
        const response = output.messages[output.messages.length - 1];

        res.status(200).json({
            AI: response?.content,
            sessionId: threadId
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default app