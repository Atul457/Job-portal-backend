var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CONSTANTS } from "./constants.js";
/**
 * @info takes a function that will be called for each object
 * Count of loops is also given
 * @param taskHandler Function to run for each task
 * @param taskList Array of tasks
 * @param callback Callback function that gets currently processed tasks list
 */
const queue = (args) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        // Vars
        const { taskList, taskHandler, callback, useAcc } = args;
        let taskListLocal = [];
        let responseList = [];
        let front = -1;
        let rear = 0;
        // Burst Enqueue
        const burstEnqueue = () => {
            taskListLocal = [...taskList];
            rear = taskListLocal.length;
            queueHandler();
        };
        // Dequeue
        const dequeue = () => __awaiter(void 0, void 0, void 0, function* () {
            let status = false;
            let taskHandlerReturnValue = "NULL";
            let message = "NULL";
            yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (typeof taskHandler === "function") {
                    try {
                        taskHandlerReturnValue = yield taskHandler(taskListLocal[front]);
                        status = true;
                    }
                    catch (error) {
                        message = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;
                        status = false;
                    }
                    finally {
                        responseList[front] = {
                            message,
                            task: taskListLocal[front],
                            status,
                            taskHandlerReturnValue: taskHandlerReturnValue !== null && taskHandlerReturnValue !== void 0 ? taskHandlerReturnValue : ""
                        };
                        resolve(true);
                    }
                }
            }));
        });
        // Queu handler
        const queueHandler = () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            front += 1;
            if (rear > front) {
                yield dequeue();
                if (typeof callback === "function")
                    callback(responseList);
                if (useAcc) {
                    const keysToOverWrite = ((_b = useAcc === null || useAcc === void 0 ? void 0 : useAcc.keysToAccumulate) !== null && _b !== void 0 ? _b : [])
                        .reduce((accumulator, currKey) => {
                        var _a, _b, _c, _d;
                        if ((_b = (_a = responseList[responseList.length - 1]) === null || _a === void 0 ? void 0 : _a.taskHandlerReturnValue) === null || _b === void 0 ? void 0 : _b[currKey])
                            accumulator[currKey] =
                                (_d = (_c = responseList[responseList.length - 1]) === null || _c === void 0 ? void 0 : _c.taskHandlerReturnValue) === null || _d === void 0 ? void 0 : _d[currKey];
                        return accumulator;
                    }, {});
                    taskListLocal[front + 1] = Object.assign(Object.assign({}, taskListLocal[front + 1]), keysToOverWrite);
                }
                queueHandler();
            }
            else
                resolve(responseList);
        });
        burstEnqueue();
    });
});
export default queue;
//# sourceMappingURL=queue.util.js.map