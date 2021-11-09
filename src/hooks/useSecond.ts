const useSecond = () => {
    const millis = new Date().getTime()
    return Math.floor(millis / 1000)
}

export default useSecond