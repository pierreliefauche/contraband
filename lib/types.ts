export type DealerConfig = {
  id: string
  urls: string[]
  disableScripting?: boolean,
  extract: {
    items: string
    url: string
    brand?: string
    title?: string
    description?: string
    price?: string
    images?: string[]
    sold?: {
      selector?: string
      is?: string
      includes?: string
    }
  }
}

export type DealerProcessor = {
  postFetch?: (data: string) => string
  postHydrate?: (item: Item) => Item
  postClean?: (item: ItemExtract) => ItemExtract
  postExtract?: (item: ItemExtract) => ItemExtract
}

export type ItemExtract = {
  url: string
  brand?: string | undefined
  title?: string | undefined
  description?: string | undefined
  images?: string[]
  price?: {
    raw?: string | undefined,
    amount?: number | undefined,
    currency?: string | undefined
  }
  sold: boolean
}

export type Item = ItemExtract & {
  id: string
  dealerId: string
}