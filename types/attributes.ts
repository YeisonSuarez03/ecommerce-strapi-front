export interface Attribute {
  id: number
  UID: number
  name: string
}

export interface AttributeValue {
  id: number
  value: string
  attribute: Attribute
}