---
name: resume
description: Read the most recent pro192web handoff document (written by /handoff) to restore full project context before continuing work.
argument-hint: "(optional) what you want to work on next"
disable-model-invocation: true
---

Find the most recently modified file matching `/tmp/pro192web-handoff-*.md` on the user's OS. Read it in full.

Treat its contents as complete background for this conversation: project purpose, architecture pointers (it will tell you to read `.claude/CLAUDE.md` for full detail — do that too), UI/design conventions already decided, working-process rules the user expects, and recent history. Do not ask the user to re-explain anything already covered there.

If no file matching that pattern exists, tell the user and suggest they run `/handoff` first to generate one.

If the user passed arguments, treat them as the task to work on next, using the handoff doc purely as background context — do not treat the arguments themselves as something to look up in the handoff doc.
