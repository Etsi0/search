type bang = {
	c: string,
	d: string,
	r: number,
	s: string,
	sc: string,
	t: string,
	u: string
}

const defaultBang = 'sp';
const storedBang = localStorage.getItem('defaultBang') || null;
const params = new URL(window.location.href).searchParams;
const query = params.get('q')?.trim() ?? '';
let bangs: bang[] = [];

function renderPage() {
	const head = document.head;
	const body = document.body;

	/*==================================================
		Load in CSS and fonts only when rendering the page
	==================================================*/
	const gfPreconnect1 = document.createElement('link');
	gfPreconnect1.rel = 'preconnect';
	gfPreconnect1.href = 'https://fonts.googleapis.com';
	gfPreconnect1.setAttribute('data-lazy', 'fonts');
	head.appendChild(gfPreconnect1);

	const gfPreconnect2 = document.createElement('link');
	gfPreconnect2.rel = 'preconnect';
	gfPreconnect2.href = 'https://fonts.gstatic.com';
	gfPreconnect2.crossOrigin = '';
	gfPreconnect2.setAttribute('data-lazy', 'fonts');
	head.appendChild(gfPreconnect2);

	const gfStylesheet = document.createElement('link');
	gfStylesheet.rel = 'stylesheet';
	gfStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap';
	gfStylesheet.setAttribute('data-lazy', 'fonts');
	head.appendChild(gfStylesheet);

	/*==================================================
		Render the page
	==================================================*/
	body.innerHTML = `
		<header>
			<div class="flex justify-end h-14 p-3">
				<label class="h-full cursor-pointer">
					<svg class="h-full transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
						<path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
					</svg>
					<input type="checkbox" onkeypress="if(event.key === 'Enter'){event.preventDefault(); this.click();}" class="w-0 h-0 opacity-0"></input>
				</label>
			</div>
			<hr />
			<nav class="fixed bg-body-50/90 backdrop-blur-xl h-[calc(100vh_-_3.5rem)] right-0 p-4 border-l border-body-100 z-9999 transition-transform duration-225">
				<ul>
					<li>
						<label class="flex items-center gap-4">
							Default Bang
							<input class="bg-body-100 px-3 py-1 rounded-md border border-body-200" name="defaultBang" type="text" placeholder="${defaultBang}" value="${storedBang ?? ''}" />
						</label>
					</li>
				</ul>
			</nav>
		</header>
		<main class="grow grid place-content-center place-items-center gap-4 text-center">
			<h1 class="text-[clamp(0rem,_0rem_+_12vw,_3rem)]">Phadonia&nbsp;<span class="text-primary-500">Search</span></h1>
			<form method="GET" action="?">
				<input class="bg-white w-full px-4 py-2 border border-body-100 rounded-full outline-transparent transition-[border] hover:border-primary-500/50 focus-visible:border-primary-500 dark:bg-body-100 dark:border-body-200" type="search" name="q" placeholder="Search the web..." aria-label="Search" size="65" autofocus>
			</form>
			<p>Fast search router that supports <a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="https://duckduckgo.com/bang.html" target="_blank" noreferrer>all of DuckDuckGo's bangs</a> without impacting speed.<br />Also has the option to use <a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="?q=corgi%20!kagi" target="_blank" noreferrer>Kagi search</a></p>
			<div class="flex gap-2">
				<input class="bg-white w-full px-1 py-0.5 rounded-md border border-body-100 dark:bg-body-100 dark:border-body-200" type="text" name="clipboard" size="25" value="https://search.phadonia.com?q=%s" readonly />
				<button class="bg-primary-500 text-input px-3 py-1 rounded-md hover:opacity-85 active:opacity-50">
					<img class="invert" src="/clipboard.svg" alt="Copy" loading="lazy" />
				</button>
			</div>
		</main>
		<footer>
			<nav>
				<ul class="flex justify-center gap-4 py-4">
					<li><a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="https://www.phadonia.com" target="_blank">Phadonia</a></li>
					<li><a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="https://github.com/Etsi0/search" target="_blank">GitHub</a></li>
				</ul>
			</nav>
		</footer>
	`;

	const copyButton = body.querySelector<HTMLButtonElement>("button")!;
	const copyIcon = copyButton.querySelector("img")!;
	const urlInput = body.querySelector<HTMLInputElement>('input[name="clipboard"]')!;
	const defaultBangInput = body.querySelector<HTMLInputElement>('input[name="defaultBang"]')!;

	copyButton.addEventListener("click", copyToClipboard);
	copyButton.addEventListener("keydown", (e) => { if (e.key === 'Enter') copyToClipboard(); });
	defaultBangInput.addEventListener("keydown", () => defaultBangFunction());

	async function copyToClipboard() {
		await navigator.clipboard.writeText(urlInput.value);
		copyIcon.src = "/clipboard-check.svg";

		setTimeout(() => {
			copyIcon.src = "/clipboard.svg";
		}, 2000);
	}

	async function defaultBangFunction() {
		setTimeout(() => {
			localStorage.setItem('defaultBang', defaultBangInput.value);
		}, 10);
	}
}

function findBang(value?: string): bang | undefined {
	if (!value) {
		return;
	}

	return bangs.find((b: bang) => b.t === value);
}

function getUrl() {
	/* Get bang from query */
	const match = query.match(/!(\S+)/i);
	const bangCandidate = match?.[1].toLowerCase();

	/* Get bang from array */
	const selectedBang = findBang(bangCandidate) ?? findBang(storedBang ?? defaultBang);

	/* Remove bang from query */
	const cleanQuery = (bangCandidate === selectedBang?.t ? query.replace(`!${bangCandidate}`, '') : query).trim();

	/* Formats new url */
	const url = selectedBang?.u.replace('{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/'));
	if (!url) {
		return;
	}

	return url;
}

async function fetchBangs() {
	const response = await fetch('/api/bang');

	if (!response.ok) {
		throw new Error(`Failed to fetch bangs: ${response.status}`);
	}

	bangs = await response.json();
}

if (query) {
	fetchBangs()
		.then(() => {
			const url = getUrl();
			if (!url) {
				renderPage();
				return;
			}
			window.location.replace(url);
		})
		.catch(() => renderPage());
} else {
    renderPage();
	window.addEventListener('load', () => {
        window.requestIdleCallback(() => {
			fetchBangs().catch(() => {});
		});
    }, { once: true });
}