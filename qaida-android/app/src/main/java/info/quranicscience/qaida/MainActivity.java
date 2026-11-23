package info.quranicscience.qaida;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

/** Noorani Qaida: the web app is bundled inside the APK (assets/qaida) and runs offline. */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/qaida/index.html";
    private WebView web;
    private PermissionRequest pendingMic = null;
    private final android.os.Handler ui = new android.os.Handler(Looper.getMainLooper());
    private OutputStream saveOut = null; private Uri saveUri = null; private String saveName = null; private File saveFile = null;

    private class Bridge {
        @JavascriptInterface public int appVersion() {
            try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionCode; } catch (Exception e) { return 0; }
        }
        @JavascriptInterface public void notifyUpdate(final String title, final String text, final String url) {
            ui.post(new Runnable() { @Override public void run() { postUpdate(title, text, url); } });
        }
        @JavascriptInterface public void openUrl(final String url) {
            ui.post(new Runnable() { @Override public void run() { try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception ignored) { } } });
        }
        /** Teacher recordings export: the zip is written in chunks to the phone's Downloads folder, then the share sheet opens. */
        @JavascriptInterface public boolean saveBegin(String name) {
            try {
                closeSave(); saveName = name;
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, "application/zip");
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                    saveUri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    saveOut = getContentResolver().openOutputStream(saveUri);
                } else {
                    File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS); if (dir != null) dir.mkdirs();
                    saveFile = new File(dir, name); saveOut = new FileOutputStream(saveFile);
                }
                return saveOut != null;
            } catch (Exception e) { return false; }
        }
        @JavascriptInterface public boolean saveChunk(String b64) {
            try { if (saveOut == null) return false; saveOut.write(Base64.decode(b64, Base64.DEFAULT)); return true; } catch (Exception e) { return false; }
        }
        @JavascriptInterface public void saveEnd() {
            final Uri u = saveUri; final String n = saveName;
            try { if (saveOut != null) saveOut.close(); } catch (Exception ignored) { }
            saveOut = null;
            ui.post(new Runnable() { @Override public void run() {
                Toast.makeText(MainActivity.this, "Downloads: " + n, Toast.LENGTH_LONG).show();
                if (u != null) {
                    try {
                        Intent s = new Intent(Intent.ACTION_SEND); s.setType("application/zip"); s.putExtra(Intent.EXTRA_STREAM, u);
                        s.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(s, "Recordings bhejein"));
                    } catch (Exception ignored) { }
                }
            } });
        }
    }
    private void closeSave() { try { if (saveOut != null) saveOut.close(); } catch (Exception ignored) { } saveOut = null; saveUri = null; saveFile = null; }

    private String[] pendingNote = null;
    private void postUpdate(String title, String text, String url) {
        try {
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                pendingNote = new String[]{title, text, url}; requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 78); return;
            }
            android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            android.app.Notification.Builder nb;
            if (Build.VERSION.SDK_INT >= 26) {
                nm.createNotificationChannel(new android.app.NotificationChannel("qaida_upd", "App updates", android.app.NotificationManager.IMPORTANCE_DEFAULT));
                nb = new android.app.Notification.Builder(this, "qaida_upd");
            } else nb = new android.app.Notification.Builder(this);
            int fl = Build.VERSION.SDK_INT >= 23 ? android.app.PendingIntent.FLAG_IMMUTABLE : 0;
            android.app.PendingIntent pi = android.app.PendingIntent.getActivity(this, 5, new Intent(Intent.ACTION_VIEW, Uri.parse(url)), fl | android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            nb.setSmallIcon(getApplicationInfo().icon).setContentTitle(title).setContentText(text).setAutoCancel(true).setContentIntent(pi);
            nm.notify(4343, nb.build());
        } catch (Exception ignored) { }
    }
    @Override public void onRequestPermissionsResult(int code, String[] p, int[] g) {
        super.onRequestPermissionsResult(code, p, g);
        if (code == 78) { if (g.length > 0 && g[0] == PackageManager.PERMISSION_GRANTED && pendingNote != null) postUpdate(pendingNote[0], pendingNote[1], pendingNote[2]); pendingNote = null; return; }
        if (code == 77 && pendingMic != null) {
            if (g.length > 0 && g[0] == PackageManager.PERMISSION_GRANTED) pendingMic.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE}); else pendingMic.deny();
            pendingMic = null;
        }
    }

    /** Serves files from assets with correct MIME types. */
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
                    case "webp": mime = "image/webp"; break;
                    case "mp3": mime = "audio/mpeg"; break;
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
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder().setDomain(HOST).addPathHandler("/assets/", new Handler()).build();
        web = new WebView(this);
        web.setBackgroundColor(0xFF12060C);
        setContentView(web, new ViewGroup.LayoutParams(-1, -1));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new Bridge(), "QaidaAndroid");
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onPermissionRequest(final PermissionRequest req) {
                ui.post(new Runnable() { @Override public void run() {
                    boolean mic = false; for (String r : req.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) mic = true;
                    if (!mic) { req.deny(); return; }
                    if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                        pendingMic = req; requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 77); return;
                    }
                    req.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                } });
            }
        });
        web.setWebViewClient(new WebViewClient() {
            @Nullable @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) { return loader.shouldInterceptRequest(r.getUrl()); }
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
    @Override protected void onPause() { super.onPause(); web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onDestroy() { closeSave(); super.onDestroy(); }
    @Override public void onBackPressed() {
        web.evaluateJavascript("(function(){try{return window.__qaidaBack?String(window.__qaidaBack()):'false'}catch(e){return 'false'}})()", new android.webkit.ValueCallback<String>() {
            @Override public void onReceiveValue(String v) { if (v == null || !v.contains("true")) finish(); }
        });
    }
}
