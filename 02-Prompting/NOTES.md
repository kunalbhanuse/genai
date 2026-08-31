# Prompting — My Notes

> Rule: write in my own words. If I paste it, I didn't learn it.
> Every concept gets 4 sections. If I can't fill all 4, I don't understand it yet.

---

## Lesson 0 — What is the `openai` package?

**In one sentence:**
A wrapper around making API calls to the OpenAI server — it builds the headers
and converts the data for me, sends the request, and gets back a JSON response
I can pull the reply out of via `res.choices[0].message.content`.

**Proof:**
`console.log(client)` printed `fetch: [Function: fetch]` right inside the
client object — the exact same `fetch` I used by hand in Part A. Paired with
`baseURL: 'https://api.openai.com/v1'`, that's proof the SDK is really just
`{ URL, apiKey, fetch }` wrapped in convenience methods — nothing hidden.

**Gotcha:**
All of them, really — `.JSON()` vs `.json()` (case-sensitive, different
things entirely), and `messages` (plural, array, what I send) vs `message`
(singular, object, what I get back in `choices[0]`). Rule: request body uses
`messages`, response choice uses `message` — always double check which side
I'm on.

**When I'd use it:**
SDK for anything real in Node — the retries, structured errors
(`BadRequestError`), and auto-parsing matter most exactly when I'm making
lots of calls, like from an agent. Raw `fetch` is for when the SDK isn't an
option at all — no npm/Node environment (e.g. browser), a different
language, or when I want to see every step happening, like today.

**Endpoint map** (the one table worth keeping verbatim):

| I write                            | It POSTs to                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| `client.chat.completions.create()` | `/v1/chat/completions`                                      |
| `client.completions.create()`      | `/v1/completions` (legacy — takes `prompt`, not `messages`) |
| `client.embeddings.create()`       | `/v1/embeddings`                                            |
| `client.images.generate()`         | `/v1/images/generations`                                    |

**Reference — round trip (raw fetch):**

```js
fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ model, messages }),
});
// res = Response envelope, body is an unread ReadableStream
// await res.json() drains + parses it into a real object
```

**Reference — same call, SDK:**

```js
client.chat.completions.create({ model, messages });
// same POST, same headers, same stringify — done internally
// returns the parsed object directly, no res.json() step
```

**Reference — where things live in the response:**

```
reply text   → data.choices[0].message.content
token counts → data.usage.{prompt_tokens, completion_tokens, total_tokens}
```

---

## Lesson 1 — Zero-Shot Prompting

**In one sentence:**
Asking the model to do a task from an instruction alone — no example
input/output pairs shown first — relying on what it already learned in
training to figure out the format and the answer.

**Proof:**
`sentimentReview()` in `zero-shot.js` — the prompt is just the instruction
("classify into Positive/Negative/Neutral, one word only") glued to the raw
input, with zero labeled examples in between. Ran it on `"It arrived on
Tuesday."` and got back `Neutral`, so the model inferred both the category
set and the one-word format from the instruction text alone.

**Gotcha:**
No examples means no anchor for edge cases — ambiguous input (like a review
that's mixed or sarcastic) has nothing to pattern-match against, so the model
falls back on its own judgment of "neutral-ish" wording. That's also why the
instruction has to spell out the output format explicitly ("one word nothing
else") — without an example to imply the shape, the model might otherwise
add punctuation or a full sentence.

**When I'd use it:**
Simple, well-known tasks where the category/format is obvious from
description alone (classification, translation, basic extraction) and where
I don't have — or don't want to spend tokens on — labeled examples. Once
edge cases start getting misclassified, that's the signal to move to
few-shot instead.

---

## Lesson 2 — Few-Shot Prompting

**In one sentence:**
Same as zero-shot, but the prompt includes a handful of labeled
input/output examples before the real input, so the model has a concrete
pattern to match instead of just a description of the task.

**Proof:**
`few-shot.js` — added 3 labeled review→sentiment examples in front of the
same classification task from `zero-shot.js`, then ran both versions
side by side on two tricky reviews:
- Mixed review ("food was cold, but staff apologized"): both zero-shot and
  few-shot said `Neutral`.
- Sarcastic review ("Wow, three weeks late again, real professional."):
  both zero-shot and few-shot said `Negative`.
No divergence in either case — `gpt-4o` already handles generic sentiment
well without examples, so the extra examples changed nothing here.

**Gotcha:**
Few-shot isn't a free accuracy boost — it only helps when the model
doesn't already have a strong prior for the task. For a mainstream task
like sentiment, the model's zero-shot judgment already matches what 3
examples would teach it, so I paid extra tokens for the same answer.
The real test of few-shot needs a task the model *wouldn't* know how to
format or categorize on its own.

**When I'd use it:**
Custom or unusual categories the model hasn't seen conventions for (e.g.
"urgent/routine/spam" instead of positive/negative/neutral), or when I
need a very specific output shape/style that's easier to show than
describe. Not worth it for tasks the model already does well zero-shot —
verify that first before assuming few-shot will help.
