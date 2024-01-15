---
layout: Page
title: Reading
categories:
- books
---

## Current

_[Things Become Other Things](https://craigmod.com/ridgeline/174/)_ by Craig Mod

## Antilibrary

I keep this [anitlibrary](/notes/660552124) to allow my interest to project forward.

- _You Deserve a Tech Union_ by Ethan Marcotte
- _Dust_ by Jay Owens
- _The Left Hand of Darkness_ by Ursula K. Le Guin
- _Mostly False Reports_ by Stephen Leslie
- _Working_ by Studs Terkel
- _The Power Broker_ by Robert Caro
- _Can You Imagine?_ by Sari Azout
- _Outlive_ by Peter Attia

## Read

These are books I've read in the past and made notes about.

{% assign postsByMonth = 
site.categories['books'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByMonth %}
  <table>
      <thead>
        <tr>
            <td colspan="3">
                <span id="{{ day.name }}">{{ day.name }}</span>
            </td>
        </tr>
      </thead>
  {% for post in day.items %}
  {%- include PostTableRow.html post=post -%}
  {% endfor %}
  </table>
{% endfor %}
