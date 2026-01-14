/* 
   MATHSOLVER AI v15.0 - CHROME EXTENSION EDITION
   Core: MathSolver Logic adapted for MV3
*/

(function() {
    // Çakışmayı önlemek için ID
    const CFG = {
        ID: 'mathsolver-ai-ext-v15',
        MODEL: 'gemini-3-flash-preview' // Veya 'gemini-1.5-flash'
    };

    // Varsa eskileri temizle
    const existing = document.getElementById(CFG.ID);
    if(existing) return; // Zaten çalışıyorsa tekrar yükleme

    // GÜVENLİK (TRUSTED TYPES)
    let ttPolicy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            ttPolicy = window.trustedTypes.createPolicy('ms-ext-' + Math.floor(Math.random() * 99999), {
                createHTML: s => s, createScript: s => s
            });
        } catch (e) {}
    }
    const safeHTML = (html) => ttPolicy ? ttPolicy.createHTML(html) : html;

    // ICONS (SVG)
    const ICONS = {
        KEY: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
        PASTE: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
        CLOSE: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        ROBOT: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`
    };

    // ARAYÜZ OLUŞTURMA
    const bar = document.createElement('div');
    bar.id = CFG.ID;
    bar.innerHTML = safeHTML(`
        <div title="MathSolver AI">${ICONS.ROBOT}</div>
        <div class="ms-sep"></div>
        <button class="ms-bar-btn" id="btn-key" title="API Anahtarı">${ICONS.KEY}</button>
        <button class="ms-bar-btn active" id="btn-paste" title="Yapıştır">${ICONS.PASTE}</button>
        <div class="ms-sep"></div>
        <button class="ms-bar-btn close" id="btn-close" title="Gizle">${ICONS.CLOSE}</button>
        <div class="ms-sig">K.Ş</div>
    `);
    document.body.appendChild(bar);

    // SÜRÜKLEME MANTIĞI
    let isDragging = false, dragOffset = {x:0, y:0};
    bar.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        const rect = bar.getBoundingClientRect();
        dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        bar.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        bar.style.top = (e.clientY - dragOffset.y) + 'px';
        bar.style.left = 'auto'; 
        bar.style.right = (window.innerWidth - e.clientX - (bar.offsetWidth - dragOffset.x)) + 'px';
        bar.style.transform = 'none';
    });
    window.addEventListener('mouseup', () => { isDragging = false; bar.style.cursor = 'grab'; });

    // MODAL OLUŞTURMA
    const backdrop = document.createElement('div');
    backdrop.className = 'ms-modal-backdrop';
    backdrop.innerHTML = safeHTML(`
        <div class="ms-modal">
            <div class="ms-head">
                <div class="ms-title">${ICONS.ROBOT} Uzman Çözüm</div>
                <div class="ms-close">${ICONS.CLOSE}</div>
            </div>
            <div class="ms-body">
                <div id="ms-s1">
                    <div class="ms-preview-box"><img id="ms-img" class="ms-preview-img" src=""></div>
                    <p style="text-align:center; color:#64748b">Görsel analiz edilsin mi?</p>
                </div>
                <div id="ms-s2" style="display:none; text-align:center; padding:40px 0;">
                    <div style="font-size:60px; animation:spin 1.5s infinite linear">🌀</div>
                    <h2 style="color:#0f172a; margin:20px 0;">Uzman Analiz Ediyor...</h2>
                    <p style="color:#64748b">Adım adım çözüm hazırlanıyor.</p>
                    <div class="ms-prog-wrap"><div class="ms-prog-bar" id="ms-prog"></div></div>
                </div>
                <div id="ms-s3" class="ms-res" style="display:none;"></div>
            </div>
            <div class="ms-footer">
                <button class="ms-btn btn-sec" id="ms-cancel">İptal</button>
                <button class="ms-btn btn-pri" id="ms-solve">🚀 Çözümü Başlat</button>
            </div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `);
    document.body.appendChild(backdrop);

    // REFERANSLAR
    const els = {
        img: document.getElementById('ms-img'),
        s1: document.getElementById('ms-s1'), s2: document.getElementById('ms-s2'), s3: document.getElementById('ms-s3'),
        prog: document.getElementById('ms-prog'), solve: document.getElementById('ms-solve'), cancel: document.getElementById('ms-cancel'),
        footer: backdrop.querySelector('.ms-footer')
    };

    // İŞLEVLER
    const close = () => {
        backdrop.classList.remove('show');
        setTimeout(() => {
            els.s1.style.display='block'; els.s2.style.display='none'; els.s3.style.display='none';
            els.solve.classList.remove('btn-dis'); els.footer.style.display='flex';
        }, 300);
    };
    backdrop.querySelector('.ms-close').onclick = close;
    els.cancel.onclick = close;
    document.getElementById('btn-close').onclick = () => { bar.style.display = 'none'; alert('Uzantı gizlendi. Geri getirmek için sayfayı yenileyin.'); };

    // API KEY (CHROME STORAGE)
    document.getElementById('btn-key').onclick = () => {
        chrome.storage.local.get(['geminiKey'], function(result) {
            const k = prompt('Gemini API Key:', result.geminiKey || '');
            if(k) { 
                chrome.storage.local.set({geminiKey: k.trim()}, () => alert('✅ Anahtar kaydedildi (Tüm sekmelerde geçerli).'));
            }
        });
    };

    let currentBase64 = '';
    const handlePaste = (blob) => {
        chrome.storage.local.get(['geminiKey'], function(result) {
            if(!result.geminiKey) { alert('⚠️ Önce anahtar ikonuna basarak API Key girin.'); return; }
            
            const r = new FileReader();
            r.onload = e => {
                currentBase64 = e.target.result;
                els.img.src = currentBase64;
                els.s1.style.display='block'; els.s2.style.display='none'; els.s3.style.display='none';
                els.footer.style.display='flex';
                backdrop.classList.add('show');
            };
            r.readAsDataURL(blob);
        });
    };

    document.getElementById('btn-paste').onclick = async () => {
        try {
            const items = await navigator.clipboard.read();
            for(const i of items) {
                if(i.types.includes('image/png')) { handlePaste(await i.getType('image/png')); return; }
                if(i.types.includes('image/jpeg')) { handlePaste(await i.getType('image/jpeg')); return; }
            }
            alert('Panoda resim yok.');
        } catch(e) { alert('Lütfen sayfaya tıklayıp CTRL+V yapın.'); }
    };

    window.addEventListener('paste', e => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for(let i=0; i<items.length; i++) {
            if(items[i].type.indexOf('image')===0) { e.preventDefault(); handlePaste(items[i].getAsFile()); return; }
        }
    });

    // ÇÖZÜM
    els.solve.onclick = () => {
        chrome.storage.local.get(['geminiKey'], async function(result) {
            const apiKey = result.geminiKey;
            
            els.s1.style.display='none'; els.s2.style.display='block';
            els.solve.classList.add('btn-dis'); els.footer.style.display='none';
            let p=0; const t = setInterval(() => { if(p<95){ p+=Math.random()*5; els.prog.style.width=p+'%'; } }, 200);

            try {
                const cleanData = currentBase64.split(',')[1];
                const promptText = `
                    Sen bir yapay zeka asistanı değil, görseldeki dersin DÜNYA ÇAPINDAKİ UZMANISIN.
                    GÖREVİN:
                    1. Görseli analiz et ve dersi/konuyu belirle.
                    2. O dersin en iyi profesörü gibi davranarak soruyu Türkçe olarak adım adım çöz.
                    3. Öğrenciye konuyu öğretecek şekilde, neden-sonuç ilişkisi kurarak açıkla.
                    KURALLAR:
                    - Markdown formatında yaz.
                    - LaTeX sembolleri kullanma, düz metin kullan (örn: x kare).
                    - Önemli yerleri **kalın** yap.
                `;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CFG.MODEL}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: [{ parts: [
                            { text: promptText },
                            { inline_data: { mime_type: "image/jpeg", data: cleanData } }
                        ]}]
                    })
                });

                clearInterval(t); els.prog.style.width='100%';

                if(!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error?.message || response.statusText);
                }
                
                const json = await response.json();
                const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;

                setTimeout(() => {
                    els.s2.style.display='none'; els.s3.style.display='block';
                    els.s3.innerHTML = safeHTML(formatText(raw));
                    els.footer.style.display='flex'; els.solve.style.display='none'; els.cancel.innerHTML='Kapat';
                }, 600);

            } catch(e) {
                clearInterval(t);
                els.s2.innerHTML = `<div style="color:red;font-weight:bold">Hata: ${e.message}</div>`;
                els.footer.style.display='flex';
            }
        });
    };

    function formatText(text) {
        let clean = text
            .replace(/\\cdot/g, '·').replace(/\\times/g, '×').replace(/\\div/g, '÷')
            .replace(/\$\$/g, '').replace(/\$/g, '').replace(/\\/g, '');
        return clean
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/### (.*?)\n/g, '<h3>$1</h3>')
            .replace(/## (.*?)\n/g, '<h2>$1</h2>')
            .replace(/- (.*?)\n/g, '<li>$1</li>')
            .replace(/\n/g, '<br>');
    }
})();