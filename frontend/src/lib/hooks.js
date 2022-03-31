import React from "react";

export function useProcess(f) {
    const [processing, setProcessing] = React.useState(false)
    const g = (args) => {
        setProcessing(true)
        return f(args).then(
            r => {
                setProcessing(false)
                return Promise.resolve(r)
            },
            e => {
                setProcessing(false)
                return Promise.reject(e)
            })
    }
    return [g, processing];
}