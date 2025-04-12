const ICONS = {
    on: {
        16: "icons/icon-on.png",
        32: "icons/icon-on.png",
        48: "icons/icon-on.png",
        128: "icons/icon-on.png"
    },
    off: {
        16: "icons/icon-off.png",
        32: "icons/icon-off.png",
        48: "icons/icon-off.png",
        128: "icons/icon-off.png"
    }
};
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ active: false }, () => {
        chrome.action.setIcon({ path: ICONS.off });
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    const { active } = await chrome.storage.local.get("active");
    const newState = !active;

    chrome.storage.local.set({ active: newState });
    chrome.storage.local.set({ current_url: tab.url });
    chrome.action.setIcon({ path: newState ? ICONS.on : ICONS.off });


    console.log("Extension is now", newState ? "ACTIVE" : "INACTIVE");
});

chrome.tabs.onCreated.addListener(async(tab) => {
    const { active, current_url } = await chrome.storage.local.get(["active","current_url"]);
    if(!active) return;
    const url = tab.pendingUrl || tab.url;
    
    console.log(url, current_url)
    if (!url || ["chrome://newtab/", current_url].filter((d) => url.includes(d)).length === 0) {
        console.log("Closing tab:", url);
        chrome.tabs.remove(tab.id);
    }
});