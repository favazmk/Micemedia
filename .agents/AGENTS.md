# Project-Scoped Behavioral Rules for Mice Media

## 1. COMPREHENSIVE REVISION OF WORKS SEARCHING
- Whenever the user requests a revision or summary of works (e.g. via the `/revision-of-works` command), the agent MUST NOT rely on short session summaries, checkpoints, or memory.
- The agent MUST explicitly search the entire `transcript.jsonl` file for the current calendar day's timestamp to extract all user prompts and model responses.
- This ensures that early-session updates (such as code modifications, metadata cleanups, or visual styling) are never missed in the final list.
