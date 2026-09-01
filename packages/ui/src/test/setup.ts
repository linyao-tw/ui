import "@testing-library/jest-dom/vitest";

// jsdom 尚未實作 PointerEvent。Base UI 會刻意派送指標裝置專用的點擊事件，
// 因此讓測試環境與瀏覽器行為一致，同時保留元件互動測試的強度。
if (!("PointerEvent" in window)) {
	class TestPointerEvent extends MouseEvent {
		readonly height = 1;
		readonly isPrimary = true;
		readonly pointerId = 1;
		readonly pointerType = "mouse";
		readonly pressure = 0;
		readonly tangentialPressure = 0;
		readonly tiltX = 0;
		readonly tiltY = 0;
		readonly twist = 0;
		readonly width = 1;
	}

	Object.defineProperty(window, "PointerEvent", {
		configurable: true,
		value: TestPointerEvent
	});
}
