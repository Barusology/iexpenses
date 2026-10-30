const GOOGLE_ANALYTICS_ID = "G-TC0NR5Q0L9";
const POSTHOG_KEY = "phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs";
const POSTHOG_METHODS = [
  "capture", "identify", "alias", "people.set", "people.set_once", "people.unset",
  "people.increment", "people.append", "people.remove", "group", "reset",
  "register", "register_once", "unregister", "opt_out_capturing",
  "opt_in_capturing", "has_opted_out_capturing", "has_opted_in_capturing",
  "clear_opt_in_out_capturing", "startSessionRecording", "stopSessionRecording",
  "sessionRecordingStarted", "get_distinct_id", "get_session_id",
];

function addScript(id, src) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  script.addEventListener("error", () => {
    console.error(`Failed to load optional script: ${src}`);
  }, { once: true });
  document.head.appendChild(script);
}

export function initializeGoogleAnalytics(pageLocation) {
  if (typeof window.gtag === "function") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("set", "page_location", pageLocation);
  window.gtag("config", GOOGLE_ANALYTICS_ID, { send_page_view: false });
  addScript(
    "google-analytics-script",
    `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
  );
}

export function initializePostHog() {
  if (window.posthog?.__SV) return;

  const posthog = window.posthog || [];
  window.posthog = posthog;
  posthog._i = [];
  posthog.init = function init(apiKey, options, instanceName) {
    const script = document.createElement("script");
    script.id = "posthog-script";
    script.type = "text/javascript";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.src = `${options.api_host.replace(".i.posthog.com", "-assets.i.posthog.com")}/static/array.js`;
    script.addEventListener("error", () => {
      console.error("Failed to load the PostHog analytics script.");
    }, { once: true });
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    let instance = posthog;
    if (instanceName) {
      instance = posthog[instanceName] = [];
    } else {
      instanceName = "posthog";
    }
    instance.people = instance.people || [];
    instance.toString = function toString(verbose) {
      return `${instanceName}${verbose ? " (stub)" : ""}`;
    };
    instance.people.toString = function peopleToString() {
      return `${instanceName}.people (stub)`;
    };
    POSTHOG_METHODS.forEach((method) => {
      let target = instance;
      let methodName = method;
      const parts = method.split(".");
      if (parts.length === 2) {
        target = instance[parts[0]] = instance[parts[0]] || [];
        methodName = parts[1];
      }
      target[methodName] = function queueCall(...args) {
        target.push([methodName, ...args]);
      };
    });
    posthog._i.push([apiKey, options, instanceName]);
  };
  posthog.__SV = 1;
  posthog.init(POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    session_recording: {
      recordCrossOriginIframes: true,
      capturePerformance: false,
    },
  });
}

export function initializeAdsense() {
  addScript(
    "google-adsense-script",
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5817549134036094",
  );
  const script = document.getElementById("google-adsense-script");
  if (script) script.crossOrigin = "anonymous";
}

export function disableOptionalScripts() {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.posthog?.opt_out_capturing?.();
  document.getElementById("google-analytics-script")?.remove();
  document.getElementById("google-adsense-script")?.remove();
  document.getElementById("posthog-script")?.remove();

  const analyticsCookies = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)|^_gac_|^_gcl_/.test(name));
  analyticsCookies.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  });
}
