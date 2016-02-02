package com.riochatmobile;


import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {


  public NotificationModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "NotificationAndroid";
  }

  @ReactMethod
  public void show(String message) {
    NotificationCompat.Builder mBuilder =
            new NotificationCompat.Builder(getCurrentActivity())
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle("Riochat新消息")
                    .setContentText(message);


    Intent resultIntent = new Intent(getCurrentActivity(), MainActivity.class);

// Because clicking the notification opens a new ("special") activity, there's
// no need to create an artificial back stack.
    PendingIntent resultPendingIntent =
            PendingIntent.getActivity(
                    getCurrentActivity(),
                    0,
                    resultIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT
            );
    mBuilder.setContentIntent(resultPendingIntent);

    // Sets an ID for the notification
    int mNotificationId = 001;
// Gets an instance of the NotificationManager service
    NotificationManager mNotifyMgr =
            (NotificationManager) getCurrentActivity().getSystemService(getCurrentActivity().NOTIFICATION_SERVICE);
// Builds the notification and issues it.
    mNotifyMgr.notify(mNotificationId, mBuilder.build());
  }
}