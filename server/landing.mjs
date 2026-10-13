// The front page for a visitor who isn't signed in (arkpals.world): what Ark Pals is, what's in it, what it
// costs, and how a parent starts a family (public sign-up, when SIGNUP_OPEN is on) or signs in. A parent signs up
// with their family's name, their own name and their email, and agrees for their children; the family is made
// only when they open the link we email them (which also shows the email is theirs).

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const STYLE = `
:root{--ink:#3b2a4a;--muted:#7a6a8a;--pink:#e2468f;--pink2:#ff6fae;--line:#f0c4da;--bg:#fff7fb;--sky:#e6f4ff}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--pink)}
.wrap{max-width:1040px;margin:0 auto;padding:0 20px}
header.top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:var(--pink);text-decoration:none}
.brand img{width:40px;height:40px}
.top nav{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-block;border:0;border-radius:16px;padding:12px 22px;font:inherit;font-weight:800;text-decoration:none;cursor:pointer;text-align:center}
.btn.pink{background:var(--pink2);color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.1)}
.btn.white{background:#fff;color:var(--pink);border:2px solid var(--line)}
.hero{display:grid;grid-template-columns:1.1fr 1fr;gap:34px;align-items:center;padding:26px 0 40px}
.hero h1{font-size:46px;line-height:1.1;margin:0 0 14px;color:var(--ink)}
.hero h1 b{color:var(--pink)}
.hero p.lead{font-size:20px;color:var(--muted);margin:0 0 22px}
.hero .cta{display:flex;gap:12px;flex-wrap:wrap}
.shot{width:100%;border-radius:22px;box-shadow:0 14px 40px rgba(120,60,100,.18);background:#fff;display:block}
.band{background:#fff;border-top:2px solid var(--line);border-bottom:2px solid var(--line);padding:38px 0}
h2{font-size:30px;margin:0 0 18px;text-align:center}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:#fff;border:2px solid var(--line);border-radius:20px;padding:18px 20px}
.band .card{background:var(--bg)}
.card h3{margin:0 0 6px;font-size:19px}
.card p{margin:0;color:var(--muted);font-size:16px}
.shots{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:24px}
section{padding:40px 0}
.prices{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:900px;margin:0 auto}
.price{text-align:center}
.price .amt{font-size:34px;font-weight:800;color:var(--pink);margin:6px 0}
.small{font-size:14px;color:var(--muted)}
.center{text-align:center}
form.signup{max-width:480px;margin:0 auto;background:#fff;border:2px solid var(--line);border-radius:24px;padding:24px}
form label{display:block;font-weight:700;margin:12px 0 4px}
form input[type=text],form input[type=email]{width:100%;font:inherit;font-size:18px;padding:12px 14px;border-radius:14px;border:2px solid var(--line)}
form .check{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:15px;margin:16px 0}
form .check input{width:22px;height:22px;margin-top:2px;flex:0 0 auto}
form .btn{width:100%;margin-top:6px;font-size:20px}
.err{background:#ffe2e2;color:#b42318;border-radius:12px;padding:10px 14px;margin:0 0 10px}
.ok{background:#e9f9ee;color:#1d6b3a;border-radius:12px;padding:14px 16px}
footer{padding:30px 0 50px;color:var(--muted);font-size:14px;text-align:center}
footer a{color:var(--muted)}
@media (max-width:820px){
  .hero{grid-template-columns:1fr;gap:22px;padding-top:10px}.hero h1{font-size:36px}
  .grid,.prices{grid-template-columns:1fr}.shots{grid-template-columns:1fr}
  .top nav .btn{padding:10px 14px}
}`

const FEATURES = [
  ['27 Bible islands', 'Sail from Creation to Pentecost: each island is a living picture book, a game made just for that story, and a memory verse.'],
  ['Reading and math that grow', 'Letter sounds to tiny stories, counting to coins and clocks: ten levels each, and a short treasure hunt finds where to start.'],
  ['Friendly Pals', 'More than 60 Pals to meet, feed, dress up and grow, with friendly battles that chase grumpiness away with kindness.'],
  ['Songs and bedtime', 'A sing-along with Bible songs, a bedtime story, and a birthday party with your child\'s own name and family.'],
  ['Your family in the story', 'Your children choose how they look in the pictures, and the stories know who Mom, Dad, brothers, sisters and pets are.'],
  ['Safe by design', 'No ads, no chat, no tracking, nothing sold. Grown-ups sign in, not children, and you can download or delete everything.'],
]

/** The front page. `open`: whether anyone may sign up (else it's by invitation). `form`: a sign-up form to show again, with a message. */
export function landingPage({ open, email, form = null, signedUpTo = null, signInSent = false }) {
  const v = form?.values ?? {}
  const signup = signedUpTo
    ? `<div class="ok"><b>Check your email.</b> We sent a link to <b>${esc(signedUpTo)}</b>. Open it on the phone or tablet your children will play on, and tap <b>Start our family</b>. It works once, for 24 hours. (Nothing there? Look in the spam folder.)</div>`
    : open && email
      ? `<form class="signup" method="post" action="/signup#start">
${form?.msg ? `<div class="err">${esc(form.msg)}</div>` : ''}
<label for="family">Your family's name</label><input type="text" id="family" name="family" maxlength="40" placeholder="The Smith family" value="${esc(v.family)}" required>
<label for="you">Your name (what your family calls you)</label><input type="text" id="you" name="you" maxlength="40" placeholder="Mom" value="${esc(v.you)}" required>
<label for="email">Your email</label><input type="email" id="email" name="email" maxlength="254" autocomplete="email" value="${esc(v.email)}" required>
<label class="check"><input type="checkbox" name="consent" value="yes" required> <span>I'm a parent or legal guardian of the children who'll play, I'm 18 or older, and I agree to the <a href="/terms" target="_blank">Terms</a> and the <a href="/privacy" target="_blank">Privacy Policy</a> for my family.</span></label>
<button class="btn pink">Email me the link</button>
<p class="small center">We'll send a link to start your family. Your first week of a plan is free, and you can cancel any time.</p>
</form>`
      : `<div class="card center"><h3>Ark Pals is in a small church beta right now</h3><p>Families join by invitation for now. To ask for one, write to <a href="mailto:hello@arkpals.world">hello@arkpals.world</a>.</p></div>`
  const signin = email
    ? `<form class="signup" method="post" action="/login/email">
<p style="margin:0 0 6px"><b>Already have a family?</b> Get a sign-in link by email:</p>
${signInSent ? '<div class="ok">If that email belongs to a grown-up in a family here, a sign-in link is on its way. It works once, for 30 minutes.</div>' : ''}
<input type="email" name="email" autocomplete="email" aria-label="Your email" placeholder="Your email" required style="margin-top:6px">
<button class="btn white" style="margin-top:12px">Email me a link</button>
<p class="small center" style="margin-top:12px">Have a link from your family? Just open it. <a href="/login">Other ways to sign in</a></p>
</form>`
    : `<p class="center"><a class="btn white" href="/login">Sign in</a></p>`
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ark Pals: a Bible adventure for kids 4 to 7</title>
<meta name="description" content="A Bible adventure game for children ages 4 to 7: 27 story islands, reading and math that grow with your child, friendly Pals, songs, and your own family in the stories. No ads, no chat, no tracking.">
<link rel="icon" href="/icon.svg"><style>${STYLE}</style></head>
<body>
<div class="wrap">
<header class="top"><a class="brand" href="/"><img src="/icon.svg" alt="">Ark Pals</a>
<nav><a class="btn white" href="#signin">Sign in</a>${open ? '<a class="btn pink" href="#start">Start your family</a>' : ''}</nav></header>
<div class="hero">
<div><h1>A Bible adventure for kids <b>4 to 7</b></h1>
<p class="lead">Sail through the Bible's big stories, learn to read and count along the way, and make friends with the Pals: a game your family plays together, made by a family for families.</p>
<div class="cta">${open ? '<a class="btn pink" href="#start">Start your family</a>' : ''}<a class="btn white" href="#inside">See what's inside</a></div></div>
<img class="shot" src="/landing/map.jpg" alt="The map: islands on a blue sea, with an ark sailing between them">
</div>
</div>
<div class="band" id="inside"><div class="wrap">
<h2>What's inside</h2>
<div class="grid">${FEATURES.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
<div class="shots"><img class="shot" src="/landing/story.jpg" alt="A story page: Noah's ark with the animals"><img class="shot" src="/landing/pals.jpg" alt="Choosing a first Pal"></div>
</div></div>
<div class="wrap">
<section id="prices"><h2>One plan for the whole family</h2>
<div class="prices">
<div class="card price"><h3>Yearly</h3><div class="amt">$79</div><p>a year: about $6.58 a month</p></div>
<div class="card price"><h3>Monthly</h3><div class="amt">$9.99</div><p>a month</p></div>
<div class="card price"><h3>Grace price</h3><div class="amt">$4.99</div><p>a month, for a family that needs it: no questions asked</p></div>
</div>
<p class="center small" style="margin-top:16px">Up to 4 children and all your grown-ups. Your first week is free, and you can cancel any time. Have a Grace code from your church? It's free for its months, with no card at all. Sales tax is added where it applies.</p>
</section>
<section id="start"><h2>${signedUpTo ? 'Almost there' : 'Start your family'}</h2>${signup}</section>
<section id="signin" style="padding-top:0">${signin}</section>
</div>
<footer><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="mailto:hello@arkpals.world">hello@arkpals.world</a><br>Ark Pals is made by Marchal Technologies LLC. Bible quotations are from the World English Bible.</footer>
</body></html>`
}
