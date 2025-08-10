# LINE互動王課程報名系統設計

以下設計概述一個基於 LINE 互動王 的課程報名網站，讓 LINE 用戶能夠直接在 LINE 中查看課程資訊、報名並完成整個流程，並具備會員系統。

## 1. 系統架構

1. **前端**：採用 LIFF (LINE Front-end Framework)，透過 Web 技術 (HTML、CSS、JavaScript) 建立頁面，可直接在 LINE 內嵌瀏覽。
2. **後端**：使用 Node.js + Express 來處理 API 與業務邏輯。
3. **資料庫**：MySQL 或其他關聯式資料庫，儲存會員、課程以及報名紀錄。
4. **LINE 機器人**：透過 LINE Messaging API 與用戶互動，導向 LIFF 頁面或推播課程資訊。

## 2. 會員系統

- 使用 LINE Login 或 LIFF 的 `liff.login()` 功能來取得用戶 LINE 身份。
- 後端根據 LINE 使用者 ID 建立/查詢會員資料。
- 會員資料範例欄位：
  - `id` (PK)
  - `line_user_id`
  - `display_name`
  - `email`
  - `created_at`

## 3. 課程管理

- 課程資料表範例欄位：
  - `id` (PK)
  - `title`
  - `description`
  - `start_time`
  - `end_time`
  - `capacity`
- 提供後台介面讓管理者新增/編輯課程。

## 4. 報名流程

1. 用戶進入 LIFF 頁面瀏覽課程列表。
2. 點擊「報名」後，若尚未登入，先導向 LINE Login。
3. 登入後於報名表單填寫必要資料（例如 email、電話）。
4. 後端檢查課程名額並建立報名紀錄：
   - `id` (PK)
   - `member_id`
   - `course_id`
   - `status` (報名成功、候補等)
5. 回傳結果於 LIFF 頁面顯示，並可透過 LINE bot 發送確認訊息。

## 5. 其他功能建議

- **報名管理**：會員可於 LIFF 頁面查看自己的報名紀錄與狀態。
- **推播提醒**：課程開始前透過 LINE bot 發送提醒訊息。
- **取消機制**：提供取消報名功能，並針對候補名單自動遞補。

## 6. 範例 API 設計

- `GET /api/courses`：取得課程列表。
- `POST /api/courses/:id/register`：報名指定課程。
- `GET /api/members/me/registrations`：取得登入會員的報名紀錄。

以上為在 LINE 互動王上建置課程報名與會員系統的基本設計，可依需求擴充，例如整合金流付款、課程提醒等功能。

