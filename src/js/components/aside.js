import { getAllDocuments, viewDocument } from "../modules/api.js";
import { navigateFn } from "../modules/history.js";
const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_FILEDATA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"
><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_PLUS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>`;

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
    const temp = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      const aEl = document.createElement("a");
      aEl.href = "#none";
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

      const utilDiv = document.createElement("div");
      utilDiv.className = "util";
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

    return temp;
  },
};

aside.init().then(() => {
  /* History API로 SPA 구현 */
  history.replaceState(
    //처음 로드 됐을 때 state 추가
    { isHome: true },
    "",
    ""
  );

  // 페이지 간 동작
  const pageItems = document.querySelectorAll("li");

  // 왼쪽 페이지 클릭 동작
  pageItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const id = item.dataset.id;

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(id);

      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });
    });
  });

  window.addEventListener("popstate", (event) => {
    if (event.state !== null) {
      // 이전 페이지 기록 있으면
      const state = { event: event.type, ...event.state };
      navigateFn(state);
    } else {
      // 없으면 같은 페이지에 머무르게
      history.replaceState(event.state, "", location.href);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // +버튼 클릭 시 하위에 새 페이지 추가
  document
    .querySelectorAll('.page-item .util [role="button"]')
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        // 부모 page-item 찾기
        const parentItem = btn.closest(".page-item");
        if (!parentItem) return;

        // 하위 페이지 리스트(ul) 찾기 또는 생성
        let childList = parentItem.parentElement.querySelector("ul");
        if (!childList) {
          childList = document.createElement("ul");
          parentItem.parentElement.appendChild(childList);
        }

        // 새 페이지 li 생성
        const newLi = document.createElement("li");
        newLi.innerHTML = `
        <a href="#none" class="page-item pl-6">
          <div class="icon"><i data-lucide="file-text"></i></div>
          <div class="title flex-1">새 페이지</div>
          <div class="util"></div>
        </a>
      `;
        childList.appendChild(newLi);

        // 새 페이지 클릭 시 브래드크럼에 경로 추가
        const newPageLink = newLi.querySelector(".page-item");
        newPageLink.addEventListener("click", function (ev) {
          ev.stopPropagation();
          const breadcrumb = document.querySelector(".breadcrumb ol");
          if (breadcrumb) {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#none">새 페이지</a>`;
            breadcrumb.appendChild(li);
          }
        });
      });
    });
});
