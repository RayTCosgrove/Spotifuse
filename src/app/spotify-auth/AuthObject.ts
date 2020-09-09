import {Item} from './Item'
export interface AuthObject {
  href: string,
  items: Item[],
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number
  id: string
}
