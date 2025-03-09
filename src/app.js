var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function renderPage() {
    var app = document.querySelector("#app");
    app.innerHTML = "\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap\" rel=\"stylesheet\">\n\t\t<link rel=\"stylesheet\" href=\"output.css\">\n\t\t<main class=\"grow grid place-content-center place-items-center gap-4 text-center\">\n\t\t\t<h1 class=\"!text-[clamp(0rem,_0rem_+_12vw,_3rem)]\">Phadonia&nbsp;<span class=\"text-primary-500\">Search</span></h1>\n\t\t\t<form method=\"GET\" action=\"?\">\n\t\t\t\t<input class=\"w-full border border-primary-500 bg-body-50 px-4 py-2 rounded-full shadow-md-lg transition-shadow shadow-body-300 focus-visible:shadow-md hover:shadow-md dark:bg-body-200 dark:shadow-none dark:hover:shadow-none dark:focus-visible:shadow-none\" type=\"search\" name=\"q\" placeholder=\"Search the web...\" aria-label=\"Search\" size=\"65\" autofocus>\n\t\t\t</form>\n\t\t\t<p>Search engine that supports <a href=\"https://duckduckgo.com/bang.html\" target=\"_blank\">all of DuckDuckGo's bangs</a> without impacting speed.</p>\n\t\t\t<div class=\"flex gap-1\">\n\t\t\t\t<input class=\"w-full border border-primary-500 bg-body-50 rounded-md px-1 py-0.5 dark:bg-body-200\" type=\"text\" size=\"25\" value=\"https://search.phadonia.com?q=%s\" readonly />\n\t\t\t\t<button class=\"bg-primary-500 text-input px-3 py-1 rounded-md hover:opacity-85 active:opacity-50 focus-visible:opacity-50\">\n\t\t\t\t\t<img class=\"invert\" src=\"/clipboard.svg\" alt=\"Copy\" />\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</main>\n\t\t<footer>\n\t\t\t<nav>\n\t\t\t\t<ul class=\"flex justify-center gap-4 py-4\">\n\t\t\t\t\t<li><a href=\"https://www.phadonia.com\" target=\"_blank\">Phadonia</a></li>\n\t\t\t\t\t<li><a href=\"https://github.com/Etsi0/search\" target=\"_blank\">GitHub</a></li>\n\t\t\t\t</ul>\n\t\t\t</nav>\n\t\t</footer>\n\t";
    var copyButton = app.querySelector("button");
    var copyIcon = copyButton.querySelector("img");
    var urlInput = app.querySelector('input[type="text"]');
    copyButton.addEventListener("click", copyToClipboard);
    copyButton.addEventListener("keydown", function (e) { if (e.key === 'Enter')
        copyToClipboard(); });
    function copyToClipboard() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigator.clipboard.writeText(urlInput.value)];
                    case 1:
                        _a.sent();
                        copyIcon.src = "/clipboard-check.svg";
                        setTimeout(function () {
                            copyIcon.src = "/clipboard.svg";
                        }, 2000);
                        return [2 /*return*/];
                }
            });
        });
    }
    ;
}
var bangs = [];
function fetchBangs() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/bang')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch bangs: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    bangs = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
fetchBangs().then(function () {
    doRedirect();
});
function findBang(value) {
    if (!value) {
        return;
    }
    return bangs.find(function (b) { return b.t === value; });
}
function getRedirectUrl() {
    var _a, _b, _c;
    var url = new URL(window.location.href);
    var query = (_b = (_a = url.searchParams.get('q')) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
    if (!query) {
        return;
    }
    /* Get bang from query */
    var match = query.match(/!(\S+)/i);
    var bangCandidate = match === null || match === void 0 ? void 0 : match[1].toLowerCase();
    /* Get bang from array */
    var selectedBang = (_c = findBang(bangCandidate)) !== null && _c !== void 0 ? _c : findBang('sp');
    /* Remove bang from query */
    var cleanQuery = (bangCandidate === (selectedBang === null || selectedBang === void 0 ? void 0 : selectedBang.t) ? query.replace("!".concat(bangCandidate), '') : query).trim();
    /* Formats new url */
    var searchUrl = selectedBang === null || selectedBang === void 0 ? void 0 : selectedBang.u.replace('{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/'));
    if (!searchUrl) {
        return;
    }
    return searchUrl;
}
function doRedirect() {
    var searchUrl = getRedirectUrl();
    if (!searchUrl) {
        renderPage();
        return;
    }
    window.location.replace(searchUrl);
}
