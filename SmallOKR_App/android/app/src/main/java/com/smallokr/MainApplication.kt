package com.smallokr

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.modules.network.OkHttpClientProvider
import java.net.InetAddress
import okhttp3.Dns

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    if (BuildConfig.DEBUG) {
      // Resolve the local development gateway without changing emulator hosts.
      // The URL hostname, SNI and HTTPS certificate checks remain unchanged.
      OkHttpClientProvider.setOkHttpClientFactory {
        OkHttpClientProvider.createClientBuilder(this)
          .dns(object : Dns {
            override fun lookup(hostname: String): List<InetAddress> {
              return if (hostname.equals("alisa.docker.local", ignoreCase = true)) {
                InetAddress.getAllByName("10.89.0.201").toList()
              } else {
                Dns.SYSTEM.lookup(hostname)
              }
            }
          })
          .build()
      }
    }
    loadReactNative(this)
  }
}
