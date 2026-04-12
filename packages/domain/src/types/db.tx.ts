declare const DbTxBrand: unique symbol
export type DbTx = { readonly [DbTxBrand]: never }
