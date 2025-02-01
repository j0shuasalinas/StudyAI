export const IntroductionRandomText = () => {
    const texts = [ 
        "While your waiting, enjoy some tea!",
        "Getting everything ready for you.",
        "Did you know (Insert fact). I bet you didn't know that did you?",
        "hi josh"
    ]
    return texts[Math.floor(Math.random() * texts.length)]
};

export const LoadingText = () => {
    const texts = [ 
        "Loading",
    ]
    return texts[Math.floor(Math.random() * texts.length)]
};