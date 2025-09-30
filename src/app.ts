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

/*==================================================
	WebUI
==================================================*/
function renderPage(): void {
	const head = document.head;
	const body = document.body;

	/*==================================================
		Load in font
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
		Load in DOM
	==================================================*/
	body.innerHTML = `
		<header>
			<div class="flex justify-end h-14 p-3">
				<button class="text-text-900 h-full cursor-pointer" aria-label="settings menu button">
					<svg class="h-full transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
						<path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
					</svg>
				</button>
			</div>
			<hr />
			<aside class="fixed bg-body-50/90 backdrop-blur-xl h-[calc(100vh_-_3.5rem)] right-0 p-4 border-l border-body-100 z-9999 transition-transform duration-225" inert>
				<form>
					<label class="flex items-center gap-4">
						Default Bang
						<input class="bg-body-100 px-3 py-1 rounded-md border border-body-200" name="defaultBang" type="text" placeholder="${defaultBang}" value="${storedBang ?? ''}" />
					</label>
				</form>
			</aside>
		</header>
		<main class="grow grid place-content-center place-items-center gap-4 text-center">
			<h1 class="text-[clamp(0rem,_0rem_+_12vw,_3rem)]">Phadonia&nbsp;<span class="text-primary-500">Search</span></h1>
			<form method="GET" action="?">
				<input class="bg-white w-full px-4 py-2 border border-body-100 rounded-full outline-transparent transition-[border] hover:border-primary-500/50 focus-visible:border-primary-500 dark:bg-body-100 dark:border-body-200" type="search" name="q" placeholder="Search the web..." aria-label="Search" size="65" autofocus>
			</form>
			<p>Fast search router that supports <a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="https://duckduckgo.com/bang.html" target="_blank" noreferrer>all of DuckDuckGo's bangs</a> without impacting speed.<br />Also has the option to use <a class="text-primary-400 underline rounded-xs transition-[filter] hover:brightness-150" href="?q=corgi%20!kagi" target="_blank" noreferrer>Kagi search</a></p>
			<div id="clipboard" class="flex gap-2 h-full">
				<input class="bg-white w-full px-1 py-0.5 rounded-md border border-body-100 dark:bg-body-100 dark:border-body-200" type="text" name="clipboard" size="25" value="https://search.phadonia.com?q=%s" readonly />
				<button class="text-text-900 bg-primary-500 px-3 py-1 rounded-md hover:opacity-85 active:opacity-50" aria-label="Copy search url">
					<svg class="h-full" viewBox="0 0 25 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<mask id="a">
							<rect width="25" height="24" fill="white"/>
							<path d="M16.7311 11.5053C16.7345 11.6996 16.6624 11.8877 16.5299 12.0298L12.5299 16.0298C12.2399 16.3298 11.7699 16.3298 11.4699 16.0298L9.46991 14.0298C9.39622 13.9612 9.33712 13.8784 9.29613 13.7864C9.25514 13.6944 9.23309 13.5951 9.23132 13.4944C9.22954 13.3937 9.24807 13.2936 9.28579 13.2002C9.32351 13.1069 9.37965 13.022 9.45087 12.9508C9.52209 12.8796 9.60692 12.8234 9.70031 12.7857C9.7937 12.748 9.89373 12.7295 9.99443 12.7313C10.0951 12.733 10.1944 12.7551 10.2864 12.7961C10.3784 12.8371 10.4612 12.8962 10.5299 12.9698L11.9999 14.4398L15.4699 10.9698C15.6121 10.8374 15.8001 10.7652 15.9944 10.7687C16.1887 10.7721 16.3741 10.8508 16.5115 10.9882C16.6489 11.1256 16.7277 11.311 16.7311 11.5053Z" fill="black"/>
						</mask>
						<path id="clipboard__path" d="M17.5 3.99988V3.87988C18.35 4.00988 19.07 4.27988 19.65 4.84988C20.25 5.44988 20.51 6.20988 20.63 7.10988C20.75 7.97988 20.75 9.07988 20.75 10.4499V15.5499C20.75 16.9199 20.75 18.0299 20.63 18.8899C20.51 19.7899 20.25 20.5499 19.65 21.1499C19.05 21.7499 18.29 22.0099 17.39 22.1299C16.52 22.2499 15.42 22.2499 14.05 22.2499H10.95C9.58 22.2499 8.48 22.2499 7.61 22.1299C6.76723 22.0694 5.97018 21.7237 5.35 21.1499C4.75 20.5499 4.49 19.7899 4.37 18.8899C4.25 18.0299 4.25 16.9199 4.25 15.5599V10.4499C4.25 9.07988 4.25 7.97988 4.37 7.10988C4.49 6.20988 4.75 5.44988 5.35 4.84988C5.93 4.26988 6.65 4.00988 7.5 3.87988V4.06988C7.5 4.46988 7.5 4.91988 7.55 5.29988C7.61 5.73988 7.76 6.29988 8.23 6.76988C8.7 7.23988 9.26 7.38988 9.7 7.44988C10.08 7.49988 10.52 7.49988 10.93 7.49988H14.07C14.47 7.49988 14.92 7.49988 15.3 7.44988C15.74 7.38988 16.3 7.23988 16.77 6.76988C17.24 6.29988 17.39 5.73988 17.45 5.29988C17.5 4.91988 17.5 4.47988 17.5 4.06988V3.99988Z" mask="" />
						<path d="M10.5 2.23047C9.67 2.23047 9 2.90047 9 3.73047C9 4.68047 9 5.41047 9.3 5.71047C9.59 6.00047 10.06 6.00047 11 6.00047H14C14.94 6.00047 15.41 6.00047 15.7 5.70047C16 5.41047 16 4.68047 16 3.73047C16 2.90047 15.33 2.23047 14.5 2.23047H10.5Z" />
					</svg>
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

	/*==================================================
		EventListeners - Clipboard
	==================================================*/
	const copyWrapper = body.querySelector<HTMLDivElement>("#clipboard")!;
	const copyButton = copyWrapper.querySelector<HTMLButtonElement>("button")!;
	const copyIcon = copyButton.querySelector<SVGPathElement>("#clipboard__path")!;
	const urlInput = copyWrapper.querySelector<HTMLInputElement>('input[name="clipboard"]')!;

	copyButton.addEventListener("click", async () => {
		await navigator.clipboard.writeText(urlInput.value);
		copyIcon.setAttribute('mask', 'url(#a)');

		setTimeout(() => {
			copyIcon.setAttribute('mask', '');
		}, 2000);
	});

	/*==================================================
		EventListeners - Sidebar
	==================================================*/
	const sidebarButton = body.querySelector<HTMLButtonElement>('header button')!;
	const sidebar = body.querySelector<HTMLElement>('aside')!;
	const sidebarForm = sidebar.querySelector<HTMLFormElement>('form')!;
	const defaultBangInput = sidebarForm.querySelector<HTMLInputElement>('input[name="defaultBang"]')!;

	sidebarButton.addEventListener("click", () => sidebar.inert = !sidebar.inert);
	sidebarForm.addEventListener("submit", (e) => { e.preventDefault(); });
	defaultBangInput.addEventListener("keydown", () => {
		setTimeout(() => {
			localStorage.setItem('defaultBang', defaultBangInput.value);
		}, 10);
	});
}

/*==================================================
	Search
==================================================*/
function findBang(value?: string): bang | undefined {
	if (!value) {
		return;
	}

	return bangs.find((b: bang) => b.t === value);
}

function findFirstBang(): bang | undefined {
	const match = query.match(/!(\S+)/g);
	if (!match) {
		return;
	}

	for (const b of match) {
		const candidate = findBang(b.slice(1));
		if (candidate) {
			return candidate;
		}
	}

	return;
}

function getUrl(): string | undefined {
	const bangCandidate = findFirstBang();
	const selectedBang = bangCandidate ?? findBang(storedBang ?? defaultBang);

	const cleanQuery = (bangCandidate?.t === selectedBang?.t ? query.replace(`!${bangCandidate?.t}`, '') : query).trim();
	const url = selectedBang?.u.replace('{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/'));
	if (!url) {
		return;
	}

	return url;
}

/*==================================================
	Get bangs from API
==================================================*/
async function fetchBangs(): Promise<void> {
	const response = await fetch('/api/bang');

	if (!response.ok) {
		throw new Error(`Failed to fetch bangs: ${response.status}`);
	}

	bangs = await response.json();
}

/*==================================================
	INIT
==================================================*/
(async () => {
	if (query) {
		try {
			await fetchBangs();
			const url = getUrl();
			if (url) {
				window.location.replace(url);
				return;
			}
		} catch {}
	}

	renderPage();
	window.addEventListener('load', () => {
		window.requestIdleCallback(() => {
			fetchBangs().catch(() => {});
		});
	}, { once: true });
})();