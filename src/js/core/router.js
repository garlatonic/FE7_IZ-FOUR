import { getAllDocuments, viewDocument } from "./api.js";

// 내부 네비게이션 (이중 슬래시 방지)
function navigateTo(url) {
  const prevPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const path = new URL(url, location.origin).pathname; // 절대/상대 모두 처리
  history.pushState(null, "", path);
  render(prevPath);
}

async function render(prevPath) {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  // 홈
  if (path === "/" || path === "/home" || path === "/index.html") {
    const html = await fetch("/pages/home.html").then((r) => r.text());
    document.getElementById("container").innerHTML = html;

    // 최근 문서 5개 생성
    const home = {
      $rootList: document.querySelector(".home"),
      data: [],
      updatedList: [],
      async init() {
        const data = await getAllDocuments();
        this.data = data ?? [];
        this.render(this.data);
      },
      async render(data) {
        this.getItems(data);
        const items = await this.showItems(this.sortItems(this.updatedList));
        this.$rootList.append(items);
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

      async showItems(documents) {
        const list = document.createElement("div");
        list.className = "card-list flex justify-evenly";

        for (let i = 0; i < 5; i++) {
          const [id, title, updatedAt] = [
            documents[i].id,
            documents[i].title,
            documents[i].updatedAt,
          ];
          const content = await this.getDetail(id);

          const cardDiv = document.createElement("a");
          cardDiv.className =
            "card bg-white flex flex-col rounded-2xl shadow-md mr-5 h-80 w-1/5 overflow-hidden cursor-pointer";
          cardDiv.href = `/documents/${id}`;
          cardDiv.dataset.link = `/documents/${id}`;

          const image = document.createElement("div");
          image.className = "card-image mb-4 h-80";
          const contentDiv = document.createElement("div");
          if (content) {
            contentDiv.className = "content";
            contentDiv.textContent = content;
          }

          const infoDiv = document.createElement("div");
          infoDiv.className =
            "info-container px-4 pb-4 flex flex-col justify-between h-full";

          const titleH2 = document.createElement("div");
          titleH2.className = "text-xl font-bold text-gray-800 mb-3";
          titleH2.textContent = title || "새 페이지";

          const dateP = document.createElement("p");
          dateP.className = "date text-xs text-gray-400";
          dateP.textContent = updatedAt.slice(0, 10);

          image.append(contentDiv);
          infoDiv.append(titleH2, dateP);

          cardDiv.append(image, infoDiv);

          list.append(cardDiv);
        }
        return list;
      },
      async getDetail(id) {
        const detail = await viewDocument(id);
        return detail.content;
      },
    };

    home.init();
    return;
  }

  const id = path.split("/")[2] || null;
  if (id) {
    // 문서 페이지 열린 상태에서 다른 문서 페이지로 이동 시 html 호출 X
    if (prevPath.includes("/documents") !== path.includes("/documents")) {
      const html = await fetch("/pages/document.html").then((r) => r.text());
      document.getElementById("container").innerHTML = html;
    }

    // 문서 상세 조회
    const detail = await viewDocument(id);
    console.log(detail);

    // 문서 정보 세팅
    const title = document.querySelector("input[data-doc-title]");
    const content = document.querySelector("textarea[data-doc-content]");
    if (title) title.value = detail?.title ?? "";
    if (content) content.value = detail?.content ?? "";

    document.getElementById("contents").classList.remove("hidden");

    return;
  }

  const html = await fetch("/pages/home.html").then((r) => r.text());
  document.getElementById("container").innerHTML = html;
}

render();

window.addEventListener("popstate", (e) => {
  if (e.state !== null) {
    // 이전 페이지 기록 있으면
    navigator(e.state);
  } else {
    // 없으면 같은 페이지에 머무르게
    history.replaceState(e.state, "", location.href);
  }
});

document.addEventListener("click", (e) => {
  const moreButton = e.target.closest('div[role="button"][data-dialog="more"]');
  if (moreButton) {
    e.preventDefault();

    const div = document.createElement("div");
    const button = document.createElement("div");
    div.className = "dialog-menu";

    button.className = "function flex gap-1 justify-center";
    button.setAttribute("role", "button");
    button.textContent = "삭제";
    

    div.append(button);
    moreButton.parentElement.append(div);

    console.log(moreButton);
    return;
  }

  const a = e.target.closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  navigateTo(a.getAttribute("href"));
});

export default { navigateTo };
