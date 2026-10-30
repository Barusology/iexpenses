import React, { createContext, useCallback, useContext, useState } from "react";
import {
  getCookieConsent,
  saveCookieConsent,
} from "@/lib/cookieConsent";
import { disableOptionalScripts } from "@/lib/optionalScripts";

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const [consent, setConsent] = useState(getCookieConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const chooseConsent = useCallback((choice) => {
    const previousConsent = consent;
    saveCookieConsent(choice);
    setConsent(choice);
    setSettingsOpen(false);

    if (choice === "rejected") {
      disableOptionalScripts();
      if (previousConsent === "accepted") window.location.reload();
    }
  }, [consent]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  return (
    <CookieConsentContext.Provider
      value={{ consent, chooseConsent, settingsOpen, openSettings }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
