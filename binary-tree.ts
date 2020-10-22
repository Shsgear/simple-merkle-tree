class BinaryNode {
  value: any;
  left: BinaryNode;
  right: BinaryNode;

  constructor(value, left: BinaryNode, right: BinaryNode) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * BST
 * The left subtree of a node is less than or equal to it’s parent node’s key
 * The right subtree of a node is greater than or equal to it’s parent node’s key
 *  
 */
class BinarySearchTree {
  root: BinaryNode;
  constructor() {
    this.root = null;
  }

  insertNode (node,newNode) {
    if(newNode.key < node.key){
      if(node.left === null){ // 没有左孩子，则新增左孩子
        node.left = newNode;
      }else{
        //如果有左孩子插入左孩子节点
        this.insertNode(node.left,newNode);
      }
    }else {
      //如果有孩子为null，则新增右孩子
      if (node.right === null){
        node.right = newNode;
      } else {
        //如果有左孩子，插入右孩子节点
        this.insertNode(node.right, newNode);
      }
    }
  };
}
