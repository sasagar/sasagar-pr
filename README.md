# PR List - sasagar

GitHub Pull Requestsを一覧表示するサイトです。

## 機能

- PRのステータス別フィルタリング（All / Open / Merged / Closed）
- キーワード検索（タイトル、リポジトリ名、PR番号）
- Organization別フィルタリング
- 統計情報の表示（Total / Open / Merged / Closed）

## 技術スタック

- [Waku](https://waku.gg/) - React Server Components フレームワーク
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# PRデータの取得（GITHUB_TOKEN環境変数が必要）
npm run batch:prs

# ビルド
npm run build
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `GITHUB_TOKEN` | GitHub Personal Access Token（PRデータ取得用） |

## GitHub Actions

PRデータは以下のタイミングで自動更新されます：

- 毎日 00:00, 08:00, 16:00 JST
- `main`ブランチへのプッシュ時
- 手動トリガー

### 必要なSecrets

| Secret名 | 説明 |
|----------|------|
| `GH_PAT` | GitHub Personal Access Token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

## ライセンス

MIT
