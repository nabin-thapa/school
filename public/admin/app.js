const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
lucide.createIcons();
const show = id => document.getElementById(id)?.classList.remove('hidden');
const hide = id => document.getElementById(id)?.classList.add('hidden');

// Check existing session on load
(async () => {
    const { data: { session } } = await sb.auth.getSession();
    if (session) { hide('login-screen'); show('dashboard-screen'); loadDashboardData(); }
})();

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active-tab'));
    document.getElementById(`tab-${tabId}`)?.classList.add('active');
    const btn = document.querySelector(`.tab-btn[data-target="${tabId}"]`);
    if (btn) btn.classList.add('active-tab');
    const titles = { dashboard:'Overview', gallery:'Gallery', notices:'Notices', inbox:'Inbox', settings:'Settings' };
    const t = document.getElementById('page-title'); if(t) t.innerText = titles[tabId]||'';
    if (window.innerWidth < 768) { document.getElementById('sidebar')?.classList.add('-translate-x-full'); document.getElementById('sidebar-overlay')?.classList.add('hidden'); }
}
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('-translate-x-full');
    document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
}

// Auth
async function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    hide('login-error');
    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) { document.getElementById('login-error-text').textContent = error.message; show('login-error'); }
    else { hide('login-screen'); show('dashboard-screen'); loadDashboardData(); }
}
async function logout() { await sb.auth.signOut(); hide('dashboard-screen'); show('login-screen'); }

// Load all data
async function loadDashboardData() {
    const [nR, gR, mR] = await Promise.all([
        sb.from('notices').select('*').order('created_at', { ascending: false }),
        sb.from('gallery').select('*').order('created_at', { ascending: false }),
        sb.from('messages').select('*').order('created_at', { ascending: false })
    ]);
    const notices = nR.data || [], gallery = gR.data || [], messages = mR.data || [];

    document.getElementById('stat-gallery').innerText = gallery.length;
    document.getElementById('stat-notices').innerText = notices.length;
    document.getElementById('stat-messages').innerText = messages.length;
    if (messages.length > 0) { show('msg-badge'); document.getElementById('msg-badge').innerText = messages.length; } else hide('msg-badge');

    // Notices
    const nl = document.getElementById('notices-list');
    nl.innerHTML = notices.length === 0 ? '<p class="text-gray-500 italic p-4 bg-white rounded-xl border">No active notices.</p>'
        : notices.map(n => `<div class="bg-white p-4 border rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center gap-4 group">
            <div class="flex items-center gap-4"><div class="bg-gray-50 p-3 rounded-xl text-center min-w-[70px] border"><span class="block text-xl font-bold text-gray-800">${n.date}</span><span class="block text-xs uppercase font-bold text-gray-500">${n.month}</span></div>
            <div><h4 class="font-bold text-gray-900">${n.title}</h4><p class="text-sm text-gray-500 line-clamp-1 max-w-md">${n.description}</p></div></div>
            <button onclick="deleteNotice(${n.id})" class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition shrink-0"><i data-lucide="trash-2" class="w-5 h-5"></i></button></div>`).join('');

    // Gallery
    const gl = document.getElementById('gallery-list');
    gl.innerHTML = gallery.length === 0 ? '<p class="text-gray-500 col-span-full italic">No photos.</p>'
        : gallery.map(g => `<div class="group relative rounded-2xl overflow-hidden border shadow-sm bg-gray-100">
            <img src="${g.image_url}" class="w-full h-48 object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
            <p class="text-white text-sm font-medium mb-2">${g.alt_text}</p>
            <button onclick="deleteGallery(${g.id},'${g.image_url.split('/').pop()}')" class="w-full bg-red-500/90 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition text-sm">Remove</button></div></div>`).join('');

    // Messages
    const ml = document.getElementById('messages-list');
    ml.innerHTML = messages.length === 0 ? '<div class="bg-white p-12 text-center rounded-2xl border"><p class="text-gray-500">Inbox empty!</p></div>'
        : messages.map(m => `<div class="bg-white p-5 border-l-4 border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition group">
            <div class="flex justify-between items-center gap-2 mb-3"><div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">${m.name.charAt(0).toUpperCase()}</div>
            <div><p class="font-bold text-gray-900">${m.name}</p><p class="text-xs text-gray-500">${m.email} • ${new Date(m.created_at).toLocaleDateString()}</p></div></div>
            <button onclick="deleteMessage(${m.id})" class="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>
            <h4 class="font-bold text-gray-800 mb-2">${m.subject || 'No Subject'}</h4>
            <p class="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl">${m.message}</p></div>`).join('');
    lucide.createIcons();
}

// Compress image client-side
function compressImage(file) {
    return new Promise(resolve => {
        const img = new Image(), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > 1200) { h = (h * 1200) / w; w = 1200; }
            canvas.width = w; canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(resolve, 'image/webp', 0.8);
        };
        img.src = URL.createObjectURL(file);
    });
}

// Upload image
async function uploadImage() {
    const fileInput = document.getElementById('image-upload'), alt = document.getElementById('image-alt').value;
    const btn = document.getElementById('btn-upload');
    if (!fileInput.files[0]) return alert('Select an image first.');
    btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Uploading...'; btn.disabled = true;
    try {
        const compressed = await compressImage(fileInput.files[0]);
        const filename = Date.now() + '.webp';
        const { error: upErr } = await sb.storage.from('gallery').upload(filename, compressed, { contentType: 'image/webp' });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = sb.storage.from('gallery').getPublicUrl(filename);
        const { error: dbErr } = await sb.from('gallery').insert({ image_url: publicUrl, alt_text: alt || 'School Photo' });
        if (dbErr) throw dbErr;
        fileInput.value = ''; document.getElementById('image-alt').value = '';
        show('gallery-status'); setTimeout(() => hide('gallery-status'), 3000);
        loadDashboardData();
    } catch (e) { alert('Upload failed: ' + e.message); }
    btn.innerHTML = '<i data-lucide="plus-circle" class="w-5 h-5"></i> Publish Photo'; btn.disabled = false;
}

// Add notice
async function addNotice() {
    const title = document.getElementById('notice-title').value, dateStr = document.getElementById('notice-date').value, desc = document.getElementById('notice-desc').value;
    const btn = document.getElementById('btn-notice');
    if (!title || !dateStr || !desc) return alert('Fill all fields');
    btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Publishing...'; btn.disabled = true;
    const parts = dateStr.split(' '), date = parts[0] || '01', month = parts[1] || 'Jan';
    const { error } = await sb.from('notices').insert({ title, description: desc, date, month, is_urgent: true, posted_text: 'Posted just now', color_class: 'secondary' });
    if (error) alert(error.message);
    else { document.getElementById('notice-title').value = ''; document.getElementById('notice-date').value = ''; document.getElementById('notice-desc').value = ''; show('notice-status'); setTimeout(() => hide('notice-status'), 3000); loadDashboardData(); }
    btn.innerHTML = '<i data-lucide="send" class="w-5 h-5"></i> Broadcast Notice'; btn.disabled = false;
}

// Delete actions
async function deleteNotice(id) { if (!confirm('Delete this notice?')) return; await sb.from('notices').delete().eq('id', id); loadDashboardData(); }
async function deleteGallery(id, filename) {
    if (!confirm('Delete this photo?')) return;
    await sb.storage.from('gallery').remove([filename]);
    await sb.from('gallery').delete().eq('id', id);
    loadDashboardData();
}
async function deleteMessage(id) { if (!confirm('Delete this message?')) return; await sb.from('messages').delete().eq('id', id); loadDashboardData(); }

// Change password
async function changePassword() {
    const curr = document.getElementById('current-pass').value, newP = document.getElementById('new-pass').value, conf = document.getElementById('confirm-pass').value;
    const status = document.getElementById('password-status');
    if (!curr || !newP || !conf) { status.innerText = 'Fill all fields.'; status.className = 'mt-3 text-sm font-bold text-center text-red-500'; show('password-status'); return; }
    if (newP !== conf) { status.innerText = 'Passwords do not match!'; status.className = 'mt-3 text-sm font-bold text-center text-red-500'; show('password-status'); return; }
    const { error } = await sb.auth.updateUser({ password: newP });
    if (error) { status.innerText = error.message; status.className = 'mt-3 text-sm font-bold text-center text-red-500'; }
    else { status.innerText = 'Password updated!'; status.className = 'mt-3 text-sm font-bold text-center text-green-500'; document.getElementById('current-pass').value = ''; document.getElementById('new-pass').value = ''; document.getElementById('confirm-pass').value = ''; }
    show('password-status'); setTimeout(() => hide('password-status'), 5000);
}
// Enter key login
document.getElementById('password')?.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
