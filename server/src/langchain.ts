import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
    Annotation,
} from "@langchain/langgraph";


const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7
});

const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful and friendly AI assistant. You have a conversational personality and remember our previous interactions. Keep responses natural and engaging.",
    ],
    ["placeholder", "{messages}"],
]);

// Define the State
const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
});

// Define the function that calls the model
const callModel = async (state: typeof GraphAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await llm.invoke(prompt);
    return { messages: [response] };
};

// Define a new graph
const workflow = new StateGraph(GraphAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

const memory = new MemorySaver();
const chatApp = workflow.compile({ checkpointer: memory });

export default chatApp