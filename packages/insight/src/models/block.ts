export class Block {
  public readonly height: number;
  public readonly size: number;
  public readonly hash: string;
  public readonly timestamp: number;
  public readonly transactionCount: number;
  public readonly floData: string;
  public readonly poolName: string;

  constructor(properties: InsightBlockObject) {
    this.height = properties.height;
    this.size = properties.size;
    this.hash = properties.hash;
    this.timestamp = properties.time;
    this.transactionCount = properties.txlength;
    this.floData = properties.floData;
    this.poolName = properties.poolInfo && properties.poolInfo.poolName;
  }

  public getDate(): Date {
    return new Date(this.timestamp * 1000);
  }
}

export interface InsightBlockObject {
  height?: number;
  size?: number;
  hash?: string;
  time?: number;
  txlength?: number;
  floData: string,
  poolInfo?: {
    poolName?: string;
    url?: string;
  };
}
