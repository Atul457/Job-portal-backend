import { CONSTANTS } from "./constants.js"

// Types
import { IQueueArgs, IQueueRes } from "./types.js"

/**
 * @info takes a function that will be called for each object
 * Count of loops is also given
 * @param taskHandler Function to run for each task
 * @param taskList Array of tasks
 * @param callback Callback function that gets currently processed tasks list
 */
const queue = async (args: IQueueArgs): Promise<IQueueRes[]> => {

    return new Promise((resolve) => {

        // Vars
        const { taskList, taskHandler, callback, useAcc } = args
        let taskListLocal: Array<any> = [];
        let responseList: Array<IQueueRes> = [];
        let front = -1;
        let rear = 0;

        // Burst Enqueue
        const burstEnqueue = () => {
            taskListLocal = [...taskList];
            rear = taskListLocal.length;
            queueHandler()
        }

        // Dequeue
        const dequeue = async () => {

            let status: boolean = false;
            let taskHandlerReturnValue = "NULL"
            let message = "NULL"

            await new Promise(async (resolve) => {
                if (typeof taskHandler === "function") {
                    try {
                        taskHandlerReturnValue = await taskHandler(taskListLocal[front]);
                        status = true;
                    } catch (error: any) {
                        console.log(error)
                        message = error?.message ?? CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;
                        status = false;
                    } finally {
                        responseList[front] = {
                            message,
                            task: taskListLocal[front],
                            status,
                            taskHandlerReturnValue: taskHandlerReturnValue ?? ""
                        }
                        resolve(true)
                    }
                }
            })
        }

        // Queue handler
        const queueHandler = async () => {
            front += 1;
            if (rear > front) {
                await dequeue()
                if (typeof callback === "function") callback(responseList)
                if (useAcc) {
                    const keysToOverWrite = (useAcc?.keysToAccumulate ?? [])
                        .reduce((accumulator: Record<any, any>, currKey) => {
                            if (responseList[responseList.length - 1]?.taskHandlerReturnValue?.[currKey])
                                accumulator[currKey] =
                                    responseList[responseList.length - 1]?.taskHandlerReturnValue?.[currKey]
                            return accumulator
                        }, {})

                    taskListLocal[front + 1] = {
                        ...taskListLocal[front + 1],
                        ...keysToOverWrite,
                    }
                }

                queueHandler()

            }
            else resolve(responseList)
        }

        burstEnqueue()

    })

}

export default queue