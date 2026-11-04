# Working on FriWatch

- A question mark (`?`) means: answer the question, not make changes.

- When implementation is requested, carry the agreed work through cleanup and appropriate verification. Commit completed stages when useful; push or publish when requested.

- Use docs/architecture.md and docs/testing.md as guides, and docs/roadmap.md for planned product work. Take tool versions and commands from the existing project files.

- Aim for clear ownership and shared mechanisms across video, music and photos. Look at existing implementations before introducing another abstraction, cache or copy of server state.

- Use refactoring to simplify the whole workflow. Remove replaced code alongside its replacement, and explain substantial growth in terms of the responsibilities or functionality it adds.

- Investigate regressions through evidence: compare previous behavior, inspect actual requests, and check against Plex where practical. Choose verification that fits the change and clearly report what was tested and what remains uncertain.

- Keep documentation focused on its audience: current capabilities in README, planned work in the roadmap, and release changes in release notes. Put verification results in the work report or PR.
