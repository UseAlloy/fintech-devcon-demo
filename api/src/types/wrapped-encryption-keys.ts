export type WrappedEncryptionKey = {
  title: string,
  wrapped_key: string,
  wrapped_key_id: string
}

export type WrappedEncryptionKeyRecord = WrappedEncryptionKey & {
  _id: string
}
