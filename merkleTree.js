"use strict";
exports.__esModule = true;
var crypto = require('crypto');
var sha256 = function (payload) { return crypto.createHash('sha256').digest(payload); };
var MerkleTree = /** @class */ (function () {
    function MerkleTree(leaves, hashFunc, useHash) {
        if (hashFunc === void 0) { hashFunc = sha256; }
        this.leaves = leaves.map(this._toBuffer);
        if (useHash) {
            this.leaves.map(hashFunc);
        }
        this.layers = [this.leaves];
    }
    MerkleTree.prototype._toBuffer = function (value) {
        return MerkleTree.toBuffer(value);
    };
    MerkleTree.toBuffer = function (value) {
        if (Buffer.isBuffer(value))
            return value;
        if (typeof value === 'string')
            return Buffer.from(value);
        throw new Error("accept string type, but recieved " + typeof value);
    };
    MerkleTree.prototype.getLeaves = function () {
        return this.leaves;
    };
    ;
    MerkleTree.prototype.getRoot = function () {
        return this.layers[this.layers.length - 1][0] || Buffer.from([]);
    };
    MerkleTree.prototype.getProof = function (leaf, index) {
        leaf = this._toBuffer(leaf);
        var proof = [];
        if (typeof index !== 'number') {
            index = -1;
            for (var i = 0; i < this.leaves.length; i++) {
                if (Buffer.compare(leaf, this.leaves[i]) === 0) {
                    index = i;
                }
            }
        }
        if (index <= -1) {
            return [];
        }
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            var isRightNode = index % 2;
            var pairIndex = (isRightNode ? index - 1 : index + 1);
            if (pairIndex < layer.length) {
                proof.push({
                    position: isRightNode ? 'left' : 'right',
                    data: layer[pairIndex]
                });
            }
            // set index to parent index
            index = (index / 2) | 0;
        }
        return proof;
    };
    MerkleTree.prototype.verify = function (proof, targetNode, root) {
        var hash = this._toBuffer(targetNode);
        root = this._toBuffer(root);
        if (!Array.isArray(proof) ||
            !targetNode ||
            !root) {
            return false;
        }
        for (var i = 0; i < proof.length; i++) {
            var node = proof[i];
            var data = null;
            var isLeftNode = null;
            // NOTE: case for when proof is hex values only
            if (typeof node === 'string') {
                data = this._toBuffer(node);
                isLeftNode = true;
            }
            else {
                data = node.data;
                isLeftNode = (node.position === 'left');
            }
            var buffers = [];
            buffers.push(hash);
            buffers[isLeftNode ? 'unshift' : 'push'](data);
        }
        return Buffer.compare(hash, root) === 0;
    };
    MerkleTree.print = function (tree) {
        console.log(tree.toString());
    };
    return MerkleTree;
}());
exports["default"] = MerkleTree;
