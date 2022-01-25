export type ITreeNode<T> = T & {
  children?: T[];
};
