// index
import '../css/index.scss'

// フェードイン
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
});
document.querySelectorAll('.l-content').forEach(item => observer.observe(item));

async function init() {
  // ==================== Instagram API ====================
  // セッション初期化
  await fetch('/api/session-init', {
    method: "POST",
    credentials: "include",
  });

  // Instagram API呼び出し
  // fetch("https://your-vercel-app.vercel.app/api/instagram") // 他サイトからの呼び出し
  const res = await fetch('/api/instagram', {
    credentials: "include",
  }).catch(err => {
    console.error(err);
  });
  const data = await res.json();
  const container = document.getElementById('insta-feed');
  data.forEach(item => {
    const link = document.createElement('a');
    link.href = item.permalink;
    link.target = '_blank';
    const img = document.createElement('img');
    img.src = item.media_url;
    img.alt = item.caption || '';
    img.className = 'insta-image';
    link.appendChild(img);
    container.appendChild(link);
  });
}
init();
