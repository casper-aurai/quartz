# Today

This view mirrors your Obsidian dashboard. Obsidian-only code blocks (Dataview/Tasks) are shown as code for reference.

```md
## Daily Note
- [[daily/<% tp.date.now("YYYYMMDD") %>]]

## Overdue Tasks
```tasks
not done
hide backlink
show due
sort by due
(due before today)
```

## Due Today
```tasks
not done
hide backlink
show due
sort by path asc
(due on today)
```

## Meetings Today
```dataview
TABLE file.link AS Meeting, time, location
FROM "meetings"
WHERE date = date(today)
SORT time ASC
```

## Inbox (Recent)
```dataview
LIST
FROM "00-inbox"
SORT file.mtime DESC
LIMIT 10
```

## Quick Links
- New Zettel → QuickAdd: New: Zettel
- New Project → QuickAdd: New: Project
- Inbox Capture → QuickAdd: Inbox: Quick Capture
```
