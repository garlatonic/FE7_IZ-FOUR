import { getAllDocuments, viewDocument } from "../core/api.js";
// import { updatePage } from "../modules/modify.js";
const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_FILEDATA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"
><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_PLUS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>`;
const ICON_MORE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#575757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;

const aside = {
  $rootList: document.querySelector("nav.aside-menu .body"),
  data: [],
  async init() {
    const data = await getAllDocuments();
    this.data = data ?? [];
    this.render(this.data);
  },
  render(data) {
    this.$rootList.append(this.buildItems(data));
  },
  buildItems(nodes, depth = 0) {
    const ulEl = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      const aEl = document.createElement("a");
      aEl.href = `/documents/${node.id}`;
      aEl.dataset.link = `/documents/${node.id}`;
      aEl.className = `page-item pl-${2 + depth * 2}`;

      const iconDiv = document.createElement("div");
      iconDiv.className = "icon";
      iconDiv.innerHTML = ICON_FILE;

      const titleDiv = document.createElement("div");
      titleDiv.className = "title flex-1";
      titleDiv.textContent = node.title || "새 페이지";

      const buttonDiv = document.createElement("div");
      buttonDiv.setAttribute("role", "button");
      buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
      buttonDiv.dataset.tooltip = "새 페이지 만들기";
      buttonDiv.innerHTML = ICON_PLUS;

      const etcDiv = document.createElement("div");
      etcDiv.setAttribute("role", "button");
      etcDiv.setAttribute("aria-label", "더보기 메뉴 열기");
      etcDiv.dataset.tooltip = "새 페이지 만들기";
      etcDiv.dataset.dialog = "more";
      etcDiv.innerHTML = ICON_MORE;

      const utilDiv = document.createElement("div");
      utilDiv.className = "util flex gap-1";
      utilDiv.append(etcDiv, buttonDiv);

      aEl.append(iconDiv, titleDiv, utilDiv);
      liEl.append(aEl);

      const children = node.documents || [];

      if (children.length > 0) {
        const temp = document.createDocumentFragment();
        temp.append(this.buildItems(children, depth + 1));
        liEl.appendChild(temp);
      }
      ulEl.append(liEl);
    }

    return ulEl;
  },
};

aside.init();