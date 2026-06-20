

## Objective

Implement a Retrieval-Augmented Generation (RAG) system for NyayaMitra so that the AI answers legal questions using only the uploaded Nepal laws and Constitution PDFs.

Do not retrain any model.

Use Gemini 2.5 Flash as the LLM.

---

## Stack
* Gemini 2.5 Flash
* LangChain
* pdf-parse
* HuggingFace sentence-transformers
* FAISS (local vector store)

---

## Install dependencies

```bash
npm install langchain @langchain/community pdf-parse faiss-node
```

---

## Folder structure

```
public/
└── laws/
    ├── CyberLaw.pdf
    ├── NationalCivilCodeContract.pdf
    └── ConstitutionOfNepal.pdf

lib/
├── pdfLoader.ts
├── chunker.ts
├── embeddings.ts
├── vectorStore.ts
└── rag.ts

app/
└── api/
    └── chat/
        └── route.ts
```

---

## PDF Loading

Read every PDF inside:

```
public/laws
```

Extract all text content.

Keep metadata:

* law name
* page number

---

## Chunking

Split extracted text into chunks.

Settings:

* chunk size: 1000 characters
* chunk overlap: 200 characters

Every chunk must contain metadata:

```ts
{
  lawName: string,
  page: number,
  content: string
}
```

---

## Embeddings

Use HuggingFace sentence-transformers:

Model:

```
all-MiniLM-L6-v2
```

Generate embeddings for every chunk.

---

## Vector Store

Use FAISS.

Store:

* content
* metadata
* embedding

Persist the index locally.

---

## Retrieval Process

When a user asks a question:

1. Convert the question into an embedding.
2. Search FAISS.
3. Retrieve the top 5 most relevant chunks.
4. Combine them into context.
5. Send context and question to Gemini 2.5 Flash.
6. Return the response.

---

## System Prompt

```
You are NyayaMitra AI.

You are a legal assistant specialized exclusively in Nepal laws and the Constitution of Nepal.

Rules:

- Answer only from the retrieved context.
- Never use outside knowledge.
- Never invent laws or sections.
- If the answer is unavailable, say:

"I could not find relevant provisions in the laws currently available to me."

- Always cite:
    - Act name
    - Section number
    - Article number if applicable

- Keep answers concise and easy to understand.
- Explain in simple English and Nepali when appropriate.
```

---

## API Route

Create:

```
app/api/chat/route.ts
```

Flow:

User question

↓

Retrieve relevant chunks from FAISS

↓

Build context

↓

Send to Gemini 2.5 Flash

↓

Return response

---

## Example

User:

```
What is the punishment for hacking in Nepal?
```

Retrieved context:

```
Electronic Transactions Act 2063
Section 47
...
```

Gemini response:

```
According to Section 47 of the Electronic Transactions Act, 2063, hacking is punishable under the provisions specified in the Act.

Source:
Electronic Transactions Act 2063
Section 47
```

---

## Constraints

The AI must never:

* answer from general knowledge
* fabricate legal provisions
* answer unrelated topics
* provide information not found in the uploaded laws

If information is unavailable, clearly state that it could not be found in the currently available laws.

```
```
