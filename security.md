---
layout: humans
permalink: '/security.txt'
---
Contact: mailto:security@joshbeckman.org
{% assign ms = 30 | times: 24 | times: 60 | times: 60 %}{% assign after = 'now' | date: "%s" | plus: ms | date: "%b %d" %}Expires: {{ after | date_to_xmlschema }}
Preferred-Languages: en
Canonical: {{ site.url }}/security.txt