---
title: About
permalink: /about/
section: about
kind: About
description: Maxime Vincent is an embedded systems engineer in Belgium and VP of Engineering at Finalmouse. VeeMax takes on selected consulting work alongside it.
---

{% include portrait.html %}

{% for para in site.data.home.about %}
{{ para }}
{% endfor %}

## Contact

- Email: [{{ site.email }}](mailto:{{ site.email }})
{% for l in site.data.home.contact.links %}- {{ l.label }}: {% if l.url %}[{{ l.text }}]({{ l.url }}){% else %}{{ l.text }}{% endif %}
{% endfor %}