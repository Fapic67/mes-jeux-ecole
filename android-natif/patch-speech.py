# Complète le module @capacitor-community/speech-recognition (Android) pour « Dis le nombre » :
#  - événement listeningState {status:"ready"} quand le micro est vraiment prêt (onReadyForSpeech)
#  - événement "rms" {value: dB} ~10 fois par seconde (volume de la voix, pour animer le micro)
#  - même version du plugin Gradle Android que l'appli (8.13.0), pour compiler sans téléchargement
# Usage (dans le dossier du projet Capacitor, après npm install) : python3 patch-speech.py
import re, sys, os
base = "node_modules/@capacitor-community/speech-recognition/android"
java = base + "/src/main/java/com/getcapacitor/community/speechrecognition/SpeechRecognition.java"
s = open(java).read()
if "MJE_PATCH" not in s:
    s = s.replace("public void onReadyForSpeech(Bundle params) {}",
        "public void onReadyForSpeech(Bundle params) { // MJE_PATCH\n"
        "            JSObject ret = new JSObject();\n            ret.put(\"status\", \"ready\");\n"
        "            SpeechRecognition.this.notifyListeners(LISTENING_EVENT, ret);\n        }", 1)
    s = s.replace("@Override\n        public void onRmsChanged(float rmsdB) {}",
        "private long lastRms = 0;\n\n        @Override\n        public void onRmsChanged(float rmsdB) { // MJE_PATCH\n"
        "            long now = System.currentTimeMillis();\n            if (now - lastRms < 90) return;\n            lastRms = now;\n"
        "            JSObject ret = new JSObject();\n            ret.put(\"value\", rmsdB);\n"
        "            SpeechRecognition.this.notifyListeners(\"rms\", ret);\n        }", 1)
    assert s.count("MJE_PATCH") == 2, "patch non appliqué"
    open(java, "w").write(s)
g = base + "/build.gradle"
t = open(g).read().replace("com.android.tools.build:gradle:8.7.2", "com.android.tools.build:gradle:8.13.0")
open(g, "w").write(t)
print("ok")
