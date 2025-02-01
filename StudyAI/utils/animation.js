export const LoadingMessageTime = (option) => {
    const times = {
        "FadeIn":1000,
        "FadeOut":1000,
        "Delay":5000,
        "SafeDelay":100,
        "MessageChangeInterval":7000
    }
    return times[option]
};
export const OutAnimation = (option) => {
    const times = {
        "FadeOutTime":2000,
        "FadeOutPosition":1000,
    }
    return times[option]
};