set -x
PACKAGE=com.androidjs.lumestrio

adb shell am start -D -n $PACKAGE/com.android.js.webview.MainActivity
JDWP=$(adb shell ps | grep $PACKAGE | cut -f7 -d\ )
while [[ -z $JDWP ]]; do
    sleep 3
    JDWP=$(adb shell ps | grep $PACKAGE | cut -f7 -d\ )
done
adb forward tcp:8000 jdwp:"$JDWP"
jdb -attach localhost:8000 
# pm list packages -f # to show pakckages
# dumpsys package # to list activities
