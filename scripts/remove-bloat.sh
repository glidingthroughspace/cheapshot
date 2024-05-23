#!/bin/sh

# This script removes a lot of bloat apps from the stock Galaxy S9 ROM.

echo "com.microsoft.skydrive" # OneDrive
adb uninstall --user 0 com.microsoft.skydrive
echo "com.google.android.youtube"
adb uninstall --user 0 com.google.android.youtube
echo "com.google.android.apps.docs"
adb uninstall --user 0 com.google.android.apps.docs
echo "com.google.android.apps.maps"
adb uninstall --user 0 com.google.android.apps.maps
echo "com.google.android.gm" # Gmail
adb uninstall --user 0 com.google.android.gm
echo "com.google.android.apps.tachyon" # Duo / Google Meet
adb uninstall --user 0 com.google.android.apps.tachyon
echo "com.google.android.apps.photos"
adb uninstall --user 0 com.google.android.apps.photos
echo "com.google.android.videos"
adb uninstall --user 0 com.google.android.videos
echo "com.google.android.googlequicksearchbox" # Google App
adb uninstall --user 0 com.google.android.googlequicksearchbox
echo "com.microsoft.appmanager"
adb uninstall --user 0 com.microsoft.appmanager
echo "com.microsoft.office.excel"
adb uninstall --user 0 com.microsoft.office.excel
echo "com.microsoft.office.word"
adb uninstall --user 0 com.microsoft.office.word
echo "com.microsoft.office.powerpoint"
adb uninstall --user 0 com.microsoft.office.powerpoint
echo "com.linkedin.android"
adb uninstall --user 0 com.linkedin.android
echo "com.samsung.android.arzone"
adb uninstall --user 0 com.samsung.android.arzone
echo "com.samsung.android.game.gamehome"
adb uninstall --user 0 com.samsung.android.game.gamehome
echo "com.facebook.services"
adb uninstall --user 0 com.facebook.services
echo "com.facebook.katana"
adb uninstall --user 0 com.facebook.katana
echo "com.facebook.system"
adb uninstall --user 0 com.facebook.system
echo "com.facebook.appmanager"
adb uninstall --user 0 com.facebook.appmanager
echo "com.sec.android.app.shealth"
adb uninstall --user 0 com.sec.android.app.shealth
echo "com.sec.android.app.sbrowser"
adb uninstall --user 0 com.sec.android.app.sbrowser
echo "com.sec.android.app.voicenote"
adb uninstall --user 0 com.sec.android.app.voicenote
echo "com.sec.android.app.popupcalculator"
adb uninstall --user 0 com.sec.android.app.popupcalculator
echo "com.samsung.android.oneconnect" # Smart Things
adb uninstall --user 0 com.samsung.android.oneconnect
echo "com.samsung.android.app.notes"
adb uninstall --user 0 com.samsung.android.app.notes
echo "com.samsung.android.app.watchmanager" # Galaxy Wearable
adb uninstall --user 0 com.samsung.android.app.watchmanager
echo "com.samsung.android.email.provider" # Samsung email
adb uninstall --user 0 com.samsung.android.email.provider
echo "com.samsung.android.voc" # Samsung Members
adb uninstall --user 0 com.samsung.android.voc
echo "com.samsung.android.app.tips"
adb uninstall --user 0 com.samsung.android.app.tips
echo "com.sec.android.app.samsungapps" # Galaxy Store
adb uninstall --user 0 com.sec.android.app.samsungapps
echo "com.samsung.android.android.spay" # Samsung Pay
adb uninstall --user 0 com.samsung.android.spay
