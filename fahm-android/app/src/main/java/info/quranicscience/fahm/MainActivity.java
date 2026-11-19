package info.quranicscience.fahm;

import android.app.Activity;
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
    @Override protected void onPause() { super.onPause(); web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
