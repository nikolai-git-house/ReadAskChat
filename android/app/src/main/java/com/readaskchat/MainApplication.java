package com.readaskchat;

import android.app.Application;
import android.util.Log;

import com.smixx.fabric.FabricPackage;
import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.beefe.picker.PickerViewPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.pushwoosh.reactnativeplugin.PushwooshPackage;
import com.bugsnag.BugsnagReactNative;

import io.realm.react.RealmReactPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.beefe.picker.PickerViewPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.pushwoosh.reactnativeplugin.PushwooshPackage;
import com.bugsnag.BugsnagReactNative;

import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;

import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.bugsnag.BugsnagReactNative;
import com.pushwoosh.reactnativeplugin.PushwooshPackage;
import com.microsoft.codepush.react.CodePush;
import com.beefe.picker.PickerViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.evollu.react.fa.FIRAnalyticsPackage;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RealmReactPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new PickerViewPackage(),
            new ReactNativeI18n(),
            new FIRAnalyticsPackage(),
            new RNFetchBlobPackage(),
            new FabricPackage(),
            new RNDeviceInfo(),
            new InAppBillingBridgePackage(),
            new PushwooshPackage(),
            BugsnagReactNative.getPackage(),

            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appcenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appcenterAnalytics_whenToEnableAnalytics)),

            new AppCenterReactNativePackage(MainApplication.this),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG)

            // new CodePush("d8pvS8uZZqRL2wVqsx_ysU37IGNFVyDuoCwFM", getApplicationContext(), BuildConfig.DEBUG),

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    BugsnagReactNative.start(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
