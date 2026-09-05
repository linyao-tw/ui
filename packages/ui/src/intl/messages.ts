/**
 * Every user-visible string the components fall back to when the consumer does not pass one.
 * Each of these also remains overridable per instance through the matching prop; the bundle is
 * the default, not a lock.
 */
export interface ComponentMessages {
	alertDialogClose: string;
	autocompleteClear: string;
	autocompleteEmpty: string;
	autocompleteTrigger: string;
	bottomSheetClose: string;
	breadcrumbLabel: string;
	breadcrumbMore: string;
	comboboxClear: string;
	comboboxEmpty: string;
	comboboxTrigger: string;
	commandPaletteClose: string;
	commandPalettePlaceholder: string;
	dialogClose: string;
	drawerClose: string;
	dropZoneBrowse: string;
	dropZonePrimary: string;
	dropZoneSecondary: string;
	fileSelectionLabel: string;
	fileUploadInvalidFile: string;
	fileUploadTrigger: string;
	headerNavLabel: string;
	/** Appended to a link's accessible name when it opens in a new window. */
	linkOpensInNewWindow: string;
	numberFieldDecrement: string;
	numberFieldIncrement: string;
	paginationLabel: string;
	paginationMore: string;
	paginationNext: string;
	paginationPrevious: string;
	passwordFieldHide: string;
	passwordFieldShow: string;
	popoverClose: string;
	selectPlaceholder: string;
	tabBarLabel: string;
	toastClose: string;
	/** Announced for the second and later code slots, which have no visible label of their own. */
	codeSlotLabel: (position: number, length: number) => string;
	/** Announced by the file selection status region after a picker or drop changes the selection. */
	fileSelectionSummary: (count: number) => string;
}

export const zhTWMessages: ComponentMessages = {
	alertDialogClose: "取消並關閉警示",
	autocompleteClear: "清除搜尋內容",
	autocompleteEmpty: "找不到建議項目",
	autocompleteTrigger: "顯示建議項目",
	bottomSheetClose: "關閉底部面板",
	breadcrumbLabel: "麵包屑導覽",
	breadcrumbMore: "更多頁面",
	comboboxClear: "清除選取",
	comboboxEmpty: "找不到符合的選項",
	comboboxTrigger: "顯示選項",
	commandPaletteClose: "關閉",
	commandPalettePlaceholder: "輸入指令…",
	dialogClose: "關閉對話框",
	drawerClose: "關閉側欄",
	dropZoneBrowse: "選擇檔案",
	dropZonePrimary: "將檔案拖曳至此",
	dropZoneSecondary: "或從裝置選擇檔案",
	fileSelectionLabel: "已選擇的檔案",
	fileUploadInvalidFile: "不支援的檔案類型",
	fileUploadTrigger: "選擇檔案",
	headerNavLabel: "主要導覽",
	linkOpensInNewWindow: "（在新視窗開啟）",
	numberFieldDecrement: "減少數值",
	numberFieldIncrement: "增加數值",
	paginationLabel: "分頁導覽",
	paginationMore: "更多頁面",
	paginationNext: "下一頁",
	paginationPrevious: "上一頁",
	passwordFieldHide: "隱藏密碼",
	passwordFieldShow: "顯示密碼",
	popoverClose: "關閉彈出視窗",
	selectPlaceholder: "請選擇",
	tabBarLabel: "應用程式區段",
	toastClose: "關閉通知",
	codeSlotLabel: (position, length) => `第 ${position} 個字元，共 ${length} 個`,
	fileSelectionSummary: count => `已選擇 ${count} 個檔案`
};

export const enUSMessages: ComponentMessages = {
	alertDialogClose: "Cancel and close alert",
	autocompleteClear: "Clear search",
	autocompleteEmpty: "No suggestions found",
	autocompleteTrigger: "Show suggestions",
	bottomSheetClose: "Close sheet",
	breadcrumbLabel: "Breadcrumb",
	breadcrumbMore: "More pages",
	comboboxClear: "Clear selection",
	comboboxEmpty: "No matching options",
	comboboxTrigger: "Show options",
	commandPaletteClose: "Close",
	commandPalettePlaceholder: "Type a command…",
	dialogClose: "Close dialog",
	drawerClose: "Close drawer",
	dropZoneBrowse: "Choose files",
	dropZonePrimary: "Drop files here",
	dropZoneSecondary: "or choose them from your device",
	fileSelectionLabel: "Selected files",
	fileUploadInvalidFile: "Unsupported file type",
	fileUploadTrigger: "Choose files",
	headerNavLabel: "Main",
	linkOpensInNewWindow: "(opens in a new window)",
	numberFieldDecrement: "Decrease value",
	numberFieldIncrement: "Increase value",
	paginationLabel: "Pagination",
	paginationMore: "More pages",
	paginationNext: "Next page",
	paginationPrevious: "Previous page",
	passwordFieldHide: "Hide password",
	passwordFieldShow: "Show password",
	popoverClose: "Close popover",
	selectPlaceholder: "Select an option",
	tabBarLabel: "Sections",
	toastClose: "Close notification",
	codeSlotLabel: (position, length) => `Character ${position} of ${length}`,
	fileSelectionSummary: count => (count === 1 ? "1 file selected" : `${count} files selected`)
};
