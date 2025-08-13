# Projects Kanban

This mirrors your Obsidian Projects Kanban. Dataview blocks are shown as code.

```md
## Active
```dataview
TABLE without id file.link AS Project, due, next, tags
FROM "10-projects"
WHERE status = "active" OR !exists(status)
SORT due ASC
```

## On Hold
```dataview
TABLE without id file.link AS Project, due, next, tags
FROM "10-projects"
WHERE status = "on-hold"
SORT file.mtime DESC
```

## Ideas
```dataview
TABLE without id file.link AS Project, tags
FROM "10-projects"
WHERE status = "idea"
SORT file.ctime DESC
```

## Done (recent)
```dataview
TABLE without id file.link AS Project, file.mtime AS updated
FROM "10-projects"
WHERE status = "done"
SORT file.mtime DESC
LIMIT 20
```
```
