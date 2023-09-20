// 中间件
// monkey
function patchLog(store) {
    const next = store.dispatch
    store.dispatch = function (action) {
        console.log();
        const result = next(action)
        return result
    }
}

// 隐藏
function logger(store) {
    const next = store.dispatch
    return function dispatchLog(action) {
        next(action)
        
    }
}
