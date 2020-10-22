const crypto = require('crypto');


const sha256 = (payload: any) => crypto.createHash('sha256').digest(payload);

class MerkleTree {
  private leaves: Buffer[];
  private depth: number;
  private layers: any[]
  /* indicate whether leaves hashed by given `hashFunc` */
  private useHash: boolean;

  constructor(leaves: any[], hashFunc: any = sha256, useHash: boolean) {
    this.leaves = leaves.map(this._toBuffer);
    if (useHash) {
      this.leaves.map(hashFunc)
    }
    this.layers = [this.leaves];
  }

  
  private _toBuffer(value: any): Buffer {
    return MerkleTree.toBuffer(value);
  }


  static toBuffer(value: any): Buffer {
    if (Buffer.isBuffer(value)) return value;
    if (typeof value === 'string') return Buffer.from(value);
    throw new Error(`accept string type, but recieved ${typeof value}`);
  }

  private getLeaves(): Buffer[] {
    return this.leaves;
  };

  public getRoot ():Buffer {
    return this.layers[this.layers.length - 1][0] || Buffer.from([])
  }

  public getProof (leaf: Buffer, index?: number): any[] {
    leaf = this._toBuffer(leaf)
    const proof = []

    if (typeof index !== 'number') {
      index = -1

      for (let i = 0; i < this.leaves.length; i++) {
        if (Buffer.compare(leaf, this.leaves[i]) === 0) {
          index = i
        }
      }
    }

    if (index <= -1) {
      return []
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      const isRightNode = index % 2
      const pairIndex = (isRightNode ? index - 1 : index + 1)

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: layer[pairIndex]
        })
      }

      // set index to parent index
      index = (index / 2) | 0
    }

    return proof
    
  }

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

  static print (tree: any):void {
    console.log(tree.toString())
  }

}

export default MerkleTree;