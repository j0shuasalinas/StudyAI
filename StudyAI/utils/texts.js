export const IntroductionRandomText = () => {
    const texts = [ 
        "While you're waiting, enjoy some tea!",
        "Getting everything ready for you.",
        "Did you know (Insert fact). I bet you didn't know that did you?",
        "hi josh",
        "knock knock",
        "Note: We (yes we) are coders",
        "josh the nut can",
        "oh salinas",
        "guess what",
    ]
    return texts[Math.floor(Math.random() * texts.length)]
};

export const LoadingText = () => {
    const texts = [ 
        "Loading",
    ]
    return texts[Math.floor(Math.random() * texts.length)]
};