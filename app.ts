function renderPage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	app.innerHTML = `
		<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
		<link rel="stylesheet" href="output.css">
		<main class="grow grid place-content-center place-items-center gap-4 text-center">
			<h1 class="!text-[clamp(0rem,_0rem_+_12vw,_3rem)]">Phadonia&nbsp;<span class="text-primary-500">Search</span></h1>
			<form method="GET" action="?">
				<input class="w-full border border-primary-500 bg-body-50 px-4 py-2 rounded-full shadow-md-lg transition-shadow shadow-body-300 focus-visible:shadow-md hover:shadow-md dark:bg-body-200 dark:shadow-none dark:hover:shadow-none dark:focus-visible:shadow-none" type="search" name="q" placeholder="Search the web..." aria-label="Search" size="65" autofocus>
			</form>
			<p>Search engine that supports <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs</a> without impacting speed.</p>
			<div class="flex gap-1">
				<input class="w-full border border-primary-500 bg-body-50 rounded-md px-1 py-0.5 dark:bg-body-200" type="text" size="25" value="https://search.phadonia.com?q=%s" readonly />
				<button class="bg-primary-500 text-input px-3 py-1 rounded-md hover:opacity-85 active:opacity-50 focus-visible:opacity-50">
					<img class="invert" src="/clipboard.svg" alt="Copy" />
				</button>
			</div>
		</main>
		<footer>
			<nav>
				<ul class="flex justify-center gap-4 py-4">
					<li><a href="https://www.phadonia.com" target="_blank">Phadonia</a></li>
					<li><a href="https://github.com/Etsi0/unduck" target="_blank">GitHub</a></li>
				</ul>
			</nav>
		</footer>
	`;

	const copyButton = app.querySelector<HTMLButtonElement>("button")!;
	const copyIcon = copyButton.querySelector("img")!;
	const urlInput = app.querySelector<HTMLInputElement>('input[type="text"]')!;

	copyButton.addEventListener("click", copyToClipboard);
	copyButton.addEventListener("keydown", async (e) => { if (e.key === 'Enter') copyToClipboard(); });

	async function copyToClipboard() {
		await navigator.clipboard.writeText(urlInput.value);
		copyIcon.src = "/clipboard-check.svg";

		setTimeout(() => {
			copyIcon.src = "/clipboard.svg";
		}, 2000);
	};
}

type bang = {
	c: string,
	d: string,
	r: number,
	s: string,
	sc: string,
	t: string,
	u: string
}

let bangs = [];
async function fetchBangs() {
	const response = await fetch('/api/bang');

	if (!response.ok) {
		throw new Error(`Failed to fetch bangs: ${response.status}`);
	}

	bangs = await response.json();
}
fetchBangs().then(() => {
	doRedirect();
});

function findBang(value?: string): bang | undefined {
	if (!value) {
		return;
	}

	return bangs.find((b: bang) => b.t === value);
}

function getRedirectUrl() {
	const url = new URL(window.location.href);
	const query = url.searchParams.get('q')?.trim() ?? '';
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
	const searchUrl = selectedBang?.u.replace('{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/'));
	if (!searchUrl) {
		return;
	}

	return searchUrl;
}

function doRedirect() {
	const searchUrl = getRedirectUrl();
	if (!searchUrl) {
		renderPage();
		return;
	}

	window.location.replace(searchUrl);
}