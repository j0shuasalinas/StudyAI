export const LoadingMessageTime = (option) => {
    const times = {
        "FadeIn":1000,
        "FadeOut":1000,
        "Delay":5000,
        "MessageChangeInterval":7000
    }
    return times[option]
};