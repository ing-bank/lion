# Ajax Cache

## Technical documentation

The library consists of 2 major parts:

1. A cache class
2. Request and Response Interceptors

### Cache class

The cache class is responsible for keeping cached data and keeping it valid.
This class isn't exposed outside, and remains private. Together with this class
we provide a `getCache(cacheIdentifier)` method that enforces a clean cache when
the `cacheIdentifier` changes.

> **Note**: the `cacheIdentifier` should be bound to the users session.  
> Advice: Use the sessionToken as cacheIdentifier

Core invalidation rules are:

1. The `LionCache` instance is bound to a `cacheIdentifier`. When the `getCache`
   receives another token, all instances of `LionCache` will be invalidated.
2. The `LionCache` instance is created with an expiration date **one hour** in
   the future. Each method on the `LionCache` validates that this time hasn't
   passed, and if it does, the cache object in the `LionCache` is cleared.

### Request and Response Interceptors

The interceptors are the core of the logic of when to cache.

To make the cache mechanism work, these interceptors have to be added to an ajax instance (for caching needs).

The **request interceptor**'s main goal is to determine whether or not to
**return the cached object**. This is done based on the options that are being
passed to the factory function.

The **response interceptor**'s goal is to determine **when to cache** the
requested response, based on the options that are being passed in the factory
function.

Interceptors require `cacheIdentifier` function and `cacheOptions` config.
The configuration is used by the interceptors to determine what to put in the cache and when to use the cached data.

A cache configuration per action (pre `get` etc) can be placed in ajax configuration in `lionCacheOptions` field, it needed for situations when you want your, for instance, `get` request to have specific cache parameters, like `timeToLive`.

## Decisions

### Service Worker

We used to have an implementation in the service worker, but we've chosen not to
use it.

The main reason was that a service worker is not available for IE11. Previously
we had the Redux store that we used to cache responses and share the data
between features that needed it. This was also to relieve the backend from
receiving too many calls. Now that service workers aren't available in IE11, we
would see an increase in calls to the particular APIs. This was unacceptable.
