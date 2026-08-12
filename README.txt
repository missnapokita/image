Deploy this folder as a Vercel project named:

bisaya-toolkit-image-proxy

The Bisaya Toolkit patch is already configured to use:

https://bisaya-toolkit-image-proxy.vercel.app/api/image?url=

If Vercel gives you a different domain, change only GITHUB_IMAGE_PROXY_BASE
inside BisayaImageCache.java.

Only raw.githubusercontent.com URLs are proxied.
Other image hosts remain direct.
If the Vercel proxy fails, the app automatically retries the original GitHub RAW URL.
