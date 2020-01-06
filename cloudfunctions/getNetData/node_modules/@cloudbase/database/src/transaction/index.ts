import { Db } from '../index'
import { CollectionReference } from './collection'

const START = 'database.startTransaction'
const COMMIT = 'database.commitTransaction'
const ABORT = 'database.abortTransaction'

interface TransactionAPI {
  send(interfaceName: string, param?: any)
}

export class Transaction {
  private _id: string

  private _db: Db

  private _request: TransactionAPI

  public constructor(db: Db) {
    this._db = db
    this._request = new Db.reqClass(this._db.config)
  }

  async init(): Promise<void> {
    const res = await this._request.send(START)
    if (res.code) {
      throw res
    }
    this._id = res.transactionId
  }

  /**
   * 获取集合的引用
   *
   * @param collName - 集合名称
   */
  public collection(collName: string): CollectionReference {
    if (!collName) {
      throw new Error('Collection name is required')
    }
    return new CollectionReference(this, collName)
  }

  public getTransactionId(): string {
    return this._id
  }

  public getRequestMethod(): TransactionAPI {
    return this._request
  }

  async commit(): Promise<CommitResult> {
    const param = {
      transactionId: this._id
    }
    const res: CommitResult | TcbError = await this._request.send(COMMIT, param)
    if ((res as TcbError).code) throw res
    return res as CommitResult
  }

  async rollback(): Promise<RollbackResult> {
    const param = {
      transactionId: this._id
    }
    const res: RollbackResult | TcbError = await this._request.send(ABORT, param)
    if ((res as TcbError).code) throw res
    return res as RollbackResult
  }
}

export async function startTransaction(): Promise<Transaction> {
  const transaction = new Transaction(this)
  await transaction.init()
  return transaction
}

export async function runTransaction(
  callback: (transaction: Transaction) => void | Promise<any>,
  times: number = 3
): Promise<void> {
  if (times <= 0) {
    throw new Error('Transaction failed')
  }
  try {
    const transaction = new Transaction(this)
    await transaction.init()
    await callback(transaction)
    await transaction.commit()
  } catch (error) {
    console.log(error)
    return runTransaction.bind(this)(callback, --times)
  }
}

interface CommitResult {
  requestId: string
}

interface RollbackResult {
  requestId: string
}

interface TcbError {
  requestId: string
  code: string
  message: string
  stack?: string
}
