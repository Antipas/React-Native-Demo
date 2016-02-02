package com.riochatmobile;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.views.art.ARTRenderableViewManager;
import com.facebook.react.views.art.ARTSurfaceViewManager;
import com.facebook.react.views.drawer.ReactDrawerLayoutManager;
import com.facebook.react.views.image.ReactImageManager;
import com.facebook.react.views.progressbar.ReactProgressBarViewManager;
import com.facebook.react.views.recyclerview.RecyclerViewBackedScrollViewManager;
import com.facebook.react.views.scroll.ReactHorizontalScrollViewManager;
import com.facebook.react.views.scroll.ReactScrollViewManager;
import com.facebook.react.views.swiperefresh.SwipeRefreshLayoutManager;
import com.facebook.react.views.switchview.ReactSwitchManager;
import com.facebook.react.views.text.ReactRawTextManager;
import com.facebook.react.views.text.ReactTextInlineImageViewManager;
import com.facebook.react.views.text.ReactTextViewManager;
import com.facebook.react.views.text.ReactVirtualTextViewManager;
import com.facebook.react.views.textinput.ReactTextInputManager;
import com.facebook.react.views.toolbar.ReactToolbarManager;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.react.views.viewpager.ReactViewPagerManager;
import com.facebook.react.views.webview.ReactWebViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by lyn on 16-2-1.
 */
public class RiochatReactPackage implements ReactPackage {


    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new NotificationModule(reactContext));

        return modules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.asList(new ViewManager[]{ARTRenderableViewManager.createARTGroupViewManager(), ARTRenderableViewManager.createARTShapeViewManager(), ARTRenderableViewManager.createARTTextViewManager(), new ARTSurfaceViewManager(), new ReactDrawerLayoutManager(), new ReactHorizontalScrollViewManager(), new ReactImageManager(), new ReactProgressBarViewManager(), new ReactRawTextManager(), new RecyclerViewBackedScrollViewManager(), new ReactScrollViewManager(), new ReactSwitchManager(), new ReactTextInputManager(), new ReactTextViewManager(), new ReactToolbarManager(), new ReactViewManager(), new ReactViewPagerManager(), new ReactTextInlineImageViewManager(), new ReactVirtualTextViewManager(), new SwipeRefreshLayoutManager(), new ReactWebViewManager()});
    }
}
