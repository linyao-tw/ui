import "@testing-library/jest-dom/vitest";

// jsdom does not implement PointerEvent yet. Base UI intentionally dispatches
// pointer-specific click events, so keep the test environment aligned with a
// browser without weakening component interaction tests.
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
