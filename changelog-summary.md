# 🤖 Claude Code / Codex CLI 更新まとめ（日本語版）

> 最終更新の調査範囲: **2026-05-31 時点**  
> 対象: **Anthropic Claude Code** と **OpenAI Codex CLI / Codex 製品更新**

このページは、Claude Code と Codex CLI の近年の更新内容を、バージョン・日付・カテゴリ別に整理した総合サマリーです。開発者、チーム導入担当者、AI コーディングツールの比較検討者が、直近の変化と方向性を素早く把握できることを目的としています。

---

## 🔗 参照元リンク

| ツール | 公式 / 一次情報 |
|---|---|
| Claude Code | [公式 docs changelog](https://code.claude.com/docs/en/changelog) / [GitHub CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) / [GitHub Releases](https://github.com/anthropics/claude-code/releases) / [npm package](https://www.npmjs.com/package/@anthropic-ai/claude-code) |
| Codex CLI | [OpenAI Codex changelog](https://developers.openai.com/codex/changelog) / [RSS](https://developers.openai.com/codex/changelog/rss.xml) / [GitHub repo](https://github.com/openai/codex) / [GitHub Releases](https://github.com/openai/codex/releases) |

---

# 🟣 Claude Code 更新まとめ

## 📌 調査概要

| 項目 | 内容 |
|---|---:|
| 最新 npm バージョン | `2.1.159` |
| stable dist-tag | `2.1.150` |
| 最新リリース日 | `2026-05-31` |
| 公式 changelog 解析範囲 | `0.2.21` 〜 `2.1.159` |
| 解析済み changelog エントリ数 | 303 件 |

Claude Code は 2026 年 5 月後半に、**Opus 4.8 対応、Auto mode、背景エージェント、スキル / プラグイン、コードレビュー系コマンド、エンタープライズ認証・権限強化**を中心に大きく進化しています。

---

## 🆕 直近の主要リリース

| バージョン | 日付 | 主な更新 |
|---|---|---|
| `2.1.159` | 2026-05-31 | 内部インフラ改善 |
| `2.1.158` | 2026-05-30 | Bedrock / Vertex / Foundry で Opus 4.7/4.8 の Auto mode を有効化可能 |
| `2.1.157` | 2026-05-29 | `.claude/skills` 自動ロード、`claude plugin init`、worktree 切替、テレメトリ詳細化 |
| `2.1.154` | 2026-05-28 | **Opus 4.8 対応**、Dynamic workflows、Fast mode、背景 shell command、Chrome 選択 |
| `2.1.152` | 2026-05-27 | `/code-review --fix`、`/reload-skills`、`MessageDisplay` hook、Auto mode 同意不要化 |
| `2.1.147` | 2026-05-21 | pinned background sessions、`/simplify` → `/code-review`、自動更新改善 |
| `2.1.139` | 2026-05-11 | `claude agents` research preview、`/goal`、`/scroll-speed`、MCP 環境変数改善 |

---

## 🧠 モデル・実行モード関連

### 🚀 Opus 4.8 / Fast mode / Auto mode

- `2.1.154` で **Opus 4.8** をサポート。
- Opus 4.8 上で低コストな **Fast mode** が利用可能に。
- Auto mode が継続的に強化され、`2.1.158` では Bedrock / Vertex / Foundry でも `CLAUDE_CODE_ENABLE_AUTO_MODE=1` により利用可能。
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` は非推奨化。

### 🧩 システムプロンプト・モデル選択

- Lean system prompt のデフォルト範囲が拡大。
- `/model` の挙動が変更され、現在セッションのみを変更する形に整理。
- デフォルトモデル選択とセッション内モデル選択が分離。

---

## 🧰 スキル・プラグイン・ワークフロー

### 🔌 プラグインとスキル

| バージョン | 更新内容 |
|---|---|
| `2.1.157` | `.claude/skills` のプラグインが marketplace なしで自動ロード |
| `2.1.157` | `claude plugin init <name>` を追加 |
| `2.1.157` | plugin autocomplete 改善 |
| `2.1.152` | `/reload-skills` を追加 |
| `2.1.152` | skills / slash commands が `disallowed-tools` を設定可能に |

### ⚙️ Dynamic workflows / Background agents

- `2.1.154` で **Dynamic workflows** が導入され、Claude が数十〜数百の background agents を編成可能に。
- `2.1.147` で pinned background sessions がアップデート後も維持・再起動されるように改善。
- `2.1.157` では background agents 周辺の複数不具合を修正。

---

## 🖥️ CLI / UI / 操作性

| 項目 | 更新内容 |
|---|---|
| `claude agents` | research preview として agent view を追加 |
| `/goal` | 複数ターンにまたがる完了条件を設定可能 |
| `/scroll-speed` | スクロール速度調整を追加 |
| transcript navigation | トランスクリプト移動ショートカット追加 |
| worktree | `EnterWorktree` による worktree 切替を追加 |
| Chrome selection | Claude in Chrome のブラウザ選択に対応 |
| background shell | `! <command>` / `claude --bg --exec` を追加 |

---

## 🧪 コードレビュー・クリーンアップ系変更

### `/simplify` から `/code-review` へ

Claude Code では、2026 年 5 月中旬以降にレビュー系コマンドの意味が大きく変化しました。

| 時期 | 変更 |
|---|---|
| `2.1.147` | `/simplify` が `/code-review` にリネーム。旧 cleanup 挙動は削除 |
| `2.1.152` | `/code-review --fix` が review findings を適用可能に |
| `2.1.154` | `/simplify` は cleanup-only review として再調整 |

この領域は挙動変更が多いため、既存ワークフローやチーム手順で `/simplify` を使っている場合は、バージョンごとの意味を確認する必要があります。

---

## 🔐 セキュリティ・認証・権限

- PowerShell、worktree、Bash 環境変数代入、enterprise login enforcement などで sandbox / permissions が強化。
- エンタープライズ認証・セキュリティ周辺の修正が複数リリースで継続。
- MCP stdio servers に `CLAUDE_PROJECT_DIR` が渡されるようになり、プロジェクトコンテキスト連携が改善。

---

## ⚠️ Claude Code の注意すべき変更点

| 分類 | 内容 |
|---|---|
| インストール | README 上で npm global install は非推奨。install script / Homebrew / WinGet が推奨 |
| コマンド挙動 | `/simplify` と `/code-review` の意味が複数回変更 |
| 環境変数 | `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` など一部フラグが非推奨 |
| モデル選択 | `/model` は現在セッションのみを変更する挙動へ |
| 権限・sandbox | PowerShell、worktree、Bash env、enterprise login などで制約強化 |

---

# 🟢 Codex CLI / OpenAI Codex 更新まとめ

## 📌 調査概要

| 項目 | 内容 |
|---|---:|
| 最新 GitHub pre-release | `0.136.0-alpha.2` |
| 最新安定リリース | `0.135.0` |
| 最新リリース日 | `2026-05-31` |
| 主要情報源 | OpenAI Codex changelog / GitHub Releases |
| GitHub `CHANGELOG.md` | 「releases page を参照」と記載のみ |

Codex CLI は 2025 年中盤の Rust CLI 化以降、**TUI、Plan Mode、Goal Mode、plugins、hooks、permission profiles、remote-control、app-server、Windows/macOS/Linux 対応、Python SDK、Codex app / Chrome / mobile 連携**を急速に拡張しています。

---

## 🆕 最新 GitHub CLI リリース

### `0.136.0-alpha.2` — 2026-05-31

**種別:** pre-release

- リリース本文は “Release 0.136.0-alpha.2” のみ。
- macOS / Linux / Windows 向け artifacts、config schema、signed / unsigned packages を含む。

---

### `0.135.0` — 2026-05-28

#### ✨ 新機能

| カテゴリ | 更新内容 |
|---|---|
| 診断 | `codex doctor` が環境、Git、terminal、app-server、thread inventory をより詳細に診断 |
| リモート | `/status` が remote transport の接続詳細・server version を表示 |
| Vim mode | text-object editing、word / line-end 挙動改善、interrupt binding 設定 |
| 権限 | `/permissions` が named permission profiles と custom profiles に対応 |
| インストール | `CODEX_NON_INTERACTIVE=1` による非対話 install を `install.sh` / `install.ps1` でサポート |
| Python SDK | 使いやすい `Sandbox` preset を公開 |

#### 🛠️ 修正

- TUI の Markdown table / list rendering を改善。
- macOS / Zellij での出力安定性を改善。
- slash-command completion が draft text を保持。
- 古い tmux / iTerm control-mode での Ctrl-C を修正。
- resume が non-interactive exec sessions と cwd override に対応。

---

### `0.134.0` — 2026-05-26

#### ✨ 新機能

- ローカル conversation history search と preview。
- `--profile` が主要な profile selector に。旧 profile configs は移行ガイド付きで拒否。
- MCP setup で server ごとの environment targeting と OAuth options。
- connector schema が `$ref` / `$defs` を保持し、大きすぎる schema を圧縮。
- `readOnlyHint` を広告する read-only MCP tools は並列実行可能。
- extension / hook context に conversation history と subagent identity を追加。

#### 🛠️ 修正

- remote websocket reconnect と compaction retry。
- Windows TUI rendering corruption。
- workspace-specific usage-limit messages。
- plugin skills が plugin-level assets を再利用可能。
- Node tools が managed network proxy を尊重。

---

### `0.133.0` — 2026-05-21

#### ✨ 新機能

- Goals がデフォルト有効化。保存と active-turn progress tracking に対応。
- `codex remote-control` に foreground readiness / status UX と明示的 start / stop。
- permission-profile APIs、inheritance、managed `requirements.toml`、Windows sandbox integration。
- plugin discovery が marketplace-aware list、installed versions、roots、remote collections を表示。
- extensions が subagent start / stop、tool execution、turn metadata、async approvals を観測可能。

#### 🛠️ 修正

- local app-server socket 利用時の TUI cwd reuse bug。
- plan-mode free-form answers で Shift+Enter が予期せず submit される問題。
- AGENTS instruction loading と UTF-8 warnings。
- app-server startup / shutdown、plugin upgrade、realtime websocket。

---

### `0.132.0` — 2026-05-20

#### ✨ 新機能

- Python SDK auth: API key、ChatGPT browser / device-code、account inspection、logout。
- Python turn APIs が plain string input と richer `TurnResult` に対応。
- `codex exec resume --output-schema`。
- batched terminal probes により TUI startup 高速化。
- remote executor registration が標準 Codex auth を使用。
- app-server が original-resolution images を保持。

#### 🛠️ 修正

- usage limits / repeated blockers で goal continuations を停止。
- resume hints と picker paste search を改善。
- MCP / replay elicitation を正しい thread へ routing。
- remote websocket keepalive と repo-relative diff paths。
- Windows doctor が npm installs を検出。

---

### `0.131.0` — 2026-05-18

#### ✨ 新機能

- TUI controls: service tier commands、blended token usage、permissions、workspace roots、Markdown tables。
- `@` picker を files / directories / plugins / skills で統合。
- plugin marketplace CLI、version-aware sharing、share checkout、default-enabled plugin hooks。
- daemon-managed `codex remote-control`。
- Python SDK が `openai-codex` / `openai_codex` に rename / move。
- `codex doctor` を追加。

#### 🛠️ 修正

- TUI URL wrapping、light-mode selection、tmux Shift+Enter、`/review`、`/side`。
- Windows sandbox hardening。
- managed read restrictions を escalation 中も保持。
- app-server / local SQLite state startup の安全性向上。
- Git / auth reliability fixes。

---

### `0.130.0` — 2026-05-08

- plugin details が bundled hooks を表示。
- plugin sharing metadata / discoverability を改善。
- headless app-server 用 `codex remote-control` entrypoint を追加。
- app-server large-thread paging。
- Bedrock auth が AWS console-login profiles に対応。
- `view_image` が selected environment 経由で files を解決。
- config hot reload、apply-patch diffs、thread resume / fork、Windows sandbox binary cache を修正。
- `codex exec` から古い “research preview” 表現を削除。

---

### `0.129.0` — 2026-05-07

- TUI modal Vim editing: `/vim`、default mode config、Vim keymap contexts。
- resume / fork picker redesigned、raw scrollback、`/ide` context injection、workspace-aware `/diff`。
- status line theme colors、PR / branch summaries、`/keymap debug`。
- plugin sharing / workspace controls、marketplace upgrades / removal。
- hooks が `/hooks` から閲覧・toggle 可能に。
- experimental goals が discoverable / resumable に。
- TUI、sandbox、TLS、MCP、Git の多数修正。

---

### `0.128.0` — 2026-04-30

- persisted `/goal` workflows、app-server APIs、model tools、TUI controls。
- `codex update`、configurable keymaps、plan-mode nudges。
- permission profiles 拡張。
- plugin marketplace install / cache / uninstall / hooks。
- external agent session import。
- MultiAgentV2 config 改善。
- `--full-auto` を非推奨化し、明示的 permission profiles を推奨。

---

## 🧭 2026 年 CLI リリースラインの流れ

| バージョン | 日付 | 主要トピック |
|---|---|---|
| `0.125.0` | 2026-04-24 | Unix socket app-server transport、sticky environments、remote plugins、permission profiles、model discovery |
| `0.124.0` | 2026-04-23 | quick reasoning shortcuts、multi-environment app-server、Amazon Bedrock、stable hooks、Fast service tier |
| `0.123.0` | 2026-04-23 | built-in `amazon-bedrock` provider、`/mcp verbose`、plugin MCP loading、realtime handoffs |
| `0.122.0` | 2026-04-20 | standalone installs、`codex app`、`/side`、Plan Mode fresh implementation context、deny-read glob policies |
| `0.121.0` | 2026-04-15 | `codex marketplace add`、prompt history `Ctrl+R`、memory controls、MCP Apps、secure devcontainer profile |
| `0.120.0` | 2026-04-11 | Realtime V2 background-agent progress、hook activity UI、code-mode `outputSchema` |
| `0.119.0` | 2026-04-10 | Realtime voice v2 WebRTC、MCP Apps / custom MCP、remote / app-server workflows |
| `0.118.0` | 2026-03-31 | Windows proxy-only sandbox networking、app-server device-code sign-in、dynamic bearer tokens |
| `0.117.0` | 2026-03-26 | plugins first-class、path-based sub-agent addresses、app-server `!` commands、filesystem watch |
| `0.116.0` | 2026-03-19 | app-server TUI で device-code ChatGPT sign-in、plugin suggestion / install prompts |
| `0.115.0` | 2026-03-16 | original-detail image inspection、`js_repl` cwd / homeDir、realtime transcription、Smart Approvals guardian |
| `0.114.0` | 2026-03-11 | experimental code mode、experimental hooks engine、app-server health checks |
| `0.113.0` | 2026-03-10 | built-in `request_permissions`、plugin marketplace、streaming exec with PTY、permission-profile config language |
| `0.112.0` | 2026-03-08 | `@plugin` mentions、model picker updates、safer `js_repl` image emission |
| `0.111.0` | 2026-03-05 | Fast mode default、local JS imports in `js_repl`、plugin info in session start |
| `0.110.0` | 2026-03-05 | plugin system、TUI multi-agent flow、`/fast`、Windows installer script |
| `0.107.0` | 2026-03-02 | sub-agent への thread fork、realtime device selection、multimodal custom tools |
| `0.105.0` | 2026-02-25 | syntax highlighting、`/theme`、voice dictation、`/copy`、`/clear`、approval 改善 |
| `0.100.0` | 2026-02-12 | experimental `js_repl`、複数 rate limits、websocket transport、memory commands |
| `0.98.0` | 2026-02-05 | GPT-5.3-Codex 導入、steer mode stable / default |
| `0.95.0` | 2026-02-04 | `codex app <path>` on macOS、personal skills loading、`/plan` inline args/images |
| `0.94.0` | 2026-02-02 | Plan Mode default、personality config stable、`.agents/skills` loading |
| `0.93.0` | 2026-01-31 | SOCKS5 proxy、`/apps`、smart approvals default |
| `0.90.0` | 2026-01-25 | network sandbox proxy、connectors、collaboration mode beta |
| `0.88.0` | 2026-01-21 | device-code auth fallback、trusted-folder config loading |
| `0.81.0` | 2026-01-14 | default API model が `gpt-5.2-codex` へ |

---

## 🏛️ 2025 年 CLI 主要マイルストーン

| バージョン | 日付 | 主要トピック |
|---|---|---|
| `0.77.0` | 2025-12-21 | release present。詳細本文なし |
| `0.74.0` | 2025-12-18 | `gpt-5.2-codex` 導入、`/experimental`、UI polish |
| `0.71.0` | 2025-12-11 | `gpt-5.2` 導入 |
| `0.65.0` | 2025-12-04 | Codex Max default、`/resume`、TUI navigation、history trimming |
| `0.60.1` | 2025-11-19 | default API model が `gpt-5.1-codex` へ |
| `0.59.0` | 2025-11-19 | GPT-5.1-Codex-Max、native compaction、Windows Agent mode |
| `0.58.0` | 2025-11-13 | GPT-5.1 model family support |
| `0.52.0` | 2025-10-30 | `!<cmd>` direct shell、credit purchasing、image resizing、auth keyring abstraction |
| `0.47.0` | 2025-10-17 | macOS code signing、auto-update banner、full-access warning |
| `0.45.0` | 2025-10-06 | OAuth MCP auth、breaking `--api-key` → `--with-api-key`、`codex exec` stdout 変更 |
| `0.44.0` | 2025-10-03 | UI refresh、custom prompt arguments、streamable HTTP MCP、experimental `codex cloud` |
| `0.40.0` | 2025-09-23 | default model が `gpt-5-codex`、automatic compaction、`/review` |
| `0.30.0` | 2025-09-05 | **Breaking:** project `.env` files の自動読み込み停止 |
| `0.26.0` | 2025-08-29 | custom `/prompts`、View Image、MCP `GetConfig`、Windows image paste fix |
| `0.24.0` | 2025-08-26 | queued messages、image drag/drop、transcript mode、edit/resume、web search |
| `0.20.0` | 2025-08-09 | npm `@openai/codex` が Rust CLI へ移行。旧 TypeScript CLI 削除 |
| `0.11.0` | 2025-08-02 | copy/paste、native scrolling、`/compact`、planning tool、sandboxed `apply_patch` |
| `0.8.0` | 2025-07-19 | TUI / `codex exec` model streaming、`codex exec --json` |
| `0.3.0` | 2025-07-08 | non-ASCII crash fix、`--sandbox`、breaking `config.toml` sandbox changes |
| `0.2.0` | 2025-06-30 | GitHub release pagination 上で確認できた最古の Rust release |

---

## 🌐 OpenAI Codex 公式プロダクト更新ハイライト

### 2026 年

| 日付 | 更新内容 |
|---|---|
| 2026-05-29 | Windows で Computer Use、Windows remote control、profile / usage stats / token activity、thread coordination、past-thread search 拡張 |
| 2026-05-21 | Appshots、Goal mode が正式化、Mac lock 後の remote computer use、plugin sharing、browser annotations |
| 2026-05-14 | ChatGPT mobile から connected Mac 経由で Codex 利用、Hooks GA、Codex access tokens、enterprise admin docs |
| 2026-05-07 | Codex for Chrome。複数タブで browser / app work、利用サイト制御 |
| 2026-04-23 | GPT-5.5 と Codex app updates。`codex --model gpt-5.5`、browser use、automatic approval reviews |
| 2026-04-16 | in-app browser、macOS computer use、projectless chats、thread automations、task sidebar、PR review、artifact viewer、memories、remote connections alpha |
| 2026-04-07 | ChatGPT sign-in model picker の整理。旧 GPT-5.1/5.2 Codex 系の一部削除、GPT-5.4 / GPT-5.3-Codex などへ集約 |
| 2026-03-25 | plugins 導入。skills、app integrations、MCP config を bundle 可能。app / CLI / IDE extensions で利用 |

### 2025 年

| 日付 | 更新内容 |
|---|---|
| 2025-12-19 | Agent skills in Codex |
| 2025-12-18 | GPT-5.2-Codex introduced |
| 2025-12-04 | Codex for Linear introduced |
| 2025-11-18 | GPT-5.1-Codex-Max introduced |
| 2025-11-13 | GPT-5.1-Codex / GPT-5.1-Codex-Mini |
| 2025-11-07 | GPT-5-Codex-Mini |
| 2025-10-06 | Codex GA |
| 2025-09-23 | GPT-5-Codex in API |
| 2025-09-15 | GPT-5-Codex introduced |
| 2025-06-13 | keyboard shortcuts、task cancellation、setup duration 増加、diff polish |
| 2025-06-03 | binary files、setup errors 改善、diff limit 1MB → 5MB、setup duration 5 → 10 分 |
| 2025-05-22 | retry failed tasks、copy git patches、Unicode branch names、GitHub disconnects 90% 減、PR latency 35% 減、tool call latency 50% 減 |
| 2025-05-19 | Codex in ChatGPT iOS app |

---

## 🧩 Codex CLI の主要テーマ別まとめ

### 🧠 モデル・推論・モード

- 2025 年後半から 2026 年にかけて、GPT-5 系 Codex モデルが継続的に更新。
- `gpt-5-codex` → `gpt-5.1-codex` → `gpt-5.2-codex` → `gpt-5.3-codex` → GPT-5.4 / GPT-5.5 系へ展開。
- Fast service tier、steer mode、Plan Mode、Goal Mode が順次安定化。

### 🧰 Plugins / Skills / Hooks

- `0.110.0` で plugin system が登場。
- `0.117.0` で plugins が first-class に。
- 2026-03-25 の公式プロダクト更新で plugins が大きく打ち出される。
- hooks は experimental から GA へ進み、CLI / app / IDE extensions をまたいだ拡張基盤に。

### 🛡️ 権限・sandbox・approval

- permission profiles が継続的に拡張。
- `--full-auto` は非推奨化され、明示的な permission profiles が推奨に。
- Windows sandbox、network sandbox proxy、deny-read glob policies、managed read restrictions など安全性が強化。
- Smart Approvals / automatic approval reviews など、承認体験も高度化。

### 🖥️ TUI / app-server / remote-control

- TUI は Markdown rendering、Vim mode、keymap、theme、status line、history search などが継続改善。
- app-server と remote-control は 2026 年前半の大きな軸。
- remote executor、websocket、Unix socket transport、device-code sign-in、headless app-server などが整備。

### 🧪 SDK / 自動化

- Python SDK が `openai-codex` / `openai_codex` に整理。
- SDK auth、turn APIs、Sandbox presets が改善。
- `codex exec --json`、`--output-schema`、non-interactive install など、自動化・CI 連携向け機能が拡充。

---

# ⚖️ Claude Code と Codex CLI の比較サマリー

## 🧭 方向性の違い

| 観点 | Claude Code | Codex CLI / Codex |
|---|---|---|
| 中心テーマ | Claude エージェント体験、Opus 4.8、background agents、skills / plugins、code review | Codex app / CLI / remote / browser / mobile をまたぐ統合体験、plugins、hooks、permissions |
| 直近の重点 | Dynamic workflows、Auto mode、背景エージェント、Chrome、worktrees | Goal Mode、remote-control、app-server、Windows / Chrome / mobile、permission profiles |
| 拡張性 | `.claude/skills`、plugins、hooks、slash commands | plugins、skills、hooks、MCP、app integrations、marketplace |
| 安全性 | permissions / sandbox / enterprise auth 強化 | permission profiles、sandbox、Smart Approvals、managed restrictions |
| 自動化 | background shell、agents、telemetry、SessionStart / MessageDisplay hooks | `codex exec`、Python SDK、non-interactive install、remote-control、app-server APIs |

---

## 🚀 直近で特に重要な変化

### Claude Code

1. **Opus 4.8 対応と Fast mode** により、モデル性能とコスト効率のバランスが改善。
2. **Dynamic workflows / background agents** により、大規模な並列作業の編成が可能に。
3. **`.claude/skills` 自動ロード**で、ローカルスキルをより自然に運用可能。
4. **`/code-review --fix`** により、レビューから修正適用までの流れが短縮。
5. **`/simplify` / `/code-review` の挙動変更**は既存ワークフローへの影響が大きい。

### Codex CLI / Codex

1. **Goal Mode がデフォルト・正式機能へ**進み、長いタスクの継続管理が強化。
2. **permission profiles** が中心的な安全制御になり、`--full-auto` は非推奨へ。
3. **remote-control / app-server** により、CLI を超えたリモート・アプリ連携が拡大。
4. **plugins / hooks / marketplace** が拡張基盤として成熟。
5. **Windows / Chrome / mobile / macOS app** をまたぐマルチ環境対応が急速に進展。

---

## ⚠️ 導入・運用時のチェックポイント

| チェック項目 | Claude Code | Codex CLI |
|---|---|---|
| インストール方式 | npm global install 非推奨に注意 | Rust CLI 移行後の配布方式・platform artifacts を確認 |
| 既存コマンド互換 | `/simplify` / `/code-review` の意味変更に注意 | `--api-key` → `--with-api-key`、`--full-auto` 非推奨、profile config 移行 |
| 権限設計 | settings、permissions、enterprise login を確認 | permission profiles、sandbox、deny-read、managed restrictions を設計 |
| チーム拡張 | `.claude/skills` と plugins の配置ルールを決める | plugin marketplace、hooks、skills、MCP config の運用方針を決める |
| 自動化 | background agents / shell / hooks の監査ログを確認 | `codex exec`、Python SDK、remote-control、access tokens の権限管理 |

---

## 🏁 総括

Claude Code と Codex CLI は、どちらも単なる「コード補助 CLI」から、**複数エージェント・スキル・プラグイン・権限管理・リモート実行を備えた開発オーケストレーション環境**へ進化しています。

- **Claude Code** は、Opus 4.8、Auto mode、Dynamic workflows、background agents を軸に、Claude らしい大規模エージェント実行体験を強化しています。
- **Codex CLI / Codex** は、CLI・アプリ・ブラウザ・モバイル・リモート制御を横断し、OpenAI エコシステム全体で Codex を使える方向へ拡張しています。

どちらを採用する場合も、最新機能だけでなく、**権限モデル、コマンド互換性、インストール方式、チーム内スキル / プラグイン管理**をセットで確認することが重要です。
