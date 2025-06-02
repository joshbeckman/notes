---
layout: Page
title: Sequences
---

These are post sequences: chains of posts where each links to the next. The minimum sequence length is 3 posts (two is just a link). Sequences can be used to explore a thought in depth, following a curated path through related content.

The sequences are ordered by length, with the longest first.

<div id="sequences-container">
  <p>Loading sequences...</p>
</div>

<script>
async function loadSequences() {
  try {
    const response = await fetch('/assets/js/sequences.json');
    const sequences = await response.json();
    sequences.sort((a, b) => b.length - a.length);
    const container = document.getElementById('sequences-container');
    if (sequences.length === 0) {
      container.innerHTML = '<p>No sequences found.</p>';
      return;
    }
    let html = `<p>${sequences.length} sequences found</p>`;
    sequences.forEach((sequence, index) => {
      html += `<div class="sequence">`;
      html += `<h3>Sequence ${index + 1} (${sequence.length} posts)</h3>`;
      html += `<ol>`;
      sequence.forEach((post, postIndex) => {
        html += `<li>`;
        html += `<a href="${post.url}">${post.title}</a>`;
        if (postIndex < sequence.length - 1) {
          html += ` → `;
        }
        html += `</li>`;
      });
      
      html += `</ol>`;
      html += `</div>`;
    });
    
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error loading sequences:', error);
    document.getElementById('sequences-container').innerHTML = '<p>Error loading sequences.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadSequences);
</script>
