// ---------------------------------------------------------------------------
// Scooped — Service Worker for Push Notifications
// ---------------------------------------------------------------------------

const APP_ICON = "/icons/apple-touch-icon.png";

// ---------------------------------------------------------------------------
// Push event — show notification
// ---------------------------------------------------------------------------

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Scooped",
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body || "",
    icon: data.icon || APP_ICON,
    badge: APP_ICON,
    tag: data.tag || "scooped-notification",
    data: {
      url: data.url || "/notifications",
    },
    vibrate: [100, 50, 100],
    renotify: !!data.tag,
  };

  event.waitUntil(self.registration.showNotification(data.title || "Scooped", options));
});

// ---------------------------------------------------------------------------
// Notification click — open / focus app
// ---------------------------------------------------------------------------

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Try to focus an existing window
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Otherwise open a new window
      return clients.openWindow(targetUrl);
    })
  );
});

// ---------------------------------------------------------------------------
// Push subscription change — re-subscribe
// ---------------------------------------------------------------------------

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((newSubscription) => {
        // Post message to any open client to save the new subscription
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "PUSH_SUBSCRIPTION_CHANGE",
              subscription: newSubscription.toJSON(),
            });
          });
        });
      })
  );
});
