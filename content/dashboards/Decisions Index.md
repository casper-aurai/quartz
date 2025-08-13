# Decisions Index

This mirrors your Obsidian Decisions dashboard. Dataview blocks are shown as code.

```md
## Recent Decisions
```dataview
TABLE WITHOUT ID file.link AS Decision, date, status
FROM "references/decisions"
SORT file.ctime DESC
LIMIT 100
```

## Open Decisions (proposed/pending)
```dataview
TABLE WITHOUT ID file.link AS Decision, date, status
FROM "references/decisions"
WHERE status != "accepted" AND status != "rejected"
SORT date DESC
```
```
