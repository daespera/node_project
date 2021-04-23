
const cacheName = 'static-asset-v0';
const apiEndpoint = '';

const cacheAssets = [
  '/offline',
  '/favicon.ico',
  '/js/0.chunk.js',
  '/js/bundle.js',
  '/js/main.chunk.js',
  '/reload/reload.js'
]

self.addEventListener('install', event => {
  console.log('Service Worker Install');
  event.waitUntil(
    caches
    .open(cacheName)
    .then(cache => {
      console.log("cache files")
      cache.addAll(cacheAssets)
    })
    .then( ()=> self.skipWaiting())
  );
});

self.addEventListener('install', event => {
  const preCache = async () => {
    console.log('Service Worker Install');
    const cache = await caches.open(cacheName);
    console.log("cache files")
    await cache.addAll(cacheAssets);
    self.skipWaiting();
  };
  event.waitUntil(preCache());
});

self.addEventListener('activate', event => {
  const activateEvent = async () => {
    console.log('Service Worker Activate');
    const keys = await caches.keys(),
    deletions = keys
    .map(
      key =>{
        if (key !== cacheName){
          caches.delete(key)
        }
      }
    );
      for (const success of deletions) {
        await success;
      }
  };

  event.waitUntil(activateEvent());
});

self.addEventListener('fetch', event => {
  console.log("fetching");
  const cacheAsset = async (request, response) => {
    console.log("request " + event.request.url);
    console.log(request);
    if (request.url.match( '^.*(\/rest_proxy).*$' ) ||
      request.method == 'POST' || 
      response.type === "error" || 
      response.type === "opaque") {
      return Promise.resolve(); // do not put in cache network errors
    }
    let cache = await caches.open(cacheName);
    return cache.put(request, response.clone());
  };
  const fetchEvent =  async () => {
    let response = await caches.match(event.request);
    console.log("cache response " + event.request.url);
    console.log(response);
    if (response != undefined)
      return response;
    try {
      response = await fetch(event.request);
      console.log("fetch response " + event.request.url);
      console.log(response);
      await cacheAsset(event.request, response);
      return response; 
    }catch(e){
      console.log('error ' + event.request.url);
      console.log(e.message)

      let response = event.request.url.match( '^.*(\/rest_proxy).*$' ) ? {"test":1} : await caches.match('/offline');
      console.log("catch response /offline");
      console.log(response);
      return response;
    }



    /*try{
      const url = new URL(event.request.url);
        let response = await fetch(event.request);
        console.log("response");
        console.log(response);

        const responseClone = response.clone(),
        cache = await caches.open(cacheName);
        cache.put(event.request, responseClone);
        return response;
    }catch(e){
      console.log('eroor');
      console.log(e.message)
      let response = await caches.match(event.request);
      return (response == undefined) ? await caches.match('/offline') : response;
    }*/
  };
    event.respondWith(fetchEvent());
});