# People & Meetings

This mirrors your Obsidian People & Meetings dashboard. Dataview/Tasks blocks are shown as code.

```md
## Upcoming Meetings (next 14 days)
```dataview
TABLE file.link AS Meeting, date AS Date, location
FROM "meetings"
WHERE date AND date(date) <= date(today) + dur(14 days)
SORT date ASC
```

## Recent Meeting Notes (last 14 days)
```dataview
LIST
FROM "meetings"
WHERE date AND date(date) >= date(today) - dur(14 days)
SORT date DESC
```

## Action Items from Meetings
```tasks
not done
path includes meetings
hide backlink
sort by due
```

## People Directory
```dataview
TABLE role, company, email
FROM "people"
SORT file.name ASC
```
```
