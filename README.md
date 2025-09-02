# 7팀 노션 클로닝 프로젝트

> 노션(Notion) UI 클로닝 프로젝트 \
> TailwindCSS + Prettier + Stylelint(선택) + Lucide 아이콘 사용

## 📂 폴더 구조

```
root/
├─ index.html               # 메인 페이지
├─ src/
│  ├─ css/
│  │  ├─ root.css           # 전역 변수, 공통 css 저장
│  │  └─ components.css     # 컴포넌트별 저장
│  ├─ js/
│  │  ├─ index.js           # 메인 js
│  │  ├─ page.js            # 페이지 js (이동해도 됨)
│  │  └─ modules/
│  │      ├─ aside.js       # 사이드바 로직
│  │      ├─ index.js       # 모듈 전체 export
│  │      └─ tooltip.js     # 툴팁 모듈
│  └─ assets/
│     └─ icons/             # lucide에서 제공하지 않는 아이콘
├─ .vscode/
│  ├─ .prettierrc           # prettier 공통 설정
│  └─ settings.json         # vscode 공통 설정
├─ .gitignore               # 불필요한 파일 깃허브 업로드 방지
├─ tailwind.config.js       # tailwindCSS 공통 설정
└─ README.md

```

## ⚡️ TailwindCSS

- CDN 방식으로 사용했습니다. (npm 설치 및 tailwind.config.js 설정 불필요)
- 레이아웃/간격/상태는 Tailwind 유틸리티 클래스를 활용하고,
  클래스가 무한히 길어지거나 반복될 경우 `root.css` 또는 `components.css` 에서 별도로 관리합니다.

 
### ✅ 확장
> - Tailwind CSS IntelliSense
> - 확장 프로그램 사용을 위해서 루트 폴더에 `tailwind.config.js` 파일이 생성되어 있어야 합니다.
> ⚠️ 저장 후 vscode 재실행하셔야 확장 프로그램이 잘 실행됩니다.
#### tailwind.config.js
```
module.exports = {
  content: ["./src/**/*.{html, js, tsx, jsx, ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

```
#### .vscode/settings.json

```
"editor.quickSuggestions": {
    "strings": "on"
},
"files.associations": {
    "*.css": "tailwindcss"
},
```

## 🎨 Prettier

- 모든 파일에 포맷팅을 지원하도록 설정합니다. (불필요하게 커밋기록이 남을 수 있음)

#### .vscode/settings.json
```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[css]": { "editor.defaultFormatter": null }
}
```
#### .prettierrc
```
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "strict"
}
```

## 🧹 Stylelint (선택)

- CSS 문법 검증 및 스타일 가이드를 강제합니다.
- Prettier만으로도 충분하지만, 필요하다면 병행해도 괜찮습니다!
- npm 설치가 필요합니다.

```
npm i -D stylelint stylelint-config-standard @stylistic/stylelint-plugin
```
#### .stylelintrc.json
```
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["@stylistic/stylelint-plugin"],
  "rules": {
    "@stylistic/selector-list-comma-newline-after": "never-multi-line",
    "@stylistic/selector-list-comma-space-after": "always",
    "@stylistic/block-opening-brace-space-before": "always",
    "@stylistic/declaration-block-trailing-semicolon": "always",
    "@stylistic/indentation": 2
  }
}
```

## 🗂️ Lucide 아이콘
- 오픈소스 아이콘 세트를 사용했습니다.
- 모듈 환경으로 진행될 경우 html 수정이 필요하며, npm 설치가 필요해집니다.
```
npm i lucide
```

## 🐛 Gitmoji
선택 사항이지만, 해당 커밋 메세지의 작업 성격을 바로 파악할 수 있어 사용하면 좋습니다. 각 이모지 별로 의미하는 바가 다르므로 한번 읽어보시는 것을 권장드립니다!
#### 예시
| 이모지 | 타입       | 설명                      |
| --- | -------- | ----------------------- |
| ✨   | feat     | 새로운 기능 추가               |
| 🐛  | fix      | 버그 수정                   |
| 🎨  | style    | 코드 포맷/스타일 변경 (기능 변경 없음) |
| 🔥  | remove   | 파일/코드 삭제                |
| 📝  | docs     | 문서 작성/수정                |
| ✅   | test     | 테스트 추가/수정               |


자세한 내용은 [깃모지 링크](https://gitmoji.dev/) 에서도 확인이 가능합니다.
bash에서 커밋하시게 될 경우 npm 설치로 바로 사용이 가능합니다.

```
npm i -g gitmoji-cli
```
```
gitmoji -c
```