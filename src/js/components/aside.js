import { getAllDocuments } from "../modules/document.js";
// import { createIcons, icons } from "lucide";

// createIcons({ icons });

const aside = {
  data: [],
  async init() {
    const data = await getAllDocuments();
    this.data = data ?? [];
    this.render(this.data);
  },
  render(data) {
    const $aside = document.querySelector("nav.aside-menu");
    const $rootList = $aside.querySelector(".body");
    $rootList.append(this.buildItems(data));
  },
  buildItems(nodes, depth = 0) {
    const temp = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      // <a class="page-item pl-{기본값 + 단계별로 곱하기}"
      const aEl = document.createElement("a");
      aEl.href = "#none";
      aEl.className = `page-item pl-${2 + depth * 2}`;

      // <div class="icon"><i data-lucide="file|file-text"></i></div>
      const iconDiv = document.createElement("div");
      iconDiv.className = "icon";
      const iEl = document.createElement("i");
      iEl.dataset.lucide =
        (node.documents?.length ?? 0) > 0 ? "file-text" : "file";
      iconDiv.appendChild(iEl);

      // <div class="title flex-1">제목</div>
      const titleDiv = document.createElement("div");
      titleDiv.className = "title flex-1";
      titleDiv.textContent = node.title || "새 페이지";

      // <div class="util"></div>
      // <div role="button" aria-label="새 페이지 만들기" data-tooltip="새 페이지 만들기"><i data-lucide="plus"></i></div>
      const utilDiv = document.createElement("div");
      utilDiv.className = "util";
      const buttonDiv = document.createElement("div");
      buttonDiv.setAttribute("role", "button");
      buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
      buttonDiv.dataset.tooltip = "새 페이지 만들기";
      utilDiv.append(buttonDiv);

      aEl.append(iconDiv, titleDiv, utilDiv);
      liEl.append(aEl);

      const children = node.documents || [];

      if (children.length > 0) {
        const ulEl = document.createElement("ul");
        ulEl.append(this.buildItems(children, depth + 1));
        liEl.appendChild(ulEl);
      }
      temp.append(liEl);
    }

    console.log(temp);
    return temp;
  },
};

aside.init();
