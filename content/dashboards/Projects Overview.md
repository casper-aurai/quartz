# Projects Overview

This mirrors your Obsidian Projects Overview. Dataview blocks are shown as code.

```md
## Active Projects
```dataview
TABLE status, due, next
FROM "10-projects"
WHERE status != null AND status != "archived"
SORT due ASC
```

## Projects Without Next Action
```dataview
LIST
FROM "10-projects"
WHERE (status != null AND status != "archived") AND (next = null OR length(next) = 0)
```

## Upcoming Deadlines (30 days)
```dataview
TABLE due, status
FROM "10-projects"
WHERE due AND date(due) <= date(today) + dur(30 days)
SORT due ASC
```
```
