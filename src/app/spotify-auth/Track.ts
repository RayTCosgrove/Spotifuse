import {Artist} from './Artist';

export interface Track {
  album: Object,
  name: string
  artists: Artist[],
  external_urls: {spotify:string}

}
