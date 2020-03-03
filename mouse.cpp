#include "mouse.hpp"

#ifdef X11

#include <X11/extensions/XTest.h>

#elif WIN

#include <windows.h>
#pragma comment(lib,"user32.lib")

#endif

void Mouse::click(int button, bool down) {
#ifdef X11
    Display *display = XOpenDisplay(NULL);
    XTestFakeButtonEvent(display, button, down, CurrentTime);
    XFlush(display);
    XCloseDisplay(display);
#elif WIN
    mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
    mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
#endif
}