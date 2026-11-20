package info.quranicscience.fahm;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import java.util.Locale;
import android.webkit.JavascriptInterface;
import org.json.JSONObject;
import java.util.ArrayList;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/** Fahm: the whole web app is bundled inside the APK (assets/fahm) and runs offline; audio streams online. */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/fahm/index.html";
    private WebView web;
    private SpeechRecognizer sr;
    private String pendingLang = "ar-SA";
    private boolean bgPlay = false;
    private final android.os.Handler ui = new android.os.Handler(Looper.getMainLooper());

    /** Hafiz mode: Android WebView has no Web Speech API, so we expose the system recogniser to the page. */
    private void js(final String type, final String text) {
        final String call = "window.__fahmSpeech&&window.__fahmSpeech('" + type + "'," + JSONObject.quote(text == null ? "" : text) + ")";
        ui.post(new Runnable() { @Override public void run() { if (web != null) web.evaluateJavascript(call, null); } });
    }
    private String first(android.os.Bundle b) {
        ArrayList<String> l = b == null ? null : b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        return (l == null || l.isEmpty()) ? "" : l.get(0);
    }
    private void beginListen() {
        if (sr != null) { try { sr.destroy(); } catch (Exception ignored) { } sr = null; }
        sr = SpeechRecognizer.createSpeechRecognizer(this);
        sr.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(android.os.Bundle p) { }
            @Override public void onBeginningOfSpeech() { }
            @Override public void onRmsChanged(float v) { }
            @Override public void onBufferReceived(byte[] b) { }
            @Override public void onEndOfSpeech() { }
            @Override public void onEvent(int t, android.os.Bundle p) { }
            @Override public void onPartialResults(android.os.Bundle p) { String t = first(p); if (!t.isEmpty()) js("partial", t); }
            @Override public void onResults(android.os.Bundle r) { String t = first(r); if (!t.isEmpty()) js("final", t); js("end", ""); }
            @Override public void onError(int e) {
                if (e == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS) js("error", "permission");
                else if (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT || e == SpeechRecognizer.ERROR_CLIENT) js("end", "");
                else js("error", "code" + e);
            }
        });
        android.content.Intent i = new android.content.Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, pendingLang);
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 3000L);
        i.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 3000L);
        sr.startListening(i);
    }
    private TextToSpeech tts; private boolean ttsReady = false; private int ttsSeq = 0;
    private void ttsDone(boolean ok) { try { web.evaluateJavascript("window.__fahmSpoke&&window.__fahmSpoke(" + ok + ")", null); } catch (Exception ignored) { } }
    private void ttsSay(final String txt, final String lang, final float rate) {
        if (tts == null) {
            tts = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() { @Override public void onInit(int st) {
                ttsReady = st == TextToSpeech.SUCCESS;
                if (ttsReady) { tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { }
                    @Override public void onDone(String id) { ui.post(new Runnable() { @Override public void run() { ttsDone(true); } }); }
                    @Override public void onError(String id) { ui.post(new Runnable() { @Override public void run() { ttsDone(false); } }); }
                }); }
                ttsSay(txt, lang, rate);
            } });
            return;
        }
        if (!ttsReady) { ttsDone(false); return; }
        try {
            String[] p = lang.split("-"); Locale loc = p.length > 1 ? new Locale(p[0], p[1]) : new Locale(p[0]);
            int r = tts.isLanguageAvailable(loc);
            if (r < TextToSpeech.LANG_AVAILABLE) { ttsDone(false); return; }
            tts.setLanguage(loc); tts.setSpeechRate(rate > 0 ? rate : 1.2f); tts.setPitch(1.05f);
            Bundle pa = new Bundle(); pa.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, android.media.AudioManager.STREAM_MUSIC);
            tts.speak(txt, TextToSpeech.QUEUE_FLUSH, pa, "w" + (++ttsSeq));
        } catch (Exception e) { ttsDone(false); }
    }
    private class Bridge {
        @JavascriptInterface public boolean speechAvailable() { return SpeechRecognizer.isRecognitionAvailable(MainActivity.this); }
        @JavascriptInterface public void startListen(final String lang) {
            pendingLang = (lang == null || lang.isEmpty()) ? "ar-SA" : lang;
            ui.post(new Runnable() { @Override public void run() {
                if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    js("perm", ""); requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 77); return;
                }
                try { beginListen(); } catch (Exception e) { js("error", "start"); }
            } });
        }
        /** Background playback: keep audio running with the screen off / app minimised (foreground service). */
        @JavascriptInterface public void bg(final boolean on) {
            ui.post(new Runnable() { @Override public void run() {
                bgPlay = on;
                try {
                    Intent s = new Intent(MainActivity.this, PlayService.class);
                    if (on) {
                        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 78);
                        if (Build.VERSION.SDK_INT >= 26) startForegroundService(s); else startService(s);
                    } else stopService(s);
                } catch (Exception ignored) { }
            } });
        }
        /** Fast spoken warning with the phone's own TTS engine (Hafiz mode). Returns "no" if no voice for the language. */
        @JavascriptInterface public String speak(final String txt, final String lang, final float rate) {
            ui.post(new Runnable() { @Override public void run() { ttsSay(txt, lang, rate); } });
            return "ok";
        }
        @JavascriptInterface public void stopListen() {
            ui.post(new Runnable() { @Override public void run() { if (sr != null) { try { sr.cancel(); sr.destroy(); } catch (Exception ignored) { } sr = null; } } });
        }
    }
    @Override public void onRequestPermissionsResult(int code, String[] p, int[] g) {
        super.onRequestPermissionsResult(code, p, g);
        if (code == 77) js(g.length > 0 && g[0] == PackageManager.PERMISSION_GRANTED ? "permok" : "permno", "");
    }
    @Override protected void onDestroy() { try { if (tts != null) { tts.stop(); tts.shutdown(); } } catch (Exception ignored) { } try { stopService(new Intent(this, PlayService.class)); } catch (Exception ignored) { } if (sr != null) { try { sr.destroy(); } catch (Exception ignored) { } } super.onDestroy(); }

    /** Serves files from assets with correct MIME types (woff2, json, webmanifest ...). */
    private class Handler implements WebViewAssetLoader.PathHandler {
        @Nullable @Override
        public WebResourceResponse handle(@NonNull String path) {
            try {
                if (path.isEmpty() || path.endsWith("/")) path += "index.html";
                InputStream in = getAssets().open(path);
                String ext = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1).toLowerCase() : "";
                String mime;
                switch (ext) {
                    case "html": mime = "text/html"; break;
                    case "js": mime = "application/javascript"; break;
                    case "css": mime = "text/css"; break;
                    case "json": mime = "application/json"; break;
                    case "webmanifest": mime = "application/manifest+json"; break;
                    case "woff2": mime = "font/woff2"; break;
                    case "png": mime = "image/png"; break;
                    case "mp4": mime = "video/mp4"; break;
                    case "svg": mime = "image/svg+xml"; break;
                    default: mime = "application/octet-stream";
                }
                WebResourceResponse r = new WebResourceResponse(mime, "UTF-8", in);
                Map<String, String> h = new HashMap<>();
                h.put("Access-Control-Allow-Origin", "*");
                r.setResponseHeaders(h);
                return r;
            } catch (IOException e) {
                return null;
            }
        }
    }

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new Handler())
                .build();
        web = new WebView(this);
        web.setBackgroundColor(0xFF0B0F1A);
        setContentView(web, new ViewGroup.LayoutParams(-1, -1));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new Bridge(), "FahmAndroid");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Nullable @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                return loader.shouldInterceptRequest(r.getUrl());
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                if (HOST.equals(r.getUrl().getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, r.getUrl())); } catch (Exception ignored) { }
                return true;
            }
        });
        if (b != null) web.restoreState(b); else web.loadUrl(START);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

    @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); web.saveState(o); }
    @Override protected void onPause() { super.onPause(); if (!bgPlay) web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override public void onBackPressed() {
        // let the app handle back first (close reader/sheets, previous ayah); exit only when it says so
        web.evaluateJavascript("(function(){try{return window.__fahmBack?String(window.__fahmBack()):'false'}catch(e){return 'false'}})()", new android.webkit.ValueCallback<String>() {
            @Override public void onReceiveValue(String v) { if (v == null || !v.contains("true")) finish(); }
        });
    }
}
