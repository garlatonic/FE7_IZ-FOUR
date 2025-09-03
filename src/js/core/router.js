import { getAllDocuments, viewDocument } from "./api.js";

// 내부 네비게이션 (이중 슬래시 방지)
function navigateTo(url) {
  const path = new URL(url, location.origin).pathname; // 절대/상대 모두 처리
  history.pushState(null, "", path);
  render();
}

async function render() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  // 홈
  if (path === "/" || path === "/home" || path === "/index.html") {
    const html = await fetch("/pages/home.html").then((r) => r.text());
    document.getElementById("container").innerHTML = html;

    const home = {
      $rootList: document.querySelector(".recent-list").parentNode,
      data: [],
      updatedList: [],
      async init() {
        const data = await getAllDocuments();
        this.data = data ?? [];
        this.render(this.data);
      },
      render(data) {
        this.getItems(data);
        this.$rootList.append(this.showItems(this.sortItems(this.updatedList)));
      },
      getItems(documents) {
        for (const node of documents) {
          const documentInfo = {
            id: node.id,
            title: node.title,
            updatedAt: node.updatedAt,
          };
          this.updatedList.push(documentInfo);

          const children = node.documents || [];

          if (children.length > 0) {
            this.getItems(children);
          }
        }
      },

      sortItems(documents) {
        // console.log(documents);
        const result = documents.sort(function (a, b) {
          if (b.updatedAt > a.updatedAt) {
            return 1;
          }
          if (b.updatedAt < a.updatedAt) {
            return -1;
          }
          return 0;
        });
        return result;
      },
      showItems(node) {
        const temp = document.createElement("ul");
        for (let i = 0; i < 5; i++) {
          const detail = this.getDetail(node[i].id);

          const liEl = document.createElement("li");

          const aEl = document.createElement("a");
          aEl.href = `/documents/${node[i].id}`;
          aEl.dataset.link = `/documents/${node[i].id}`;

          const titleDiv = document.createElement("div");
          titleDiv.className = "title";
          titleDiv.textContent = node[i].title || "새 페이지";

          const contentDiv = document.createElement("div");
          contentDiv.className = "content";
          if (!detail.content) contentDiv.textContent = detail.content;

          const dateDiv = document.createElement("div");
          dateDiv.className = "date";
          dateDiv.textContent = node[i].updatedAt.slice(0, 10);

          aEl.append(titleDiv, contentDiv, dateDiv);
          liEl.append(aEl);

          temp.append(liEl);
        }
        return temp;
      },
      async getDetail(id) {
        const detail = await viewDocument(id);
        return detail.content;
      },
    };

    home.init();

    return;
  }

  const docId = path.match(/^\/documents\/(\d+)$/);
  if (docId) {
    const id = docId[1];

    const html = await fetch("/pages/document.html").then((r) => r.text());
    document.getElementById("container").innerHTML = html;

    try {
      const detail = await viewDocument(id); // { title, content } 가정
      const title = document.querySelector("input[data-doc-title]");
      const content = document.querySelector("textarea[data-doc-content]");
      if (title) title.value = detail?.title ?? "";
      if (content) content.value = detail?.content ?? "";

      document.getElementById("contents").classList.remove("hidden");
    } catch {
      document.getElementById("container").innerHTML =
        "<h2>문서를 불러오지 못했습니다.</h2>";
    }
    return;
  }

  const html = await fetch("/pages/home.html").then((r) => r.text());
  document.getElementById("container").innerHTML = html;
}

window.addEventListener("popstate", () => render());
window.addEventListener("DOMContentLoaded", () => render());

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  navigateTo(a.getAttribute("href"));
});

export default { navigateTo };
