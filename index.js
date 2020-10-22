// const { MerkleTree } = require('merkletreejs');
const MerkleTree = require('./merkleTree.js').default;
const sha256 = require('crypto-js/sha256');

const leaves = ['a', 'b', 'c']


const tree = new MerkleTree(leaves, sha256, false);
const root = tree.getRoot().toString('hex')

// MerkleTree.print(tree);
console.log(root)
const leaf = 'a';
const proof = tree.getProof(leaf);

console.log(tree.verify(proof, leaf, root));

// MerkleTree.print(tree);




