---
title: Projects Overview
---



```dataview
TABLE status, due, next
FROM "10-Projects"
WHERE status != null AND status != "archived"
SORT due ASC
```

```dataview
LIST
FROM "10-Projects"
WHERE (status != null AND status != "archived") AND (next = null OR length(next) = 0)
```


