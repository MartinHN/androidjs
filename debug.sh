npm run build

adb install ./dist/lumestrio.apk

adb shell am start -D -n com.androidjs.lumestrio/com.android.js.webview.MainActivity

# pm list packages -f # to show pakckages
# dumpsys package # to list activities
