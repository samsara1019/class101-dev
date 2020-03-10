/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.3"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-1d0aae8233365ac9fda8.js"
  },
  {
    "url": "styles.d67f45c05a229c5d838d.css"
  },
  {
    "url": "styles-d83a0e2393e6d069064d.js"
  },
  {
    "url": "commons-78867ae2fb43ebeaf31e.js"
  },
  {
    "url": "app-d71b3d4ad3304b728afd.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-17d9fd5a9b10c16eb09c.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "3a1ef67976127a46d0f2b4e4d4e2e284"
  },
  {
    "url": "google-fonts/s/notosanskr/v12/Pby7FmXiEBPT4ITbgNA5CgmOalv477IR.woff2",
    "revision": "04e782e08729f3725ae5a9c95da0c8ba"
  },
  {
    "url": "google-fonts/s/notosanskr/v12/Pby7FmXiEBPT4ITbgNA5CgmOelz477IR.woff2",
    "revision": "4f773a0fce88aa857d70b56c5b0a1d26"
  },
  {
    "url": "google-fonts/s/notosanskr/v12/PbykFmXiEBPT4ITbgNA5CgmG0X7t.woff2",
    "revision": "be09f2ced7ff9fa6eda5f0416e2fc840"
  },
  {
    "url": "google-fonts/s/sourcecodepro/v11/HI_SiYsKILxRpg3hIP6sJ7fM7PqlPevW.woff2",
    "revision": "982234eca7d717dd9784d15519ece2f8"
  },
  {
    "url": "google-fonts/s/sourcecodepro/v11/HI_XiYsKILxRpg3hIP6sJ7fM7Pqt4s_Ds-cq.woff2",
    "revision": "3036a9fd64c64be915eb1dbcfb6a51cf"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "b459b65276f141ee353adb92c8ca7636"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, workbox.strategies.cacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\page-data\/.*\/page-data\.json/, workbox.strategies.networkFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, workbox.strategies.staleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, workbox.strategies.staleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */

importScripts(`idb-keyval-iife.min.js`)

const { NavigationRoute } = workbox.routing

const navigationRoute = new NavigationRoute(async ({ event }) => {
  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-d71b3d4ad3304b728afd.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  return await caches.match(offlineShell)
})

workbox.routing.registerRoute(navigationRoute)

const messageApi = {
  setPathResources(event, { path, resources }) {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources(event) {
    event.waitUntil(idbKeyval.clear())
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi } = event.data
  if (gatsbyApi) messageApi[gatsbyApi](event, event.data)
})
