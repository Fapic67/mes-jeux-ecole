#!/usr/bin/env python3
"""Patch du plugin @capacitor-community/text-to-speech (Android) : un moteur de synthèse par langue (fr, de)
toujours prêt, pour enchaîner allemand et français sans délai (un seul moteur rechargeait la voix à chaque
changement de langue). À lancer après npm install, dans le projet Capacitor : python3 patch-tts.py [dossier du projet]."""
import sys,os
root=sys.argv[1] if len(sys.argv)>1 else os.path.dirname(os.path.abspath(__file__))
p=os.path.join(root,"node_modules/@capacitor-community/text-to-speech/android/src/main/java/com/getcapacitor/community/tts/TextToSpeech.java")
s=open(p).read()
if "byLang" in s:print("déjà patché");sys.exit()
def rep(a,b):
    global s
    assert a in s,a[:70];s=s.replace(a,b,1)
rep("    private Map<String, SpeakResultCallback> requests = new HashMap();",
"""    private Map<String, SpeakResultCallback> requests = new HashMap();
    // un moteur par langue (fr, de), chacun garde sa voix chargée
    private Map<String, android.speech.tts.TextToSpeech> byLang = new HashMap<>();
    private UtteranceProgressListener listener;

    private void addEngine(final String tag) {
        try {
            final Locale loc = Locale.forLanguageTag(tag);
            final android.speech.tts.TextToSpeech[] h = new android.speech.tts.TextToSpeech[1];
            h[0] = new android.speech.tts.TextToSpeech(context, status -> {
                if (status == android.speech.tts.TextToSpeech.SUCCESS) h[0].setLanguage(loc);
            });
            h[0].setOnUtteranceProgressListener(listener);
            byLang.put(tag.substring(0, 2), h[0]);
        } catch (Exception ex) {
            Log.d(LOG_TAG, "moteur " + tag + " : " + ex.getLocalizedMessage());
        }
    }""")
rep("            tts.setOnUtteranceProgressListener(\n                new UtteranceProgressListener() {",
    "            listener = (\n                new UtteranceProgressListener() {")
rep("""                }
            );
        } catch (Exception ex) {""","""                }
            );
            tts.setOnUtteranceProgressListener(listener);
            addEngine("fr-FR");
            addEngine("de-DE");
        } catch (Exception ex) {""")
rep("""        tts.setLanguage(locale);
        tts.setSpeechRate(rate);
        tts.setPitch(pitch);

        if (voice >= 0) {
            ArrayList<Voice> supportedVoices = getSupportedVoicesOrdered();
            if (voice < supportedVoices.size()) {
                Voice newVoice = supportedVoices.get(voice);
                int resultCode = tts.setVoice(newVoice);
            }
        }
        tts.speak(text, queueStrategy, ttsParams, callbackId);""","""        String k = lang != null && lang.length() >= 2 ? lang.substring(0, 2).toLowerCase() : "";
        android.speech.tts.TextToSpeech e = byLang.get(k);
        boolean own = e != null;
        if (!own) {
            e = tts;
            e.setLanguage(locale);
        }
        e.setSpeechRate(rate);
        e.setPitch(pitch);

        if (voice >= 0) {
            ArrayList<Voice> supportedVoices = getSupportedVoicesOrdered();
            if (voice < supportedVoices.size()) {
                Voice newVoice = supportedVoices.get(voice);
                Voice cur = null;
                try { cur = e.getVoice(); } catch (Exception ex) {}
                if (!own || cur == null || !newVoice.getName().equals(cur.getName())) e.setVoice(newVoice);
            }
        }
        e.speak(text, queueStrategy, ttsParams, callbackId);""")
rep("""    public void stop() {
        tts.stop();""","""    public void stop() {
        tts.stop();
        for (android.speech.tts.TextToSpeech e : byLang.values()) {
            try { e.stop(); } catch (Exception ex) {}
        }""")
rep("""        tts.stop();
        tts.shutdown();""","""        tts.stop();
        tts.shutdown();
        for (android.speech.tts.TextToSpeech e : byLang.values()) {
            try { e.stop(); e.shutdown(); } catch (Exception ex) {}
        }""")
open(p,"w").write(s);print("patché :",p)
