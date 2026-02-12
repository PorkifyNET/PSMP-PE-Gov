document.addEventListener('DOMContentLoaded', async () => {
  try {
    const resp = await fetch('data/laws.json');
    const data = await resp.json();
    const root = document.getElementById('laws-root');

    function renderHierarchy(h) {
      return `
        <div class="section">
          <h3>Hierarchy of Law</h3>
          <div class="card">
            <div class="law-section">
              <h4>Sources of Imperial Law</h4>
              <p>${h.description}</p>
              <ol>${h.items.map(i=>`<li><strong>${i.title}</strong>${i.note?` — ${i.note}`:''}</li>`).join('')}</ol>
              <div class="law-code">${h.citation}</div>
            </div>
          </div>
        </div>`;
    }

    function renderBrowse(cat, auth) {
      return `
        <div class="section">
          <h3>Browse</h3>
          <div class="card">
            <div class="law-grid">
              <div class="law-section">
                <h4>By Category</h4>
                <p>${cat.map(c=>`<span class="law-pill" data-cat="${c.id}"><strong>${c.id}</strong> ${c.name}</span>`).join('')}</p>
              </div>
              <div class="law-section">
                <h4>By Authority</h4>
                <ul>${auth.map(a=>`<li><strong>${a.title}</strong> — ${a.note}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
        </div>`;
    }

    function renderConsolidated(list) {
      return `
        <div class="section">
          <h3>Key Consolidated Texts</h3>
          <div class="card">
            <table class="law-table">
              <thead>
                <tr><th>Identifier</th><th>Title</th><th>Status</th><th>Last amended</th></tr>
              </thead>
              <tbody id="consolidated-body">
                ${list.map(it=>`<tr><td><code>${it.id}</code></td><td>${it.title}</td><td>${it.status}</td><td>${it.lastAmended}</td></tr>`).join('')}
              </tbody>
            </table>
            <div class="law-note" style="margin-top:12px;">${data.note}</div>
          </div>
        </div>`;
    }

    function renderGazette(list) {
      return `
        <div class="section">
          <h3>Imperial Gazette</h3>
          <div class="card">
            <div class="law-section">
              <h4>Recent Publications</h4>
              <p>Official notices of enactment, amendments, repeals, and regulations (sample index).</p>
              <table class="law-table">
                <thead>
                  <tr><th>Gazette entry</th><th>Subject</th><th>Publication date</th></tr>
                </thead>
                <tbody id="gazette-body">
                  ${list.map(g=>`<tr><td><code>${g.id}</code></td><td>${g.subject}</td><td>${g.date}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    }

    function renderSections(secs) {
      return `
        <div class="section">
          <h3>Rights, Public Order, and Due Process</h3>
          <div class="card">
            <div class="law-grid">
              ${secs.map(s=>`<div class="law-subsection"><h5>${s.title}</h5><p>${s.text}</p>${s.code?`<div class="law-code">${s.code}</div>`:''}</div>`).join('')}
            </div>
          </div>
        </div>`;
    }

    function renderAmendments(a) {
      return `
        <div class="section">
          <h3>Amendments, Repeals, and Entry into Force</h3>
          <div class="card">
            <div class="law-section">
              <h4>How laws change</h4>
              <ul>${a.items.map(i=>`<li><strong>${i.title}</strong> ${i.note || ''}</li>`).join('')}</ul>
              <p style="margin-top:12px;"><strong>Entry into force:</strong> ${a.entry}</p>
              <p><strong>Last Updated:</strong> ${a.updated}</p>
            </div>
          </div>
        </div>`;
    }

    root.innerHTML = [
      renderHierarchy(data.hierarchy),
      renderBrowse(data.categories, data.authorities),
      renderConsolidated(data.consolidated),
      renderGazette(data.gazette),
      renderSections(data.sections),
      renderAmendments(data.amendments)
    ].join('');

    // Basic search: filters consolidated table and gazette rows
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    function applySearch(q){
      q = (q||'').trim().toLowerCase();
      document.querySelectorAll('#consolidated-body tr').forEach(tr=>{
        tr.style.display = q && !tr.textContent.toLowerCase().includes(q) ? 'none' : '';
      });
      document.querySelectorAll('#gazette-body tr').forEach(tr=>{
        tr.style.display = q && !tr.textContent.toLowerCase().includes(q) ? 'none' : '';
      });
    }

    searchBtn.addEventListener('click', ()=>applySearch(searchInput.value));
    searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter') applySearch(searchInput.value); });

  } catch (err) {
    console.error('Failed to load laws data', err);
    const root = document.getElementById('laws-root');
    if(root) root.innerHTML = '<div class="law-note">Failed to load laws data.</div>';
  }
});
