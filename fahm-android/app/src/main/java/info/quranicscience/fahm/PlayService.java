package info.quranicscience.fahm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

/** Keeps the app (and its audio) alive while the screen is off or the app is in the background. */
public class PlayService extends Service {
    private PowerManager.WakeLock wl;
    @Override public IBinder onBind(Intent i) { return null; }
    @Override public int onStartCommand(Intent in, int flags, int id) {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        String ch = "fahm_play";
        if (Build.VERSION.SDK_INT >= 26) nm.createNotificationChannel(new NotificationChannel(ch, "Fahmul Quraan playback", NotificationManager.IMPORTANCE_LOW));
        Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        int pf = Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0;
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, pf);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, ch) : new Notification.Builder(this);
        b.setContentTitle("Fahmul Quraan").setContentText("Tilawat chal rahi hai - kholne ke liye dabayein").setSmallIcon(android.R.drawable.ic_media_play).setContentIntent(pi).setOngoing(true);
        Notification n = b.build();
        if (Build.VERSION.SDK_INT >= 29) startForeground(7, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK); else startForeground(7, n);
        if (wl == null) { PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE); wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "fahm:play"); wl.setReferenceCounted(false); }
        if (!wl.isHeld()) wl.acquire(6 * 60 * 60 * 1000L);
        return START_NOT_STICKY;
    }
    @Override public void onDestroy() { try { if (wl != null && wl.isHeld()) wl.release(); } catch (Exception ignored) { } super.onDestroy(); }
}
