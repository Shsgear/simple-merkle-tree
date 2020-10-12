const { MerkleTree } = require('merkletreejs');
const sha256 = require('crypto-js/sha256');

const leaves = ['a', 'b', 'c'].map((x) => sha256(x));


const tree = new MerkleTree(leaves, sha256);
const root = tree.getRoot().toString('hex')

const leaf = sha256('a');
const proof = tree.getProof(leaf);

console.log(tree.verify(proof, leaf, root));

MerkleTree.print(tree);