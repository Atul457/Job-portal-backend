/* eslint-disable @typescript-eslint/no-explicit-any */

// Third party imports
import { JwtPayload } from "jsonwebtoken";
import type * as mongoTypes from "mongodb";


type IUsersMap = Map<string, { user_id: string }>;

/**
 * @info Provides functions to check the types
 */
type ITypeCheck = {
  isObject: ITypeCheckKeys;
  isNumber: ITypeCheckKeys;
  isString: ITypeCheckKeys;
  isFunction: ITypeCheckKeys;
  isUndefined: ITypeCheckKeys;
  isBool: ITypeCheckKeys;
};

/**
 * @info Listener for socket
 */
// type ISocketListenerFn = (socket: ISocket) => void;

/**
 * @param value Value to check
 */
type ITypeCheckKeys = (value: any) => boolean;

//%%%%%%%%%%%%%%%%%%%%%%%%%%//

// Controllers type defs

//########################//

// UserController

type IUserExistsFnArgsWithEmail = {
  email: string;
  password?: string;
  phone?: string;
}

type IUserExistsFnArgsWithPhone = {
  email?: string;
  password?: string;
  phone: string
}

type IUserExistsFn = (args:
  IUserExistsFnArgsWithEmail |
  IUserExistsFnArgsWithPhone
) => Promise<{ status: boolean; doc: mongoTypes.Document | null | undefined }>;


type ICompanyExistsFn = (
  companyId: string,
  userId: string
) => Promise<{ status: boolean; doc: mongoTypes.Document | null | undefined }>;


type IQueueRes = {
  status: boolean,
  task: any,
  taskHandlerReturnValue: any,
  message: string
}

type IQueueArgs = {
  taskList: Array<any>,
  taskHandler: (arg: any) => any,
  callback?: (res: IQueueRes[]) => any,
  useAcc?: {
    keysToAccumulate: string[]
  }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%//

//%%%%%%%%%%%%%%%%%%%%%%%%%%//

// Configs types

//#########################//

type IMongoCollection = {
  users?: mongoTypes.Collection;
  companies?: mongoTypes.Collection;
  jobs?: mongoTypes.Collection;
};

type IConnectToDbFn = () => Promise<{ status: boolean; message?: string }>;

//#########################//

//%%%%%%%%%%%%%%%%%%%%%%%%%%//

//%%%%%%%%%%%%%%%%%%%%%%%%%%//

// Utils file types

//#########################//

// files.util.ts

type splitFileNameAndExtFn = (
  fullFileName: string,
  addDotToExtension?: boolean
) => {
  fileName: string;
  extension: string;
};

type IBytesHelper = (bytes: number, to: "mb" | "gb" | "kb") => number

// api.util.ts

type IGenerateResFn = {
  status: boolean,
  statusCode: number,
  message?: string,
  data?: any
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%//

// Middlewares

type IErrorHandlerServiceArgs = undefined | null | {
  message?: string,
  status?: number
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%//


// Services

type IJwtCreateToken = { token: string }

type IVerifyJwtToken = ({
  error: string,
  decodedData?: {
    data: {
      _id: string,
      email: string
    }
  }
} | {
  decodedData: {
    data: {
      _id: string,
      email: string
    }
  },
  error?: string
})

type IJwtTypes = {
  createToken: IJwtCreateToken,
  verifyToken: IVerifyJwtToken
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%//



export { IUserExistsFn };

export { ICompanyExistsFn };

export { IQueueRes, IQueueArgs };

export { splitFileNameAndExtFn, IBytesHelper, IGenerateResFn };

export { IMongoCollection, IConnectToDbFn };

export { ITypeCheck, ITypeCheckKeys, IUsersMap };

export { IErrorHandlerServiceArgs }

export { IJwtTypes }
