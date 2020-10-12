import crypto from 'crypto';


const sha256 = (payload: any) => crypto.createHash('sha256').digest(payload);

class MerkleTree1 {
  private leaves: Buffer[];
  private depth: number;
  private layers: any[]
  /* indicate whether leaves hashed by given `hashFunc` */
  private useHash: boolean;

  constructor(leaves: any[], hashFunc: any = sha256, useHash: boolean) {
    if (useHash) {
      this.leaves.map(hashFunc)
    }
    this.leaves = leaves.map(this._toBuffer);
    this.layers = [this.leaves];
  }

  
  private _toBuffer(value: any): Buffer {
    return MerkleTree1.toBuffer(value);
  }


  static toBuffer(value: any): Buffer {
    if (Buffer.isBuffer(value)) return value;
    if (typeof value === 'string') Buffer.from(value);
    throw new Error(`accept string type, but recieved ${typeof value}`);
  }

  private getLeaves(): Buffer[] {
    return this.leaves;
  };

  public print: () => string;

  

  public verify (proof: any[], targetNode: Buffer, root: Buffer): boolean {
  
    let hash = this._toBuffer(targetNode)
    root = this._toBuffer(root)


    if (
      !Array.isArray(proof) ||
      !targetNode ||
      !root
    ) {
      return false
    }
  
    for (let i = 0; i < proof.length; i++) {
      const node = proof[i]
      let data: any = null
      let isLeftNode = null
  
      // NOTE: case for when proof is hex values only
      if (typeof node === 'string') {
        data = this._toBuffer(node)
        isLeftNode = true
      } else {
        data = node.data
        isLeftNode = (node.position === 'left')
      }
  
      const buffers: any[] = []
  
      buffers.push(hash)
      buffers[isLeftNode ? 'unshift' : 'push'](data)
    }
  
    return Buffer.compare(hash, root) === 0
  }

  

}

export default MerkleTree1;