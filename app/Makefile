.PHONY: build
build:
	flutter build apk

.PHONY: install
install:
	adb install build/app/outputs/flutter-apk/app-release.apk

.PHONY: run
run:
	flutter run

.PHONY: uninstall
uninstall:
	adb uninstall space.glidingthrough.cheapshot
