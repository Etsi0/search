type bang = {
	c: string,
	d: string,
	r: number,
	s: string,
	sc: string,
	t: string,
	u: string
}

function renderPage() {
	const body = document.body;
	body.innerHTML = `
		<main class="grow grid place-content-center place-items-center gap-4 text-center">
			<h1 class="!text-[clamp(0rem,_0rem_+_12vw,_3rem)]">Phadonia&nbsp;<span class="text-primary-500">Search</span></h1>
			<form method="GET" action="?">
				<input class="w-full border border-primary-500/62 bg-body-50 px-4 py-2 rounded-full shadow-md-lg transition-[shadow,_border] shadow-body-300 focus-visible:shadow-md hover:shadow-md dark:bg-body-200 dark:border-body-300 dark:shadow-none dark:hover:shadow-none dark:focus-visible:border-primary-500/62 dark:focus-visible:shadow-none" type="search" name="q" placeholder="Search the web..." aria-label="Search" size="65" autofocus>
			</form>
			<p>Fast search router that supports <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs</a> without impacting speed.</p>
			<div class="flex gap-1">
				<input class="w-full border border-primary-500/62 bg-body-50 rounded-md px-1 py-0.5 dark:bg-body-200 dark:border-body-300" type="text" size="25" value="https://search.phadonia.com?q=%s" readonly />
				<button class="bg-primary-500 text-input px-3 py-1 rounded-md hover:opacity-85 active:opacity-50 focus-visible:opacity-50">
					<img class="invert" src="/clipboard.svg" alt="Copy" />
				</button>
			</div>
		</main>
		<footer>
			<nav>
				<ul class="flex justify-center gap-4 py-4">
					<li><a href="https://www.phadonia.com" target="_blank">Phadonia</a></li>
					<li><a href="https://github.com/Etsi0/search" target="_blank">GitHub</a></li>
				</ul>
			</nav>
		</footer>
	`;

	const copyButton = body.querySelector<HTMLButtonElement>("button")!;
	const copyIcon = copyButton.querySelector("img")!;
	const urlInput = body.querySelector<HTMLInputElement>('input[type="text"]')!;

	copyButton.addEventListener("click", copyToClipboard);
	copyButton.addEventListener("keydown", (e) => { if (e.key === 'Enter') copyToClipboard(); });

	async function copyToClipboard() {
		await navigator.clipboard.writeText(urlInput.value);
		copyIcon.src = "/clipboard-check.svg";

		setTimeout(() => {
			copyIcon.src = "/clipboard.svg";
		}, 2000);
	};
}

function findBang(value?: string): bang | undefined {
	if (!value) {
		return;
	}

	bangs.unshift({
		c: '',
		d: '',
		r: 0,
		s: '',
		sc: '',
		t: 'kagi',
		u: 'https://kagi.com/search?q={{{s}}}'
	})
	return bangs.find((b: bang) => b.t === value);
}

function getUrl() {
	const query = new URL(window.location.href).searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return;
	}

	/* Get bang from query */
	const match = query.match(/!(\S+)/i);
	const bangCandidate = match?.[1].toLowerCase();

	/* Get bang from array */
	const selectedBang = findBang(bangCandidate) ?? findBang('sp');

	/* Remove bang from query */
	const cleanQuery = (bangCandidate === selectedBang?.t ? query.replace(`!${bangCandidate}`, '') : query).trim();

	/* Formats new url */
	const url = selectedBang?.u.replace('{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/'));
	if (!url) {
		return;
	}

	return url;
}

let bangs: bang[] = [];
async function fetchBangs() {
	const response = await fetch('/api/bang');

	if (!response.ok) {
		throw new Error(`Failed to fetch bangs: ${response.status}`);
	}

	bangs = await response.json();
}

fetchBangs().then(() => {
	const url = getUrl();
	if (!url) {
		renderPage();
		return;
	}

	window.location.replace(url);
});